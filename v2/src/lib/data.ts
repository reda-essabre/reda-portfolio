// ─── Hero ───────────────────────────────────────────────────────────────────
export const heroData = {
  eyebrow: "Available for consulting · Paris, France · Remote",
  headlineParts: {
    before: "SYSTEMS THAT MAKE",
    accent: "GROWTH",
    after: "SCALABLE.",
  },
  subtext:
    "I design automation, reporting, and data systems that remove friction — so operations run reliably at scale.",
  metrics: [
    { value: "−30%", label: "Response time" },
    { value: "−20%", label: "Manual errors" },
    { value: "6+", label: "Years" },
    { value: "5", label: "Case studies" },
  ],
} as const;

// ─── Proof Strip ─────────────────────────────────────────────────────────────
export const proofMetrics = [
  { value: "−30%", label: "Issue response time", detail: "Through structured ownership and rapid technical resolution" },
  { value: "−20%", label: "Manual errors", detail: "Via automation of repetitive data processing and workflow logic" },
  { value: "−20%", label: "Implementation time", detail: "Through optimised delivery and technical precision" },
  { value: "−3h/wk", label: "Manual reporting", detail: "Replaced by SQL pipeline with live dashboard output" },
] as const;

export const award = {
  label: "◆ Q2 2023 UNSUNG HERO — EUROPE",
  org: "Leadership Award · Thesis SM / Thesis Cloud",
  quote:
    "Goes deep into customer needs. Strong ownership in automations and APIs. Detail-oriented in resolving issues fully. Goes the extra mile — quick to respond when challenges arise.",
} as const;

// ─── Case Studies ─────────────────────────────────────────────────────────────
export interface CaseStudy {
  id: string;
  category: string;
  outcome: string;
  title: string;
  description: string;
  tags: string[];
  featured?: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "CASE-005",
    category: "FastAPI · PostgreSQL · AI · Event Systems",
    outcome: "9-wk build",
    title: "AI Data-Ops Platform",
    description:
      "Full system design from event ingestion to LLM integration — idempotent queuing, RAG, observability dashboard, and AI cost tracking. Production-grade reliability patterns throughout.",
    tags: ["FastAPI", "PostgreSQL", "Queues", "Idempotency", "RAG", "LLM APIs", "Observability"],
    featured: true,
  },
  {
    id: "CASE-001",
    category: "SQL · Reporting",
    outcome: "−3h/wk",
    title: "Funding Category Extraction Pipeline",
    description:
      "Eliminated 3h/week of manual JSON extraction. SQL pipeline with live dashboard output — analysts redirected from data wrangling to interpretation.",
    tags: ["SQL", "JSON Path", "SSRS", "Dashboard"],
  },
  {
    id: "CASE-002",
    category: "Rules · Automation",
    outcome: "0 manual",
    title: "Automated Late Fee & Hold System",
    description:
      "Rule-based triggers replaced manual account hold processing. Consistent, time-accurate fee application with full audit trail.",
    tags: ["Rule Engine", "Event Triggers", "Workflow", "Audit Logging"],
  },
  {
    id: "CASE-003",
    category: "SQL · Performance",
    outcome: "45s → 3s",
    title: "Query Optimisation — Overdue Dashboard",
    description:
      "Dashboard load time reduced 15× through execution plan analysis, targeted indexing, and CTE restructuring.",
    tags: ["SQL", "Query Opt.", "CTE", "Indexing", "Dashboard"],
  },
  {
    id: "CASE-004",
    category: "n8n · API · Integration",
    outcome: "2d → 10min",
    title: "End-to-End Client Onboarding Automation",
    description:
      "n8n workflow triggered by form submission routes data to CRM, project tool, and email — zero manual entry, consistent regardless of staff availability.",
    tags: ["n8n", "REST APIs", "Webhooks", "CRM Integration"],
  },
];

// ─── Capabilities ─────────────────────────────────────────────────────────────
export interface Capability {
  icon: string; // lucide icon name
  name: string;
  description: string;
  tags: string[];
}

export const capabilities: Capability[] = [
  {
    icon: "Database",
    name: "Data Engineering & Reporting",
    description:
      "Complex SQL queries, SSRS pipelines, JSON extraction, and stakeholder dashboards built to run in production.",
    tags: ["SQL", "SSRS", "JSON", "PostgreSQL", "Dashboards"],
  },
  {
    icon: "Zap",
    name: "Automation & Rule Engines",
    description:
      "Trigger-based workflow automation, rule engine configuration, and zero-manual-intervention system design.",
    tags: ["n8n", "Rule Engines", "Triggers", "Workflows"],
  },
  {
    icon: "Link",
    name: "APIs & Integrations",
    description:
      "REST and SOAP API development, OAuth2, event ingestion with retry logic, and idempotent processing.",
    tags: ["REST", "SOAP", "OAuth2", "FastAPI", "Webhooks"],
  },
  {
    icon: "BrainCircuit",
    name: "AI & Advanced Systems",
    description:
      "LLM integration, RAG pipelines, prompt engineering, observability dashboards, and AI cost tracking.",
    tags: ["LLM APIs", "RAG", "ELK", "Docker", "Metrics"],
  },
];

// ─── Operating Model ──────────────────────────────────────────────────────────
export const operatingModel = {
  quote: "If a human repeats a task more than twice, a system should be doing it.",
  process: [
    { step: "01", title: "Understand", detail: "Map the problem domain, manual pain points, and business context." },
    { step: "02", title: "Design", detail: "Architect the right system abstraction — no over-engineering, no shortcuts." },
    { step: "03", title: "Automate", detail: "Build, test, and ship to production. Reliable, auditable, maintainable." },
  ],
  bio: {
    years: "6+",
    location: "Paris, France · Remote-ready",
    languages: "French (native) · English (professional) · Arabic (native)",
  },
  tools: [
    "SQL", "SSRS", "PostgreSQL", "FastAPI", "Python", "n8n",
    "REST APIs", "OAuth2", "Docker", "Jenkins", "Git",
    "LLM APIs", "RAG", "ELK Stack", "Azure",
  ],
} as const;

// ─── Contact ──────────────────────────────────────────────────────────────────
export const contact = {
  email: "re.essabre@gmail.com",
  linkedin: "https://linkedin.com/in/reda-essabre",
  github: "https://github.com/reda-essabre",
  phone: "+33 6 52 52 80 26",
} as const;
