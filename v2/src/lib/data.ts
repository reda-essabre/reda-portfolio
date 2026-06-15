// ─── Hero ───────────────────────────────────────────────────────────────────
export const heroData = {
  eyebrow: "Available for consulting · Paris, France · Remote",
  headlineParts: {
    before: "SENIOR DATA",
    accent: "SERVICES",
    after: "CONSULTANT.",
  },
  subtext:
    "I design, automate, and stabilize data services for operational teams: SQL reporting, integrations, workflow automation, and AI-ready data systems.",
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
  label: "Q2 2023 Unsung Hero, Europe",
  org: "Leadership Award · Thesis SM / Thesis Cloud",
  quote:
    "Goes deep into customer needs. Strong ownership in automations and APIs. Detail-oriented in resolving issues fully. Goes the extra mile and responds quickly when challenges arise.",
} as const;

// ─── Case Studies ─────────────────────────────────────────────────────────────
export interface CaseStudy {
  id: string;
  category: string;
  outcome: string;
  period: string;
  title: string;
  description: string;
  impact: string;
  tags: string[];
  featured?: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "EXP-001",
    category: "Thesis SM / Thesis Cloud · Remote",
    outcome: "-30% response time",
    period: "Aug 2023 - Present",
    title: "Senior Data Services Consultant",
    description:
      "Work on the layer where fragmented workflows, unreliable reporting, disconnected data, and people-held processes become structured operational systems.",
    impact:
      "Designed SQL reporting, SSRS dashboards, automation flows, and API integrations that reduced issue response time by 30% and manual errors by 20%.",
    tags: ["n8n", "data engineering", "reporting architecture", "workflow design", "CI/CD", "Automation"],
    featured: true,
  },
  {
    id: "EXP-002",
    category: "Thesis SM / Thesis Cloud · Remote",
    outcome: "-20% delivery time",
    period: "Feb 2021 - Aug 2023",
    title: "Implementation and Data Services Consultant",
    description:
      "Helped turn complex deployments into repeatable systems by connecting ERP configuration, API connections, SQL outputs, workflow setup, and delivery documentation.",
    impact:
      "Improved implementation timelines by 20% and expanded delivery into reporting architecture, data extraction, and automation configuration.",
    tags: ["ERP configuration", "SQL reporting", "API connections", "workflow design", "Documentation"],
  },
  {
    id: "EXP-003",
    category: "Unit4",
    outcome: "Safer go-lives",
    period: "Feb 2021 - Dec 2021",
    title: "ERP and API Integration Consultant",
    description:
      "Built the integration layer between ERP systems and third-party platforms so operational teams could depend on cleaner data movement.",
    impact:
      "Protected data integrity during go-live transitions by validating workflows, mapping business requirements into configuration, and supporting controlled system change.",
    tags: ["ERP systems", "REST APIs", "Data exchange", "Configuration", "Go-live support"],
  },
  {
    id: "EXP-004",
    category: "Fokal Studio",
    outcome: "Cleaner client delivery",
    period: "Apr 2019 - Jan 2021",
    title: "Client Systems Consultant",
    description:
      "Worked with clients where operational processes were too dependent on manual coordination, disconnected tools, and unclear data handoffs.",
    impact:
      "Improved delivery confidence through API integration, system configuration, data validation, and clearer implementation design.",
    tags: ["API integration", "System configuration", "Data validation", "Client delivery"],
  },
  {
    id: "EXP-005",
    category: "Property Finder",
    outcome: "More reliable operations",
    period: "Jan 2018 - Dec 2018",
    title: "Operational Data Consultant",
    description:
      "Supported data operations in a fast-paced environment where reporting accuracy, process discipline, and turnaround time directly affected daily operations.",
    impact:
      "Contributed to cleaner operational flow, more reliable data handling, and stronger process control across day-to-day workflows.",
    tags: ["Implementation", "Configuration", "Data operations", "Process improvement"],
  },
  {
    id: "EXP-006",
    category: "E-Business Solutions | EBS · Casablanca",
    outcome: "Systems foundation",
    period: "Jan 2017 - Jan 2018",
    title: "IT Consultant · Web Developer",
    description:
      "Built web applications, REST API integrations, and database-backed solutions for client business workflows.",
    impact:
      "Established the software engineering, API design, database, and systems-integration foundation behind my later data services consulting work.",
    tags: ["Web applications", "REST APIs", "Database design", "System integration"],
  },
];

