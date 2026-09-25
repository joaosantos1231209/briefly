import { http, HttpResponse } from 'msw';
import { ExtractedInvoice } from '@/lib/audit/schema';

export const mockExtractedInvoice: ExtractedInvoice = {
  documentNumber: 'INV-MSW-2026/001',
  issueDate: '2026-03-10',
  dueDate: '2026-04-10',
  issuerName: 'MSW Global Supplies Lda',
  issuerVat: '509900011',
  recipientName: 'Briefly Audit Hub',
  recipientVat: '501100016',
  currency: 'EUR',
  subtotal: 500,
  vatAmount: 115,
  total: 615,
  items: [
    {
      description: 'Cloud Server Subscriptions',
      quantity: 5,
      unitPrice: 100,
      amount: 500,
      vatRate: 23,
    },
  ],
};

export const handlers = [
  // Intercept Gemini API generateContent endpoint
  http.post('https://generativelanguage.googleapis.com/*', () => {
    return HttpResponse.json({
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify(mockExtractedInvoice),
              },
            ],
          },
        },
      ],
    });
  }),
];
