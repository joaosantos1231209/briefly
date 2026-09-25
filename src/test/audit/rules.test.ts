import { describe, it, expect } from 'vitest';
import { isValidPortugueseNIF } from '@/lib/audit/nif';
import { auditInvoice } from '@/lib/audit/rules';
import { ExtractedInvoice } from '@/lib/audit/schema';

describe('Portuguese NIF Checksum Validation', () => {
  it('should validate correct company and individual NIFs', () => {
    expect(isValidPortugueseNIF('509900011')).toBe(true);
    expect(isValidPortugueseNIF('PT509900011')).toBe(true);
    expect(isValidPortugueseNIF('501100016')).toBe(true);
  });

  it('should reject invalid NIFs', () => {
    expect(isValidPortugueseNIF('123456780')).toBe(false); // Bad checksum
    expect(isValidPortugueseNIF('023456789')).toBe(false); // Invalid prefix '0'
    expect(isValidPortugueseNIF('12345')).toBe(false);     // Wrong length
    expect(isValidPortugueseNIF('')).toBe(false);          // Empty
  });
});

describe('Financial Audit Rules Engine', () => {
  const validInvoice: ExtractedInvoice = {
    documentNumber: 'FT-2026/001',
    issueDate: '2026-03-01',
    dueDate: '2026-03-31',
    issuerName: 'Tech Solutions Lda',
    issuerVat: '509900011',
    recipientName: 'Client Corp SA',
    recipientVat: '501100016',
    currency: 'EUR',
    subtotal: 1000,
    vatAmount: 230,
    total: 1230,
    items: [
      {
        description: 'Software Consulting',
        quantity: 10,
        unitPrice: 100,
        amount: 1000,
        vatRate: 23,
      },
    ],
  };

  it('should return score 100 and zero errors for a perfectly valid invoice', () => {
    const report = auditInvoice(validInvoice);
    expect(report.isValid).toBe(true);
    expect(report.score).toBe(100);
    expect(report.flags).toHaveLength(0);
    expect(report.summary.errorCount).toBe(0);
  });

  it('should detect invalid NIFs for issuer and recipient', () => {
    const invalidNifInvoice: ExtractedInvoice = {
      ...validInvoice,
      issuerVat: '111111111',
    };

    const report = auditInvoice(invalidNifInvoice);
    expect(report.isValid).toBe(false);
    expect(report.flags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'INVALID_ISSUER_VAT',
          severity: 'error',
          field: 'issuerVat',
        }),
      ])
    );
  });

  it('should detect when due date is before issue date', () => {
    const invalidDateInvoice: ExtractedInvoice = {
      ...validInvoice,
      issueDate: '2026-03-31',
      dueDate: '2026-03-01',
    };

    const report = auditInvoice(invalidDateInvoice);
    expect(report.isValid).toBe(false);
    expect(report.flags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'INVALID_DATE_SEQUENCE',
          severity: 'error',
          field: 'dueDate',
        }),
      ])
    );
  });

  it('should detect arithmetic mismatch between subtotal + VAT and Total', () => {
    const mismatchedTotalInvoice: ExtractedInvoice = {
      ...validInvoice,
      subtotal: 1000,
      vatAmount: 230,
      total: 1500, // Should be 1230
    };

    const report = auditInvoice(mismatchedTotalInvoice);
    expect(report.isValid).toBe(false);
    expect(report.flags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'TOTAL_MISMATCH',
          severity: 'error',
          field: 'total',
          expected: 1230,
          actual: 1500,
        }),
      ])
    );
  });

  it('should detect item level calculation errors (quantity * unitPrice !== amount)', () => {
    const badItemInvoice: ExtractedInvoice = {
      ...validInvoice,
      items: [
        {
          description: 'Custom Development',
          quantity: 5,
          unitPrice: 100,
          amount: 999, // Should be 500
          vatRate: 23,
        },
      ],
    };

    const report = auditInvoice(badItemInvoice);
    expect(report.isValid).toBe(false);
    expect(report.flags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'ITEM_CALCULATION_ERROR',
          severity: 'error',
          field: 'items[0].amount',
        }),
      ])
    );
  });
});
