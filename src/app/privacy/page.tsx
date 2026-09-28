import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidade | Briefly',
  description: 'Política de Privacidade e Proteção de Dados do Briefly AI Smart Ingestion Hub.',
  alternates: {
    canonical: 'https://briefly.app/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-6 sm:p-12 font-sans antialiased">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
            <li>
              <Link href="/" className="hover:text-cyan-400 transition">Briefly</Link>
            </li>
            <li>/</li>
            <li aria-current="page" className="text-slate-200">Política de Privacidade</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="space-y-3 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white">Política de Privacidade e Tratamento de Dados</h1>
          </div>
          <p className="text-xs text-slate-400">Última atualização: 28 de Setembro de 2026</p>
        </header>

        {/* Content */}
        <article className="space-y-6 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2 bg-slate-900/40 p-5 rounded-xl border border-slate-800">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              1. Principio de Não-Retenção de Ficheiros
            </h2>
            <p>
              O Briefly processa faturas, recibos e contratos exclusivamente em memória para efeitos de extração estruturada de dados e auditoria financeira imediata. <strong>Nenhum documento carregado ou dados extraídos são guardados permanentemente nos nossos servidores.</strong>
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-white">2. Processamento por Inteligência Artificial (Gemini API)</h2>
            <p>
              Para efetuar a extração de dados estruturados (JSON), o ficheiro fornecido é transmitido via ligação encriptada (HTTPS/TLS 1.3) para a API da Google Gemini. Os dados não são utilizados para treino de modelos públicos e são descartados imediatamente após o processamento.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-white">3. Regras Determinísticas e Privacidade Fiscal (NIFs)</h2>
            <p>
              A validação de NIFs portugueses e os cálculos de IVA/totais são efetuados no lado do servidor por algoritmos matemáticos determinísticos (Módulo 11), sem consultar bases de dados externas de terceiros.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-white">4. Direitos do Utilizador (RGPD / GDPR)</h2>
            <p>
              Como não mantemos registos persistentes nem perfis de utilizador, nenhum dado pessoal fiscal é mantido no nosso sistema após o encerramento da sessão de auditoria no navegador.
            </p>
          </section>
        </article>

        {/* Back Link */}
        <div className="pt-6 border-t border-slate-800">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
