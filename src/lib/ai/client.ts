import { GoogleGenAI, Type, Schema } from '@google/genai';
import { ExtractedInvoice, ExtractedInvoiceSchema } from '../audit/schema';

// Lazy initialization of Gemini client
export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || 'MOCK_API_KEY';
  return new GoogleGenAI({ apiKey });
}

// JSON Schema definition for Gemini Structured Output
const invoiceJsonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    documentNumber: { type: Type.STRING, description: 'Invoice or document reference number' },
    issueDate: { type: Type.STRING, description: 'Issue date in YYYY-MM-DD format' },
    dueDate: { type: Type.STRING, description: 'Payment due date in YYYY-MM-DD format' },
    issuerName: { type: Type.STRING, description: 'Full name or company name of the supplier/issuer' },
    issuerVat: { type: Type.STRING, description: 'Tax ID / NIF / VAT number of the issuer' },
    recipientName: { type: Type.STRING, description: 'Full name or company name of the client/recipient' },
    recipientVat: { type: Type.STRING, description: 'Tax ID / NIF / VAT number of the recipient' },
    currency: { type: Type.STRING, description: '3-letter currency code, e.g., EUR, USD' },
    subtotal: { type: Type.NUMBER, description: 'Subtotal amount before tax' },
    vatAmount: { type: Type.NUMBER, description: 'Total tax / VAT amount' },
    total: { type: Type.NUMBER, description: 'Final total invoice amount including tax' },
    items: {
      type: Type.ARRAY,
      description: 'List of line items in the document',
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING, description: 'Description of product or service' },
          quantity: { type: Type.NUMBER, description: 'Quantity of items' },
          unitPrice: { type: Type.NUMBER, description: 'Price per unit' },
          amount: { type: Type.NUMBER, description: 'Total line item amount' },
          vatRate: { type: Type.NUMBER, description: 'VAT percentage rate applied, e.g. 23' },
        },
        required: ['description', 'quantity', 'unitPrice', 'amount'],
      },
    },
  },
  required: [
    'documentNumber',
    'issueDate',
    'dueDate',
    'issuerName',
    'issuerVat',
    'recipientName',
    'recipientVat',
    'subtotal',
    'vatAmount',
    'total',
    'items',
  ],
};

/**
 * Extracts structured financial data from a document using Gemini AI
 */
export async function extractDocumentWithGemini(
  base64Data: string,
  mimeType: string = 'application/pdf'
): Promise<ExtractedInvoice> {
  const ai = getGeminiClient();

  const prompt = `You are a precision financial document parser. 
Extract all structured data from the attached document into JSON following the strict schema. 
Ensure dates are formatted as YYYY-MM-DD and numbers are clean numeric values.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          { text: prompt },
        ],
      },
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: invoiceJsonSchema,
    },
  });

  const rawJsonText = response.text;
  if (!rawJsonText) {
    throw new Error('Gemini API returned an empty response.');
  }

  const parsedJson = JSON.parse(rawJsonText);
  // Validate output through Zod schema for runtime type safety
  return ExtractedInvoiceSchema.parse(parsedJson);
}
