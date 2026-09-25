import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../mocks/server';
import { mockExtractedInvoice } from '../mocks/handlers';
import { POST } from '@/app/api/ingest/route';
import { NextRequest } from 'next/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Ingest API Route (/api/ingest) Integration Tests', () => {
  it('should process mock document payload and return clean audit report', async () => {
    const req = new NextRequest('http://localhost:3000/api/ingest', {
      method: 'POST',
      body: JSON.stringify({
        mockData: mockExtractedInvoice,
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.extracted.documentNumber).toBe('INV-MSW-2026/001');
    expect(data.auditReport.isValid).toBe(true);
    expect(data.auditReport.score).toBe(100);
    expect(data.auditReport.flags).toHaveLength(0);
  });

  it('should process document with calculation errors and flag audit issues', async () => {
    const corruptedInvoice = {
      ...mockExtractedInvoice,
      total: 9999, // Intentional mismatch
    };

    const req = new NextRequest('http://localhost:3000/api/ingest', {
      method: 'POST',
      body: JSON.stringify({
        mockData: corruptedInvoice,
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.auditReport.isValid).toBe(false);
    expect(data.auditReport.flags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'TOTAL_MISMATCH',
          severity: 'error',
        }),
      ])
    );
  });

  it('should reject request missing both fileData and mockData', async () => {
    const req = new NextRequest('http://localhost:3000/api/ingest', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain('Missing required field');
  });
});
