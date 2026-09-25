import { ExtractedInvoice, AuditReport, AuditFlag } from './schema';
import { isValidPortugueseNIF } from './nif';

/**
 * Deterministic Financial Audit Engine
 * 
 * Runs strict arithmetic, fiscal checksum, and chronological validation checks
 * on extracted document data.
 */
export function auditInvoice(invoice: ExtractedInvoice): AuditReport {
  const flags: AuditFlag[] = [];

  // Helper to round to 2 decimal places to avoid JS floating point issues
  const roundCurrency = (val: number) => Math.round(val * 100) / 100;

  // 1. Tax Identifiers (NIF) Validation
  if (invoice.issuerVat) {
    const isIssuerNifValid = isValidPortugueseNIF(invoice.issuerVat);
    if (!isIssuerNifValid) {
      flags.push({
        code: 'INVALID_ISSUER_VAT',
        severity: 'error',
        field: 'issuerVat',
        message: `Issuer VAT/NIF '${invoice.issuerVat}' failed checksum validation.`,
        actual: invoice.issuerVat,
      });
    }
  }

  if (invoice.recipientVat) {
    const isRecipientNifValid = isValidPortugueseNIF(invoice.recipientVat);
    if (!isRecipientNifValid) {
      flags.push({
        code: 'INVALID_RECIPIENT_VAT',
        severity: 'error',
        field: 'recipientVat',
        message: `Recipient VAT/NIF '${invoice.recipientVat}' failed checksum validation.`,
        actual: invoice.recipientVat,
      });
    }
  }

  // 2. Date Sequence Validation
  if (invoice.issueDate && invoice.dueDate) {
    const issue = new Date(invoice.issueDate);
    const due = new Date(invoice.dueDate);

    if (isNaN(issue.getTime())) {
      flags.push({
        code: 'INVALID_ISSUE_DATE_FORMAT',
        severity: 'error',
        field: 'issueDate',
        message: `Issue date '${invoice.issueDate}' is not a valid date.`,
      });
    }

    if (isNaN(due.getTime())) {
      flags.push({
        code: 'INVALID_DUE_DATE_FORMAT',
        severity: 'error',
        field: 'dueDate',
        message: `Due date '${invoice.dueDate}' is not a valid date.`,
      });
    }

    if (!isNaN(issue.getTime()) && !isNaN(due.getTime()) && due < issue) {
      flags.push({
        code: 'INVALID_DATE_SEQUENCE',
        severity: 'error',
        field: 'dueDate',
        message: `Due date (${invoice.dueDate}) cannot precede Issue date (${invoice.issueDate}).`,
        expected: `>= ${invoice.issueDate}`,
        actual: invoice.dueDate,
      });
    }
  }

  // 3. Subtotal + VAT = Total Check
  const calculatedTotal = roundCurrency(invoice.subtotal + invoice.vatAmount);
  const statedTotal = roundCurrency(invoice.total);
  const totalDifference = Math.abs(calculatedTotal - statedTotal);

  if (totalDifference > 0.02) {
    flags.push({
      code: 'TOTAL_MISMATCH',
      severity: 'error',
      field: 'total',
      message: `Invoice total (${statedTotal}) does not match subtotal (${invoice.subtotal}) + VAT (${invoice.vatAmount}) = ${calculatedTotal}.`,
      expected: calculatedTotal,
      actual: statedTotal,
    });
  }

  // 4. Line Items Sum vs Subtotal Check
  const itemsSubtotal = roundCurrency(
    invoice.items.reduce((sum, item) => sum + item.amount, 0)
  );

  if (Math.abs(itemsSubtotal - roundCurrency(invoice.subtotal)) > 0.02) {
    flags.push({
      code: 'ITEMS_SUM_MISMATCH',
      severity: 'warning',
      field: 'subtotal',
      message: `Sum of line item amounts (${itemsSubtotal}) does not equal stated invoice subtotal (${invoice.subtotal}).`,
      expected: itemsSubtotal,
      actual: invoice.subtotal,
    });
  }

  // 5. Individual Item Quantity * Unit Price Check
  invoice.items.forEach((item, index) => {
    const expectedAmount = roundCurrency(item.quantity * item.unitPrice);
    const actualAmount = roundCurrency(item.amount);

    if (Math.abs(expectedAmount - actualAmount) > 0.02) {
      flags.push({
        code: 'ITEM_CALCULATION_ERROR',
        severity: 'error',
        field: `items[${index}].amount`,
        message: `Item #${index + 1} (${item.description}) amount (${actualAmount}) does not match quantity (${item.quantity}) * unitPrice (${item.unitPrice}) = ${expectedAmount}.`,
        expected: expectedAmount,
        actual: actualAmount,
      });
    }
  });

  // Calculate overall Audit Score (0 - 100)
  const errorCount = flags.filter(f => f.severity === 'error').length;
  const warningCount = flags.filter(f => f.severity === 'warning').length;

  let score = 100 - (errorCount * 25 + warningCount * 10);
  if (score < 0) score = 0;

  return {
    isValid: errorCount === 0,
    score,
    flags,
    summary: {
      totalItems: invoice.items.length,
      errorCount,
      warningCount,
    },
  };
}
