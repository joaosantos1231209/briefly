# Briefly — AI Smart Ingestion & Audit Hub 📄⚡

> **Intelligent document ingestion, structured AI extraction, and deterministic financial auditing in a unified platform.**

---

### 🌟 Overview

**Briefly** is an enterprise-grade document processing platform designed to bridge unstructured business files (invoices, receipts, supplier contracts) with rigorous, deterministic audit and reconciliation workflows. 

Combining **Generative AI (Gemini Structured Outputs)** with **strict runtime validation (Zod)** and automated business rules, Briefly identifies calculation discrepancies, compliance risks, and expired terms before they impact financial operations.

---

### ✨ Key Capabilities

- 🤖 **Structured AI Extraction:** Parses complex PDFs & scanned images into strict JSON schemas with runtime validation.
- 📐 **Deterministic Rule Engine:** Validates tax logic, checksums (NIF/VAT), line-item arithmetic, and contract expiration dates.
- 👁️ **Side-by-Side Audit Workspace:** Interactive interface pairing document preview with live editable fields and real-time anomaly badges.
- ⚡ **Resilient Processing:** Built for asynchronous ingestion with full status tracking.
- 🧪 **Enterprise Quality:** Complete testing pyramid (Unit, Integration with MSW, E2E with Playwright) and GitHub Actions CI/CD pipeline.

---

### 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router, Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Lucide Icons
- **AI Engine:** Google Gemini API (`@google/genai`) + Zod Schema Validation
- **Quality & Testing:** Vitest, Testing Library, MSW (Mock Service Worker), Playwright
- **CI/CD:** GitHub Actions

---

### 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/joaosantos1231209/briefly.git

# Install dependencies
npm install

# Run local development server
npm run dev

# Run test suite
npm run test:run
```

---

*Built with precision for modern financial and operational workflows.*
