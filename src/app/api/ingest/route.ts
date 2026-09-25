import { NextRequest, NextResponse } from 'next/server';
import { extractDocumentWithGemini } from '@/lib/ai/client';
import { auditInvoice } from '@/lib/audit/rules';
import { ExtractedInvoiceSchema } from '@/lib/audit/schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileData, mimeType, mockData } = body;

    let extracted;

    if (mockData) {
      // Direct mock payload mode for testing/demo
      extracted = ExtractedInvoiceSchema.parse(mockData);
    } else if (fileData) {
      // Real AI extraction path
      extracted = await extractDocumentWithGemini(fileData, mimeType || 'application/pdf');
    } else {
      return NextResponse.json(
        { error: 'Missing required field: fileData (base64 string) or mockData.' },
        { status: 400 }
      );
    }

    // Run deterministic audit rules engine
    const auditReport = auditInvoice(extracted);

    return NextResponse.json({
      success: true,
      extracted,
      auditReport,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to process and audit document.';
    console.error('Ingestion API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
