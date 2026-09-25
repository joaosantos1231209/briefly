'use client';

import React from 'react';
import { SAMPLE_PRESETS, SamplePreset } from '@/lib/mockData';
import { FileCode, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface PresetsBarProps {
  activePresetId: string | null;
  onSelectPreset: (preset: SamplePreset) => void;
}

export const PresetsBar: React.FC<PresetsBarProps> = ({ activePresetId, onSelectPreset }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-slate-200">Demonstração Interativa (Presets)</h2>
        </div>
        <span className="text-xs text-slate-400">Escolha um exemplo para simular o teste:</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
        {SAMPLE_PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id;
          
          let icon = <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
          if (preset.id === 'nif-error') icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
          if (preset.id === 'math-mismatch') icon = <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
          if (preset.id === 'date-expired') icon = <Clock className="w-3.5 h-3.5 text-purple-400" />;

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`text-left p-3 rounded-lg border text-xs transition-all duration-200 flex flex-col justify-between ${
                isActive
                  ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200">{preset.name}</span>
                  {icon}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{preset.description}</p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                  {preset.data.documentNumber}
                </span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  preset.id === 'valid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-300'
                }`}>
                  {preset.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
