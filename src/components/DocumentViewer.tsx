'use client';

import React from 'react';
import { ExtractedInvoice } from '@/lib/audit/schema';
import { Eye, FileText, Building2, Calendar, CreditCard, Layers } from 'lucide-react';

interface DocumentViewerProps {
  invoice: ExtractedInvoice | null;
  loading: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ invoice, loading }) => {
  if (loading) {
    return (
      <div className="h-full bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center space-y-4 min-h-[500px]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
          <FileText className="w-6 h-6 text-cyan-400 absolute top-3 left-3 animate-pulse" />
        </div>
        <p className="text-sm font-medium text-slate-300">A processar documento com IA Gemini...</p>
        <p className="text-xs text-slate-500">Extração de JSON Schema e validação determinística de regras</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="h-full bg-slate-900/40 border border-dashed border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[500px]">
        <FileText className="w-12 h-12 text-slate-600" />
        <h3 className="text-sm font-semibold text-slate-400">Nenhum Documento Selecionado</h3>
        <p className="text-xs text-slate-500 max-w-xs">
          Selecione um exemplo acima ou submeta um ficheiro para visualizar a auditoria lado a lado.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col h-full overflow-hidden shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">Pré-visualização do Documento Original</h3>
        </div>
        <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
          Simulação PDF / OCR
        </span>
      </div>

      {/* Styled Invoice View */}
      <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-6">
        {/* Document Banner */}
        <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">Documento Fiscal</span>
              <h2 className="text-xl font-bold text-white mt-0.5">{invoice.documentNumber}</h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {invoice.issuerName}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Total Faturado</span>
              <div className="text-2xl font-black text-cyan-300 mt-0.5 font-mono">
                {invoice.total.toLocaleString('pt-PT', { style: 'currency', currency: invoice.currency })}
              </div>
            </div>
          </div>
        </div>

        {/* Entities Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          {/* Issuer */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5 space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Emissor (Fornecedor)</span>
            <p className="font-semibold text-slate-200">{invoice.issuerName}</p>
            <p className="font-mono text-slate-400 text-[11px]">NIF: {invoice.issuerVat}</p>
          </div>

          {/* Recipient */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5 space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Destinatário (Cliente)</span>
            <p className="font-semibold text-slate-200">{invoice.recipientName}</p>
            <p className="font-mono text-slate-400 text-[11px]">NIF: {invoice.recipientVat}</p>
          </div>
        </div>

        {/* Dates & Currency */}
        <div className="flex items-center justify-between text-xs bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400 text-[10px] block">Data Emissão</span>
              <span className="font-mono text-slate-200">{invoice.issueDate}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400 text-[10px] block">Data Vencimento</span>
              <span className="font-mono text-slate-200">{invoice.dueDate}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400 text-[10px] block">Moeda</span>
              <span className="font-mono text-slate-200 font-bold">{invoice.currency}</span>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <div className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Itens da Fatura</span>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">{invoice.items.length} item(s)</span>
          </div>

          <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Descrição</th>
                  <th className="p-2.5 text-center">Qtd</th>
                  <th className="p-2.5 text-right">P. Unit</th>
                  <th className="p-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="p-2.5 text-slate-300 font-medium">{item.description}</td>
                    <td className="p-2.5 text-center text-slate-400 font-mono">{item.quantity}</td>
                    <td className="p-2.5 text-right text-slate-400 font-mono">{item.unitPrice.toFixed(2)}€</td>
                    <td className="p-2.5 text-right text-cyan-300 font-mono font-semibold">{item.amount.toFixed(2)}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
