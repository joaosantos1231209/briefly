'use client';

import React from 'react';
import { ExtractedInvoice, InvoiceItem } from '@/lib/audit/schema';
import { Edit3, Plus, Trash2, RefreshCw } from 'lucide-react';

interface AuditFormProps {
  invoice: ExtractedInvoice;
  onChange: (updatedInvoice: ExtractedInvoice) => void;
}

export const AuditForm: React.FC<AuditFormProps> = ({ invoice, onChange }) => {
  const handleFieldChange = (field: keyof ExtractedInvoice, value: string | number | InvoiceItem[]) => {
    onChange({
      ...invoice,
      [field]: value,
    });
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...invoice.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    onChange({
      ...invoice,
      items: updatedItems,
    });
  };

  const addItem = () => {
    onChange({
      ...invoice,
      items: [
        ...invoice.items,
        {
          description: 'Novo Item',
          quantity: 1,
          unitPrice: 0,
          amount: 0,
          vatRate: 23,
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    if (invoice.items.length <= 1) return;
    const updatedItems = invoice.items.filter((_, idx) => idx !== index);
    onChange({
      ...invoice,
      items: updatedItems,
    });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-xl backdrop-blur-sm space-y-6">
      {/* Form Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Edit3 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">Reconciliação & Edição Interativa (Human-in-the-Loop)</h3>
        </div>
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin-slow" />
          Re-auditoria Live
        </span>
      </div>

      <div className="space-y-4 text-xs">
        {/* Document Identifier & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Nº do Documento</label>
            <input
              type="text"
              value={invoice.documentNumber}
              onChange={(e) => handleFieldChange('documentNumber', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Data de Emissão</label>
            <input
              type="date"
              value={invoice.issueDate}
              onChange={(e) => handleFieldChange('issueDate', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Data de Vencimento</label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => handleFieldChange('dueDate', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Entities Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Issuer */}
          <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg space-y-2">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Emissor</span>
            <div>
              <label className="block text-slate-400 mb-1">Nome da Empresa</label>
              <input
                type="text"
                value={invoice.issuerName}
                onChange={(e) => handleFieldChange('issuerName', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">NIF (Contribuinte)</label>
              <input
                type="text"
                value={invoice.issuerVat}
                onChange={(e) => handleFieldChange('issuerVat', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Recipient */}
          <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg space-y-2">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Destinatário</span>
            <div>
              <label className="block text-slate-400 mb-1">Nome do Cliente</label>
              <input
                type="text"
                value={invoice.recipientName}
                onChange={(e) => handleFieldChange('recipientName', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">NIF (Contribuinte)</label>
              <input
                type="text"
                value={invoice.recipientVat}
                onChange={(e) => handleFieldChange('recipientVat', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Totals Section */}
        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg grid grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-400 mb-1">Subtotal (€)</label>
            <input
              type="number"
              step="0.01"
              value={invoice.subtotal}
              onChange={(e) => handleFieldChange('subtotal', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">IVA Total (€)</label>
            <input
              type="number"
              step="0.01"
              value={invoice.vatAmount}
              onChange={(e) => handleFieldChange('vatAmount', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Total Final (€)</label>
            <input
              type="number"
              step="0.01"
              value={invoice.total}
              onChange={(e) => handleFieldChange('total', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-cyan-300 font-mono font-bold focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Editable Line Items */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300">Itens & Cálculos Individuais</span>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center space-x-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded transition"
            >
              <Plus className="w-3 h-3" />
              <span>Adicionar Linha</span>
            </button>
          </div>

          <div className="space-y-2">
            {invoice.items.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  placeholder="Descrição do item"
                  value={item.description}
                  onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:border-cyan-500 focus:outline-none"
                />

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="number"
                    placeholder="Qtd"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-16 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-center focus:border-cyan-500 focus:outline-none"
                  />

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Preço U."
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-20 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-right focus:border-cyan-500 focus:outline-none"
                  />

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Montante"
                    value={item.amount}
                    onChange={(e) => handleItemChange(idx, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-24 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-cyan-300 font-mono text-right font-semibold focus:border-cyan-500 focus:outline-none"
                  />

                  {invoice.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
