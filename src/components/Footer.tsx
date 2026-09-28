import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-6 text-xs text-slate-400 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Brand */}
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" aria-hidden="true" />
          <span className="font-bold text-slate-200">Briefly</span>
          <span>— Smart Ingestion & Contract Audit Hub</span>
        </div>

        {/* Center Legal / Navigation Links */}
        <nav aria-label="Links de Rodapé">
          <ul className="flex items-center space-x-6 text-slate-400">
            <li>
              <Link href="/" className="hover:text-cyan-400 transition">Dashboard</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-cyan-400 transition">Política de Privacidade</Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-cyan-400 transition">Termos de Serviço</Link>
            </li>
          </ul>
        </nav>

        {/* Right Copyright */}
        <div className="text-[11px] text-slate-400">
          © {new Date().getFullYear()} Briefly. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
