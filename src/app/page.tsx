'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PresetsBar } from '@/components/PresetsBar';
import { DocumentViewer } from '@/components/DocumentViewer';
import { AuditForm } from '@/components/AuditForm';
import { AuditFlagsPanel } from '@/components/AuditFlagsPanel';
import { ExtractedInvoice } from '@/lib/audit/schema';
import { auditInvoice } from '@/lib/audit/rules';
import { SAMPLE_PRESETS, SamplePreset } from '@/lib/mockData';
import { AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>('valid');
  const [invoice, setInvoice] = useState<ExtractedInvoice | null>(SAMPLE_PRESETS[0].data);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Derived state: live re-audit whenever invoice object changes
  const auditReport = invoice ? auditInvoice(invoice) : null;

  const handleSelectPreset = (preset: SamplePreset) => {
    setSelectedPresetId(preset.id);
    setLoading(true);
    setErrorMsg(null);

    // Simulate fast processing latency
    setTimeout(() => {
      setInvoice(preset.data);
      setLoading(false);
    }, 400);
  };

  const handleInvoiceChange = (updatedInvoice: ExtractedInvoice) => {
    setSelectedPresetId(null); // Custom state mode
    setInvoice(updatedInvoice);
  };

  const handleExportJson = () => {
    if (!invoice || !auditReport) return;

    const payload = {
      exportedAt: new Date().toISOString(),
      document: invoice,
      auditReport,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `audit-report-${invoice.documentNumber.replace(/[/\\?%*:|"<>]/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased">
      {/* Top Navbar */}
      <Navbar auditReport={auditReport} extracted={invoice} onExport={handleExportJson} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Interactive Presets Selector */}
        <PresetsBar activePresetId={selectedPresetId} onSelectPreset={handleSelectPreset} />

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-xl flex items-center space-x-3 text-xs text-rose-200">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Split Screen Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Document Preview (5 cols) */}
          <div className="lg:col-span-5 h-full">
            <DocumentViewer invoice={invoice} loading={loading} />
          </div>

          {/* Right Panel: Audit Report & Interactive Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Audit Flags & Score Panel */}
            <AuditFlagsPanel report={auditReport} />

            {/* Interactive Edit & Reconciliation Form */}
            {invoice && (
              <AuditForm invoice={invoice} onChange={handleInvoiceChange} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
