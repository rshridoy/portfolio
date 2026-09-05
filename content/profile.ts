export const profile = {
  name: "Md. Rabius Sani",
  role: "AI & Software Engineer",
  location: "Dhaka, Bangladesh",
  email: "rshridoy010113@gmail.com",
  phone: "+880 1568 391369",
  cv: "https://drive.google.com/file/d/15UQoLPJZgHeK_ypHajSschNywB4hrybj/view?usp=sharing",
  social: {
    github: "https://github.com/rshridoy",
    linkedin: "https://www.linkedin.com/in/md-rabius-sani-77a996199",
    instagram: "https://www.instagram.com/r.s_hridoy",
  },
  headline: ["I build the systems", "that keep running", "when nobody is watching."],
  dek:
    "AI and software engineer working on agentic systems, orchestrated data pipelines, " +
    "and the microservices underneath them. Published researcher in NLP and computer vision.",
} as const;

/** A node graph rendered as the project's architecture signature. */
export type Topology = {
  viewBox: string;
  nodes: { id: string; x: number; y: number; label?: string; above?: boolean }[];
  edges: [string, string][];
};

export type Project = {
  slug: string;
  title: string;
  context: string;
  year: string;
  summary: string;
  detail: string[];
  stack: string[];
  tags: string[];
  topology?: Topology;
  link?: { label: string; href: string };
};

/**
 * Featured work — the systems, described at architecture level.
 * Client names and any credentials are deliberately left out.
 */
