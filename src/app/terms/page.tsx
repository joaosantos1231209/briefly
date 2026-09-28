import Link from 'next/link';
import { ArrowLeft, FileText, Scale } from 'lucide-react';

export const metadata = {
  title: 'Termos de Serviço | Briefly',
  description: 'Termos e Condições de Utilização do Briefly AI Smart Ingestion & Audit Hub.',
  alternates: {
    canonical: 'https://briefly.app/terms',
  },
};

export default function TermsPage() {
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
            <li aria-current="page" className="text-slate-200">Termos de Serviço</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="space-y-3 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Scale className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white">Termos e Condições de Utilização</h1>
          </div>
          <p className="text-xs text-slate-400">Última atualização: 28 de Setembro de 2026</p>
        </header>

        {/* Content */}
        <article className="space-y-6 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2 bg-slate-900/40 p-5 rounded-xl border border-slate-800">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              1. Objeto e Âmbito da Aplicação
            </h2>
            <p>
              O Briefly é uma plataforma SaaS de auxílio à reconciliação financeira e verificação de integridade documental. O relatório gerado visa apoiar equipas operacionais e não substitui uma auditoria contabilística oficial efetuada por um TOC ou ROC certificado.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-white">2. Isenção de Responsabilidade Financeira</h2>
            <p>
              Embora o Briefly aplique algoritmos determinísticos rigorosos (como o Módulo 11 para NIFs), a responsabilidade final pela submissão de declarações fiscais cabe inteiramente à entidade utilizadora.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-white">3. Uso Aceitável da API</h2>
            <p>
              É expressamente proibido efetuar ataques de negação de serviço (DoS/DDoS) ou contornar os mecanismos de rate limiting aplicados às rotas de ingestão do Briefly.
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
