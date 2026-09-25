import { ExtractedInvoice } from './audit/schema';

export interface SamplePreset {
  id: string;
  name: string;
  description: string;
  badge: string;
  data: ExtractedInvoice;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'valid',
    name: 'Fatura 100% Conforme',
    description: 'Fatura sem erros. NIFs válidos, matemática exata e datas coerentes.',
    badge: '100% Saúde',
    data: {
      documentNumber: 'FT-2026/8942',
      issueDate: '2026-03-01',
      dueDate: '2026-03-31',
      issuerName: 'TechSolutions Cloud Services Lda',
      issuerVat: '509900011',
      recipientName: 'Inovação & Futuro SA',
      recipientVat: '501100016',
      currency: 'EUR',
      subtotal: 1000.0,
      vatAmount: 230.0,
      total: 1230.0,
      items: [
        {
          description: 'Consultoria de Arquitetura Cloud (20h)',
          quantity: 20,
          unitPrice: 35.0,
          amount: 700.0,
          vatRate: 23,
        },
        {
          description: 'Licenciamento de Servidor Dedicado',
          quantity: 1,
          unitPrice: 300.0,
          amount: 300.0,
          vatRate: 23,
        },
      ],
    },
  },
  {
    id: 'nif-error',
    name: 'Fatura com NIF Inválido',
    description: 'Deteção de NIF do emissor incorreto (falha no checksum fiscal).',
    badge: 'Erro de NIF',
    data: {
      documentNumber: 'FT-2026/1029',
      issueDate: '2026-03-10',
      dueDate: '2026-04-10',
      issuerName: 'Fornecedor Fictício Unipessoal',
      issuerVat: '123456780', // Invalid NIF checksum
      recipientName: 'Inovação & Futuro SA',
      recipientVat: '501100016',
      currency: 'EUR',
      subtotal: 500.0,
      vatAmount: 115.0,
      total: 615.0,
      items: [
        {
          description: 'Serviços de Design Grafico',
          quantity: 1,
          unitPrice: 500.0,
          amount: 500.0,
          vatRate: 23,
        },
      ],
    },
  },
  {
    id: 'math-mismatch',
    name: 'Discrepância no Total',
    description: 'O valor total indicado difere do cálculo (Subtotal + IVA).',
    badge: 'Erro Aritmético',
    data: {
      documentNumber: 'FT-2026/4410',
      issueDate: '2026-03-15',
      dueDate: '2026-04-15',
      issuerName: 'Logística & Transportes Globais',
      issuerVat: '509900011',
      recipientName: 'Inovação & Futuro SA',
      recipientVat: '501100016',
      currency: 'EUR',
      subtotal: 1200.0,
      vatAmount: 276.0,
      total: 1950.0, // Should be 1476.00
      items: [
        {
          description: 'Transporte de Cargas Internacionais',
          quantity: 2,
          unitPrice: 600.0,
          amount: 1200.0,
          vatRate: 23,
        },
      ],
    },
  },
  {
    id: 'date-expired',
    name: 'Vencimento Incoerente',
    description: 'A data de vencimento é anterior à data de emissão.',
    badge: 'Erro Cronológico',
    data: {
      documentNumber: 'FT-2026/9901',
      issueDate: '2026-03-20',
      dueDate: '2026-03-01', // Before issue date
      issuerName: 'Fornecimentos Industriais SA',
      issuerVat: '509900011',
      recipientName: 'Inovação & Futuro SA',
      recipientVat: '501100016',
      currency: 'EUR',
      subtotal: 800.0,
      vatAmount: 184.0,
      total: 984.0,
      items: [
        {
          description: 'Matéria Prima Tipo A',
          quantity: 10,
          unitPrice: 80.0,
          amount: 800.0,
          vatRate: 23,
        },
      ],
    },
  },
];