export const featured: Project[] = [
  {
    slug: "eduai",
    title: "EduAI — Multi-Model Learning Platform",
    context: "Qtec Solution Limited",
    year: "2025 — present",
    summary:
      "An AI learning platform for educators: a router that sends every query to whichever model actually fits, and a document pipeline that grounds its answers and generated content in a school's own curriculum.",
    detail: [
      "A query router reads intent and dispatches to whichever model fits — Gemini Flash for conversation, GPT-4.1 for reasoning, Claude for code, o3-mini for math, Sonar when the answer needs the live web — rather than routing everything through one model.",
      "Curriculum PDFs and slides go through a Mistral and Pixtral ingestion pipeline that handles text and images alike, get embedded into pgvector, and become the grounding for a RAG layer that answers from the school's own material instead of the model's memory.",
      "An editor agent locates the exact section of a generated worksheet or lesson plan that needs changing and rewrites only that part, so a small edit costs a few hundred tokens instead of regenerating the document.",
      "An internal admin panel — a Drive-like store with versioning — is where teachers upload course material, which feeds directly into the router and the generation tools built on top of it.",
    ],
    stack: ["Python", "FastAPI", "LangGraph", "PostgreSQL", "pgvector", "Redis", "Gemini", "GPT-4.1", "Claude", "Mistral"],
    tags: ["ai", "backend"],
    topology: {
      viewBox: "-4 0 108 90",
      nodes: [
        { id: "cl", x: 8, y: 45, label: "client" },
        { id: "rt", x: 32, y: 45, label: "router" },
        { id: "ge", x: 58, y: 10, label: "gemini", above: true },
        { id: "gp", x: 58, y: 33, label: "gpt-4.1" },
        { id: "ca", x: 58, y: 56, label: "claude" },
        { id: "so", x: 58, y: 79, label: "sonar" },
        { id: "rg", x: 86, y: 45, label: "rag" },
      ],
      edges: [["cl", "rt"], ["rt", "ge"], ["rt", "gp"], ["rt", "ca"], ["rt", "so"], ["rt", "rg"]],
    },
  },
  {
    slug: "crypto-data-api",
    title: "Crypto Data API",
    context: "Fintech platform",
    year: "2025 — present",
    summary:
      "A microservices platform serving about 80 live and historical Bitcoin datapoints to trading dashboards, plus news aggregation and a chatbot that answers questions against the same data.",
    detail: [
      "A Flask gateway fronts the whole platform and owns rate limiting and auth; a Node service pushes price and chain updates over WebSocket so dashboards never poll.",
      "Reads are absorbed by a Redis caching layer with a pre-warmer that fills hot keys before traffic arrives, which is what keeps the gateway's tail latency flat during market moves.",
      "Independent retriever services collect from each upstream source and write to MongoDB, so one failing exchange feed never takes the API down.",
      "Ships as containers to Cloud Run with health-check services per component.",
    ],
    stack: ["Python", "Flask", "Node.js", "WebSocket", "Redis", "MongoDB", "Docker", "Cloud Run"],
    tags: ["backend", "systems"],
    topology: {
      viewBox: "-4 6 104 80",
      nodes: [
        { id: "cl", x: 8, y: 50, label: "client" },
        { id: "ws", x: 32, y: 16, label: "ws", above: true },
        { id: "gw", x: 32, y: 50, label: "gateway" },
        { id: "ca", x: 58, y: 32, label: "cache", above: true },
        { id: "bo", x: 58, y: 68, label: "bot" },
        { id: "fe", x: 84, y: 50, label: "feeds" },
      ],
      edges: [["cl", "gw"], ["cl", "ws"], ["gw", "ca"], ["gw", "bo"], ["ca", "fe"], ["bo", "fe"], ["ws", "ca"]],
    },
  },
  {
    slug: "mls-pipeline",
    title: "Property Lead Pipeline",
    context: "n8n orchestration",
    year: "2026",
    summary:
      "An end-to-end pipeline that turns a page of property listings into qualified phone calls: scrape, find the real owner, scrub against the do-not-call registry, then let an AI voice agent make the call.",
    detail: [
      "A Chrome extension reads listing tables by column header rather than position, so the scrape survives the source site rearranging its layout, and POSTs each batch to an n8n webhook.",
      "n8n answers 202 immediately and fans the batch out row by row, so a large scrape never times out the browser. Qualification logic lives in the workflow: a listing passes only if its current status is newer than any expired or cancelled date on the record.",
      "Each row travels through FastAPI services — headless-browser owner lookup, OCR with LLM entity resolution, do-not-call scrubbing, then voice calling with an SMS fallback when nobody picks up.",
      "Flagged numbers are never auto-dialled but are still written out with full owner detail, so they can be worked by hand. Every row carries one id from scrape to report.",
    ],
    stack: ["n8n", "FastAPI", "Playwright", "OpenAI", "PostgreSQL", "Twilio", "Docker"],
    tags: ["automation", "ai"],
    topology: {
      viewBox: "-4 2 108 78",
      nodes: [
        { id: "n8", x: 50, y: 16, label: "n8n", above: true },
        { id: "ex", x: 8, y: 62, label: "extension" },
        { id: "ow", x: 30, y: 62, label: "owner" },
        { id: "oc", x: 52, y: 62, label: "ocr" },
        { id: "dn", x: 74, y: 62, label: "dnc" },
        { id: "ca", x: 92, y: 62, label: "calling" },
      ],
      edges: [["ex", "n8"], ["n8", "ow"], ["ow", "oc"], ["oc", "dn"], ["dn", "ca"], ["ca", "n8"]],
    },
  },
  {
    slug: "vertex-proxy",
    title: "Vertex Proxy for n8n",
    context: "Cloud Run",
    year: "2026",
    summary:
      "A small service that lets self-hosted n8n workflows call Vertex AI in an organisation where downloadable service-account keys are blocked by policy.",
    detail: [
      "Code running inside Google Cloud picks up its service-account identity automatically, so the proxy authenticates without a key file and n8n never holds a Google credential.",
      "Workflows send an ordinary Gemini request with a shared-secret header; the response comes back untouched, so existing parsing nodes needed no changes.",
      "Access tokens are cached and refreshed only on expiry rather than re-read from the metadata server per call.",
      "Scales to zero between runs, which makes an always-available LLM endpoint cost close to nothing.",
    ],
    stack: ["FastAPI", "Vertex AI", "Gemini", "Cloud Run", "Docker", "n8n"],
    tags: ["automation", "ai"],
    topology: {
      viewBox: "-4 34 106 34",
      nodes: [
        { id: "n8", x: 12, y: 50, label: "n8n" },
        { id: "px", x: 50, y: 50, label: "proxy" },
        { id: "vx", x: 86, y: 50, label: "vertex" },
      ],
      edges: [["n8", "px"], ["px", "vx"]],
    },
  },
];

