'use client';

import React from 'react';
import { ShieldCheck, Sparkles, Download } from 'lucide-react';
import { AuditReport, ExtractedInvoice } from '@/lib/audit/schema';

interface NavbarProps {
  auditReport: AuditReport | null;
  extracted: ExtractedInvoice | null;
  onExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ auditReport, extracted, onExport }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Briefly
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AI Audit Hub
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Smart Ingestion & Deterministic Reconciliation Engine
            </p>
          </div>
        </div>

        {/* Audit Status Pill & Export */}
        <div className="flex items-center space-x-4">
          {auditReport && (
            <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-slate-400">Auditoria Live:</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  auditReport.isValid 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {auditReport.isValid ? 'Conforme' : `${auditReport.summary.errorCount} Erro(s)`}
                </span>

                <span className="text-slate-300 font-mono font-medium">
                  {auditReport.score}% Score
                </span>
              </div>
            </div>
          )}

          {extracted && (
            <button
              onClick={onExport}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-xs px-3.5 py-2 rounded-lg transition shadow-md shadow-cyan-500/15"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Audit Report</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
