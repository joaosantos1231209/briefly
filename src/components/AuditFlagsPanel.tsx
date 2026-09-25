'use client';

import React from 'react';
import { AuditReport, AuditFlag } from '@/lib/audit/schema';
import { AlertCircle, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AuditFlagsPanelProps {
  report: AuditReport | null;
}

export const AuditFlagsPanel: React.FC<AuditFlagsPanelProps> = ({ report }) => {
  if (!report) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
      {/* Score Summary Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-200">Relatório de Auditoria Determinística</h3>
            <p className="text-xs text-slate-400">Verificação automática de regras de negócio e integridade fiscal</p>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-lg border font-mono font-bold text-xs flex items-center space-x-1.5 ${getScoreColor(report.score)}`}>
          <span>Score:</span>
          <span className="text-sm">{report.score}%</span>
        </div>
      </div>

      {/* Clean Status */}
      {report.flags.length === 0 ? (
        <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-lg flex items-center space-x-3 text-xs text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-semibold">Nenhuma Anomalia Detetada</p>
            <p className="text-emerald-400/80">Todos os NIFs, cálculos de totais e sequências de datas estão 100% conformes.</p>
          </div>
        </div>
      ) : (
        /* Flags List */
        <div className="space-y-2">
          {report.flags.map((flag: AuditFlag, idx: number) => {
            const isError = flag.severity === 'error';
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-lg border text-xs flex items-start space-x-3 transition-all ${
                  isError
                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                    : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                }`}
              >
                {isError ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold tracking-wide uppercase text-[10px] px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-800 font-mono">
                      {flag.code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Campo: {flag.field}</span>
                  </div>

                  <p className="text-xs leading-relaxed font-medium">{flag.message}</p>

                  {(flag.expected !== undefined || flag.actual !== undefined) && (
                    <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 flex items-center gap-4 text-[11px] font-mono text-slate-400">
                      {flag.expected !== undefined && (
                        <span>Esperado: <strong className="text-emerald-400">{String(flag.expected)}</strong></span>
                      )}
                      {flag.actual !== undefined && (
                        <span>Obtido: <strong className="text-rose-400">{String(flag.actual)}</strong></span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