/** Earlier work — research models and smaller applications. */
export const projects: Project[] = [
  {
    slug: "prompt-reflection-bot",
    title: "Optimal Prompt Reflection Bot",
    context: "Agentic AI",
    year: "2025",
    summary:
      "A conversation agent that rewrites its own prompt from what went wrong in previous turns, and keeps what it learns about a person so later conversations start informed.",
    detail: [],
    stack: ["Python", "LangGraph", "Prompt engineering"],
    tags: ["ai"],
  },
  {
    slug: "chat-log-summarizer",
    title: "Chat Log Summarizer",
    context: "NLP",
    year: "2024",
    summary:
      "Reads a plain-text conversation between a person and an assistant and returns a summary with message counts, per-speaker breakdown, and the topics that carried the exchange.",
    detail: [],
    stack: ["Python", "Transformers", "BERT"],
    tags: ["ai", "nlp"],
  },
  {
    slug: "bangla-aggression",
    title: "Bangla Aggressive Text Detection",
    context: "NLP",
    year: "2023",
    summary:
      "Classifies the aggression level of Bangla text using a fine-tuned BanglaT5 model, served behind a small interface for direct input.",
    detail: [],
    stack: ["mT5", "BanglaT5", "PyTorch"],
    tags: ["ai", "nlp"],
  },
  {
    slug: "ai-devops-monitor",
    title: "AI DevOps Monitor",
    context: "Infra tooling",
    year: "2025",
    summary:
      "Watches infrastructure logs for the failure the metrics dashboard won't show yet: anomaly detection, a risk score, and a local LLM's read on what broke and why.",
    detail: [],
    stack: ["FastAPI", "Isolation Forest", "XGBoost", "Mistral 7B", "OpenSearch", "React", "Docker"],
    tags: ["ai", "backend"],
  },
  {
    slug: "feedback-app",
    title: "Feedback App",
    context: "Product",
    year: "2024",
    summary:
      "Collects user feedback through structured forms and drafts a first reply to bug reports automatically, so triage starts before anyone opens the queue.",
    detail: [],
    stack: ["Next.js", "Flask", "Vertex AI"],
    tags: ["web", "ai"],
  },
  {
    slug: "sarcasm-detection",
    title: "Sarcasm Detection in Headlines",
    context: "NLP",
    year: "2023",
    summary:
      "Detects sarcasm in English news headlines with fine-tuned BERT models, where the signal sits in tone rather than vocabulary.",
    detail: [],
    stack: ["BERT", "Transformers", "Python"],
    tags: ["ai", "nlp"],
  },
  {
    slug: "bangla-qa",
    title: "Bangla Question Answering",
    context: "Research",
    year: "2023",
    summary:
      "Open-domain Bangla reading comprehension on the UDDIPOK dataset, comparing multilingual and Bangla-specific sequence-to-sequence models.",
    detail: [],
    stack: ["mT5", "BanglaT5", "NLP"],
    tags: ["ai", "nlp"],
  },
  {
    slug: "abstractive-summary",
    title: "Abstractive Summary Generation",
    context: "Research",
    year: "2023",
    summary:
      "Generates abstractive summaries of conversational English with pretrained transformer models, tuned for dialogue rather than article text.",
    detail: [],
    stack: ["T5", "mT5", "Transformers"],
    tags: ["ai", "nlp"],
  },
];

export const experience = [
  {
    role: "Software Engineer II, AI Developer",
    org: "Qtec Solution Limited",
    period: "June 2025 — present",
    points: [
      "Leading EduAI, a multi-model learning platform: the query router, retrieval and document-ingestion pipeline, and the editor agent that grounds its content generation in real curriculum material.",
      "Crypto data platform: gateway, real-time streaming, caching, and chatbot services.",
    ],
  },
  {
    role: "AI/ML Developer",
    org: "Dotech Limited",
    period: "October 2024 — June 2025",
    points: [
      "Built an automated signature and photograph pipeline for a national bank: YOLOv8 to detect and crop signature and photo regions, then a U-Net trained on 2,000 hand-cleaned samples to remove seals and overlapping lines.",
      "Shipped the verification service that matches a scanned cheque signature against the cleaned copy on file.",
    ],
  },
  {
    role: "AI/ML Developer",
    org: "Shothik AI",
    period: "July 2024 — September 2024",
    points: [
      "Automated meeting-minute generation on Gemini 1.5 Pro, with a pipeline that normalises audio, video, and OCR'd documents into one input before summarising.",
      "Built and fine-tuned a Whisper-based speech-to-text pipeline for customer service call recordings, with chunking to hold up on long calls.",
    ],
  },
];

