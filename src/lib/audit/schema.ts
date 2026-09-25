import { z } from 'zod';

export const InvoiceItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, 'Item description is required'),
  quantity: z.number().positive('Quantity must be greater than zero'),
  unitPrice: z.number().nonnegative('Unit price cannot be negative'),
  amount: z.number().nonnegative('Amount cannot be negative'),
  vatRate: z.number().nonnegative('VAT rate cannot be negative').default(23),
});

export const ExtractedInvoiceSchema = z.object({
  documentNumber: z.string().min(1, 'Document number is required'),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Issue date must be in YYYY-MM-DD format'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format'),
  issuerName: z.string().min(1, 'Issuer name is required'),
  issuerVat: z.string().min(1, 'Issuer VAT/NIF is required'),
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientVat: z.string().min(1, 'Recipient VAT/NIF is required'),
  currency: z.string().default('EUR'),
  subtotal: z.number().nonnegative('Subtotal cannot be negative'),
  vatAmount: z.number().nonnegative('VAT amount cannot be negative'),
  total: z.number().nonnegative('Total cannot be negative'),
  items: z.array(InvoiceItemSchema).min(1, 'Invoice must contain at least one item'),
});

export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
export type ExtractedInvoice = z.infer<typeof ExtractedInvoiceSchema>;

export type AuditSeverity = 'error' | 'warning' | 'info';

export interface AuditFlag {
  code: string;
  severity: AuditSeverity;
  field: string;
  message: string;
  expected?: number | string;
  actual?: number | string;
}

export interface AuditReport {
  isValid: boolean;
  score: number; // 0 to 100
  flags: AuditFlag[];
  summary: {
    totalItems: number;
    errorCount: number;
    warningCount: number;
  };
}