// ─── Current Focus ───────────────────────────────────────────────────────────
export const currentFocus = [
  {
    title: "Odoo implementation & configuration",
    description:
      "Implementing and configuring Odoo around real business workflows, with clean data structures, role-based processes, reporting needs, and integration points designed before automation starts.",
    tags: ["Odoo", "ERP configuration", "Process design", "Data migration"],
  },
  {
    title: "n8n automation for operations",
    description:
      "Building automation flows that connect forms, CRM, email, reporting, and back-office tools so teams stop copying data between systems and start working from reliable handoffs.",
    tags: ["n8n", "Webhooks", "REST APIs", "Workflow automation"],
  },
  {
    title: "AI training powered by data",
    description:
      "Helping teams use AI responsibly by grounding prompts, assistants, and training material in structured business data, documented processes, and measurable operational use cases.",
    tags: ["AI training", "Prompt systems", "Knowledge bases", "Data quality"],
  },
] as const;

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
    name: "Data Services & Reporting",
    description:
      "Complex SQL queries, SSRS pipelines, JSON extraction, and stakeholder dashboards delivered as reliable business services.",
    tags: ["SQL", "SSRS", "JSON", "PostgreSQL", "Dashboards"],
  },
  {
    icon: "Zap",
    name: "n8n Automation & Workflow Systems",
    description:
      "Operational automation using n8n, triggers, and workflow logic to remove repeated manual handling.",
    tags: ["n8n", "Automation", "Triggers", "Workflows"],
  },
  {
    icon: "Link",
    name: "Odoo & ERP Implementation",
    description:
      "ERP implementation and configuration for operational processes, data migration, reporting needs, and integration readiness.",
    tags: ["Odoo", "ERP", "Configuration", "Data migration"],
  },
  {
    icon: "BrainCircuit",
    name: "AI Training & Data-Driven AI",
    description:
      "AI training, prompt systems, knowledge bases, and AI workflows grounded in structured operational data.",
    tags: ["AI training", "RAG", "LLM APIs", "Data quality"],
  },
  {
    icon: "Link",
    name: "APIs & Integrations",
    description:
      "REST and SOAP API development, OAuth2, webhook flows, cross-system reliability, and data exchange design.",
    tags: ["REST", "SOAP", "OAuth2", "Webhooks"],
  },
];

// ─── Operating Model ──────────────────────────────────────────────────────────
export const operatingModel = {
  quote: "A data service is only useful when people can trust it every day.",
  process: [
    { step: "01", title: "Understand", detail: "Map operational pain points, data ownership, dependencies, and business context." },
    { step: "02", title: "Design", detail: "Architect the right data service with clear contracts, clean handoffs, and pragmatic controls." },
    { step: "03", title: "Automate", detail: "Build, test, and ship reliable systems with monitoring, auditability, and maintainable documentation." },
  ],
  bio: {
    years: "6+",
    location: "Paris, France · Remote-ready",
    languages: "French (native) · English (professional) · Arabic (native)",
  },
  tools: [
    "SQL", "SSRS", "PostgreSQL", "FastAPI", "Python", "n8n",
    "Odoo", "REST APIs", "OAuth2", "Docker", "Jenkins", "Git",
    "AI training", "LLM APIs", "RAG", "ELK Stack", "Azure",
  ],
} as const;

// ─── Contact ──────────────────────────────────────────────────────────────────
export const contact = {
  email: "re.essabre@gmail.com",
  linkedin: "https://www.linkedin.com/in/reda-e-65b301173/",
  github: "https://github.com/reda-essabre",
  phone: "+33 6 52 52 80 26",
} as const;