export const education = [
  {
    school: "Ahsanullah University of Science and Technology",
    award: "B.Sc. in Computer Science and Engineering",
    period: "2019 — 2023",
    place: "Dhaka",
  },
  { school: "Adamjee Cantonment College", award: "Higher Secondary Certificate", period: "2018", place: "Dhaka" },
  {
    school: "Sher-E-Bangla Nagar Govt. Boys High School",
    award: "Secondary School Certificate",
    period: "2016",
    place: "Dhaka",
  },
];

export const thesis = {
  title:
    "Generative Adversarial Networks for Crop Disease: A Case Study with Potato Disease Classification and Instance Segmentation",
  supervisor: "Dr. Mohammad Shafiul Alam, Professor, Department of CSE, AUST",
  cosupervisor: "Khan Md Hasib, Assistant Professor, Department of CSE, BUBT",
};

export const publications = [
  {
    title:
      "PotatoGANs: Utilizing Generative Adversarial Networks, Instance Segmentation, and Explainable AI for Enhanced Potato Disease Identification and Classification",
    authors:
      "F. T. J. Faria, M. Bin Moin, M. S. Alam, A. Al Wase, Md Rabius Sani, K. M. Hasib",
    venue: "arXiv:2405.07332, 2024",
    note: "Preprint",
    href: "https://arxiv.org/abs/2405.07332",
    linkLabel: "Read the preprint",
  },
  {
    title:
      "Vashantor: a large-scale multilingual benchmark dataset for automated translation of Bangla regional dialects to Bangla language",
    authors:
      "F. T. J. Faria, M. Bin Moin, A. Al Wase, M. Ahmmed, Md Rabius Sani, T. Muhammad",
    venue: "arXiv:2311.11142, 2023",
    note: "Preprint",
    href: "https://arxiv.org/abs/2311.11142",
    linkLabel: "Read the preprint",
  },
  {
    title:
      "Classification of Potato Disease with Digital Image Processing Technique: A Hybrid Deep Learning Framework",
    authors:
      "F. T. J. Faria, M. Bin Moin, A. Al Wase, M. R. Sani, K. M. Hasib, M. S. Alam",
    venue: "IEEE 13th Annual Computing and Communication Workshop and Conference (CCWC), Las Vegas, 2023, pp. 0820–0826",
    note: "DOI 10.1109/CCWC57344.2023.10099162",
    href: "https://doi.org/10.1109/CCWC57344.2023.10099162",
    linkLabel: "Read the paper",
  },
];

export const awards = [
  {
    title: "First place, Research Symposium 2023",
    date: "August 2023",
    body: "Poster presentation at the intra-AUST research exhibition, organised by the AUST Research and Publication Club.",
  },
  {
    title: "AWS Cloud Technical Essentials",
    date: "October 2024",
    body: "Completed through GP Academy.",
  },
  {
    title: "WordPress Theme Customization",
    date: "September 2023",
    body: "Certificate of completion.",
  },
];

export const activities = [
  { role: "Vice-President", org: "AUST Sports Club", period: "2023 — 2024" },
  { role: "General Secretary", org: "AUST Sports Club", period: "2022 — 2023" },
  { role: "Captain", org: "AUST team, Clemon Indoor Uni Cricket", period: "2023" },
];

export const skills = [
  { group: "Languages", items: ["Python", "Java", "C++", "JavaScript", "TypeScript", "SQL"] },
  { group: "AI & ML", items: ["PyTorch", "TensorFlow", "Transformers", "scikit-learn", "OpenCV", "GANs, CNNs, RNNs"] },
  {
    group: "Agents & LLMs",
    items: ["LangGraph", "LangChain", "Vertex AI", "pgvector, ChromaDB, FAISS", "Prompt engineering"],
  },
  { group: "Backend", items: ["FastAPI", "Flask", "Django", "Node.js", "WebSocket"] },
  { group: "Frontend", items: ["React", "Next.js", "HTML5, CSS3"] },
  { group: "Automation", items: ["n8n", "Playwright", "Selenium", "Twilio"] },
  { group: "Data & infra", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker", "Google Cloud", "AWS"] },
  { group: "AI tooling", items: ["Cursor", "Claude Code", "GitHub Copilot", "v0.dev"] },
];
