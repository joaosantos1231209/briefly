import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center antialiased">
      <div className="max-w-md w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8 text-rose-400" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest px-2.5 py-1 rounded bg-rose-950/40 border border-rose-500/20">
            Erro 404 — Página Não Encontrada
          </span>
          <h1 className="text-2xl font-bold text-white mt-3">Documento ou Página Indisponível</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            O endereço que tentou aceder não existe ou foi movido. Verifique o URL ou volte ao painel de auditoria.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-xs px-5 py-2.5 rounded-lg transition shadow-lg shadow-cyan-500/15 w-full"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Dashboard Briefly</span>
        </Link>
      </div>
    </main>
  );
}
