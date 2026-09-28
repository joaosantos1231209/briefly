import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://briefly.app";

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Briefly — AI Smart Ingestion & Contract/Invoice Audit Hub",
    template: "%s | Briefly",
  },
  description:
    "Plataforma B2B para ingestão inteligente de documentos, extração de dados estruturados com IA Gemini e validação determinística de regras fiscais e NIFs.",
  keywords: [
    "Auditoria de Faturas",
    "Extração de Documentos IA",
    "Validação de NIF",
    "Reconciliação Financeira",
    "Next.js SaaS",
    "Structured Outputs",
    "Gemini AI",
  ],
  authors: [{ name: "Briefly Engineering Team" }],
  creator: "Briefly",
  publisher: "Briefly",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: siteUrl,
    title: "Briefly — AI Smart Ingestion & Contract/Invoice Audit Hub",
    description:
      "Plataforma B2B de auditoria documental com IA e validação determinística de regras fiscais.",
    siteName: "Briefly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Briefly — AI Smart Ingestion Hub",
    description: "Automação e auditoria inteligente de documentos financeiros.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data (JSON-LD) for SoftwareApplication & Organization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Briefly",
    operatingSystem: "Web",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    description:
      "Plataforma SaaS de ingestão inteligente e auditoria financeira de documentos com IA Gemini e regras determinísticas.",
  };

  return (
    <html lang="pt" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
