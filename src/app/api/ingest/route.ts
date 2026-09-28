import { NextRequest, NextResponse } from 'next/server';
import { extractDocumentWithGemini } from '@/lib/ai/client';
import { auditInvoice } from '@/lib/audit/rules';
import { ExtractedInvoiceSchema } from '@/lib/audit/schema';

// Simple in-memory rate limiting per IP (10 requests per minute)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  const current = rateLimitMap.get(ip);

  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  return { allowed: true, remaining: maxRequests - current.count };
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit excedido. Por favor aguarde um minuto antes de submeter outro documento.' },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

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

    return NextResponse.json(
      {
        success: true,
        extracted,
        auditReport,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
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
