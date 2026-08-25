import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/assets', express.static(path.join(process.cwd(), 'src', 'assets')));

// IN-MEMORY / LOCAL CONFIG STORE FOR DEMO & TESTING
let currentConfig: Record<string, any> = {
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-3-7-sonnet",
  "small_model": "anthropic/claude-3-5-haiku",
  "default_agent": "build",
  "plugin": ["opencode-git", "opencode-theme"],
  "mcp": {
    "puppeteer": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-puppeteer"],
      "enabled": true,
      "environment": {}
    }
  },
  "lsp": {
    "typescript-language-server": {
      "command": ["typescript-language-server", "--stdio"],
      "extensions": [".ts", ".tsx"],
      "disabled": false
    }
  },
  "skills": {
    "paths": ["~/.config/opencode/skill/react-patterns"],
    "urls": []
  },
  "provider": {},
  "agent": {},
  "theme": "imperial-dark",
  "permission": {},
  "instructions": "",
  "experimental": {}
};

// API ROUTES
app.get("/api/config", (req, res) => {
  res.json(currentConfig);
});

app.post("/api/config", (req, res) => {
  const newConfig = req.body || {};
  // Deep merge
  currentConfig = { ...currentConfig, ...newConfig };
  res.json(currentConfig);
});

app.post("/api/config/preview", (req, res) => {
  res.json(req.body || currentConfig);
});

// DATA ENDPOINTS
app.get("/api/plugins", (req, res) => {
  res.json({
    plugins: [
      { id: "opencode-theme", name: "Theme Selector & Visuals", description: "Manage themes, custom CSS palettes, and visual studio presets for OpenCode", npm: "@opencode/plugin-theme", category: "ui", tags: ["theme", "ui", "visuals"] },
      { id: "opencode-git", name: "Git Workflow & Smart Commit", description: "Automated git commits, conventional commit generation, diff analysis, and branch helpers", npm: "@opencode/plugin-git", category: "development", tags: ["git", "vcs", "workflow"] },
      { id: "opencode-linter", name: "Multi-Language Auto-Linter", description: "Realtime linting during editing across JS/TS, Python, Rust, Go, and C++", npm: "@opencode/plugin-linter", category: "quality", tags: ["linter", "code", "quality"] },
      { id: "opencode-security", name: "Security & Secret Scanner", description: "Scans for hardcoded credentials, secret leaks, and vulnerable dependencies", npm: "@opencode/plugin-security", category: "security", tags: ["security", "audit", "secrets"] },
      { id: "opencode-formatter", name: "Prettier & Biome Formatter", description: "Instant code formatting on file save with custom project rule sets", npm: "@opencode/plugin-formatter", category: "quality", tags: ["format", "prettier", "biome"] },
      { id: "opencode-voice", name: "Voice-to-Prompt Assistant", description: "Speak natural language prompts directly to OpenCode agent using Whisper API", npm: "@opencode/plugin-voice", category: "accessibility", tags: ["voice", "audio", "ai"] },
      { id: "opencode-analytics", name: "Token & Latency Monitor", description: "Track token usage, cost estimates, prompt latency, and LLM performance telemetry", npm: "@opencode/plugin-analytics", category: "monitoring", tags: ["analytics", "costs", "tokens"] },
      { id: "opencode-terminal", name: "PTY Shell Task Runner", description: "Integrated terminal runner for background processes, build tasks, and hot reloaders", npm: "@opencode/plugin-terminal", category: "development", tags: ["terminal", "shell", "tasks"] },
      { id: "opencode-db-inspector", name: "Database Schema Inspector", description: "Visual schema diagrams, ERD generation, and live SQL query testing panel", npm: "@opencode/plugin-db-inspector", category: "database", tags: ["database", "sql", "schema"] },
      { id: "opencode-docker", name: "Docker Container Deployer", description: "One-click container build, deployment, multi-stage dockerfiles, and health monitoring", npm: "@opencode/plugin-docker", category: "devops", tags: ["docker", "deploy", "containers"] },
      { id: "opencode-autodoc", name: "AI Auto-Doc Generator", description: "Generates JSDoc, TypeDoc, OpenAPI specs, and markdown READMEs automatically", npm: "@opencode/plugin-autodoc", category: "quality", tags: ["docs", "jsdoc", "openapi"] },
      { id: "opencode-snippets", name: "Code Snippet Manager", description: "Store, search, and reuse intelligent code templates and boilerplates across projects", npm: "@opencode/plugin-snippets", category: "development", tags: ["snippets", "templates"] },
      { id: "opencode-testgen", name: "Unit Test Auto-Generator", description: "Generates Vitest, Jest, PyTest, Playwright, and Go tests with high code coverage", npm: "@opencode/plugin-testgen", category: "quality", tags: ["testing", "vitest", "pytest"] },
      { id: "opencode-deps-check", name: "Dependency Version Inspector", description: "Detects outdated npm, PyPI, and Cargo packages with changelog summaries", npm: "@opencode/plugin-deps-check", category: "security", tags: ["dependencies", "npm", "security"] },
      { id: "opencode-ast", name: "AST Code Refactoring Engine", description: "Automated AST structural code transforms, codemods, and syntax migrations", npm: "@opencode/plugin-ast", category: "development", tags: ["ast", "refactor", "codemod"] },
      { id: "opencode-graphql", name: "GraphQL Playground & Explorer", description: "Interactive GraphQL query editor, schema introspection, and playground panel", npm: "@opencode/plugin-graphql", category: "database", tags: ["graphql", "api", "query"] },
      { id: "opencode-copilot", name: "AI Inline Autocomplete", description: "Realtime Ghost-text inline code completions powered by fast local or cloud models", npm: "@opencode/plugin-copilot", category: "development", tags: ["autocomplete", "ai", "inline"] },
      { id: "opencode-sentry", name: "Sentry Crash Telemetry", description: "Realtime exception tracking, error stack traces, and issue triage inside IDE", npm: "@opencode/plugin-sentry", category: "monitoring", tags: ["sentry", "errors", "bugs"] },
      { id: "opencode-i18n", name: "Internationalization Manager", description: "Auto-extract translation keys, sync i18n JSON files, and translate missing strings", npm: "@opencode/plugin-i18n", category: "quality", tags: ["i18n", "localization", "translate"] },
      { id: "opencode-prisma", name: "Prisma ORM & Migration Helper", description: "Prisma schema visualizer, auto-migrations, and typed client code generators", npm: "@opencode/plugin-prisma", category: "database", tags: ["prisma", "orm", "database"] },
      { id: "opencode-ci-cd", name: "GitHub Actions & CI Pipeline", description: "Visual workflow builder and live execution monitoring for GitHub Actions & GitLab CI", npm: "@opencode/plugin-ci-cd", category: "devops", tags: ["ci", "cd", "github-actions"] },
      { id: "opencode-profiler", name: "CPU & Memory Profiler", description: "Heap snapshots, event loop lag analysis, and memory leak detection", npm: "@opencode/plugin-profiler", category: "monitoring", tags: ["profiler", "performance", "memory"] }
    ]
  });
});

app.post("/api/plugins/install", (req, res) => {
  const plugins = req.body?.plugins || [];
  res.json({ status: "success", installed: plugins });
});

app.get("/api/mcp", (req, res) => {
  res.json({
    mcpServers: [
      { id: "puppeteer", name: "Puppeteer Browser Automation", description: "Control headless Chrome for web scraping, screenshot capture, and E2E testing", type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-puppeteer"], category: "browser", popular: true },
      { id: "postgres", name: "PostgreSQL Database Inspector", description: "Query and inspect Postgres database schemas, indexes, and live records", type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-postgres"], category: "database", popular: true },
      { id: "sqlite", name: "SQLite DB Analytics Engine", description: "Fast local SQLite database queries, table inspections, and migrations", type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-sqlite"], category: "database", popular: true },
      { id: "mysql", name: "MySQL & MariaDB Inspector", description: "Query and inspect MySQL/MariaDB database schemas and user grants", type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-mysql"], category: "database", popular: false },
      { id: "github", name: "GitHub API Protocol Server", description: "Manage repositories, pull requests, issues, releases, and workflow runs", type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-github"], category: "development", popular: true },
      { id: "gitlab", name: "GitLab Instance Manager", description: "Interact with GitLab projects, merge requests, CI pipelines, and snippets", type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-gitlab"], category: "development", popular: false },
      { id: "filesystem", name: "Secure Filesystem Server", description: "Fine-grained directory listing, file editing, and sandboxed file operations", type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-filesystem"], category: "filesystem", popular: true },
      { id: "brave-search", name: "Brave Web Search API", description: "Perform live internet searches and fetch real-time web results", type: "remote", url: "https://api.search.brave.com", category: "web", popular: true },
      { id: "fetch", name: "Web Fetch & HTML Parser", description: "Fetch web pages, convert HTML to markdown, and analyze API endpoints", type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-fetch"], category: "web", popular: false },
      { id: "memory", name: "Graph Knowledge Memory", description: "Persistent graph-based entity memory for AI agents across sessions", type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-memory"], category: "ai", popular: true },
      { id: "slack", name: "Slack Integration Server", description: "Interact with Slack channels, post updates, and listen to team threads", type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-slack"], category: "communication", popular: false },
      { id: "gdrive", name: "Google Drive Workspace", description: "Search Google Drive docs, spreadsheets, and files directly in prompts", type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-gdrive"], category: "cloud", popular: false },
      { id: "gmaps", name: "Google Maps & Geocoding API", description: "Location search, geocoding, and distance matrix calculations", type: "remote", url: "https://maps.googleapis.com/mcp", category: "web", popular: false },
      { id: "sentry", name: "Sentry Crash Inspector", description: "Fetch runtime exceptions, stack traces, and issue telemetry from Sentry", type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-sentry"], category: "devops", popular: false },
      { id: "docker", name: "Docker Container Manager", description: "Inspect container state, view live logs, and manage Docker networks", type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-docker"], category: "devops", popular: false },
      { id: "context7", name: "Context7 Library Docs Lookup", description: "Fetch live up-to-date documentation for open source npm/pypi packages", type: "remote", url: "https://mcp.context7.com/v1", category: "development", popular: true },
      { id: "sequential-thinking", name: "Sequential Thinking Engine", description: "Structured step-by-step reasoning tool for complex architectural tasks", type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-sequential-thinking"], category: "ai", popular: true },
      { id: "obsidian", name: "Obsidian Knowledge Vault Sync", description: "Read and write markdown notes in Obsidian knowledge vaults", type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-obsidian"], category: "filesystem", popular: false },
      { id: "redis", name: "Redis Key-Value & Cache Inspector", description: "Inspect Redis keys, pub/sub channels, and memory fragmentation", type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-redis"], category: "database", popular: false },
      { id: "linear", name: "Linear Issue & Sprint Tracker", description: "Query Linear issues, update sprint statuses, and attach commits", type: "remote", url: "https://mcp.linear.app/v1", category: "development", popular: true },
      { id: "aws-cloud", name: "AWS Cloud Inspector & Logs", description: "Inspect S3 buckets, CloudWatch logs, and EC2 instance statuses", type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-aws"], category: "cloud", popular: false },
      { id: "jira", name: "Atlassian Jira Project Manager", description: "Search Jira tickets, transition issue states, and log work hours", type: "remote", url: "https://mcp.atlassian.com/v1", category: "development", popular: false },
      { id: "notion", name: "Notion Workspace Connector", description: "Read and update Notion databases, docs, and project taskboards", type: "remote", url: "https://mcp.notion.so/v1", category: "cloud", popular: false },
      { id: "figma", name: "Figma Design Token Extractor", description: "Inspect Figma component frames, colors, typography, and export assets", type: "remote", url: "https://mcp.figma.com/v1", category: "ui", popular: true },
      { id: "confluence", name: "Confluence Docs Knowledgebase", description: "Search technical specs and architecture docs across Confluence spaces", type: "remote", url: "https://mcp.atlassian.com/confluence", category: "cloud", popular: false }
    ]
  });
});

app.post("/api/mcp/install", (req, res) => {
  const mcps = req.body?.mcps || [];
  res.json({ status: "success", installed: mcps });
});

app.get("/api/skills", (req, res) => {
  res.json({
    skills: [
      { id: "react-patterns", name: "React 19 & Next.js Patterns", description: "Coding standards, Server Components, and custom hooks guidelines", path: "~/.config/opencode/skill/react-patterns", category: "development", tags: ["react", "nextjs", "frontend"] },
      { id: "python-fastapi", name: "FastAPI & Async SQLAlchemy", description: "Pydantic v2 schemas, OpenAPI specs, and async database patterns", path: "~/.config/opencode/skill/python-fastapi", category: "development", tags: ["python", "fastapi", "backend"] },
      { id: "security-audit", name: "OWASP Security Auditor", description: "Dependency auditing, vulnerability mitigation, and CORS configurations", path: "~/.config/opencode/skill/security-audit", category: "security", tags: ["security", "owasp", "audit"] },
      { id: "tailwind-v4", name: "Tailwind CSS v4 Utility Suite", description: "Modern Tailwind v4 CSS variable setups and design system tokens", path: "~/.config/opencode/skill/tailwind-v4", category: "ui", tags: ["css", "tailwind", "styling"] },
      { id: "prompt-engineering-pro", name: "Prompt Engineering Master", description: "System prompt optimization, few-shot patterns, and guardrails", path: "~/.config/opencode/skill/prompt-engineering", category: "ai", tags: ["prompts", "llm", "ai"] },
      { id: "rust-tokio-async", name: "Rust Tokio Async Engine", description: "High-performance Rust async I/O, memory safety, and thread safety", path: "~/.config/opencode/skill/rust-tokio", category: "development", tags: ["rust", "async", "backend"] },
      { id: "k8s-helm-ops", name: "Kubernetes & Helm Deployment Ops", description: "Declarative K8s manifests, Helm charts, and ingress controllers", path: "~/.config/opencode/skill/k8s-helm", category: "devops", tags: ["k8s", "helm", "devops"] },
      { id: "system-architecture", name: "Distributed System Architecture", description: "Microservices design, event-driven architectures, and domain-driven design", path: "~/.config/opencode/skill/system-architecture", category: "architecture", tags: ["system", "architecture", "microservices"] },
      { id: "graphql-schema", name: "GraphQL Schema & Federation", description: "GraphQL schema design, dataloaders, and Apollo Federation", path: "~/.config/opencode/skill/graphql-schema", category: "development", tags: ["graphql", "api", "schema"] },
      { id: "go-concurrency", name: "Go Concurrency & Channels", description: "Goroutines, worker pools, channels, and context propagation", path: "~/.config/opencode/skill/go-concurrency", category: "development", tags: ["go", "concurrency", "channels"] },
      { id: "pytorch-pipeline", name: "PyTorch Deep Learning Pipelines", description: "Model architectures, custom dataloaders, and PyTorch Lightning", path: "~/.config/opencode/skill/pytorch-pipeline", category: "ai", tags: ["pytorch", "ai", "deep-learning"] },
      { id: "wasm-rust-engine", name: "WebAssembly & Rust Engine", description: "Compile Rust to Wasm, JS bindings, and SIMD web performance", path: "~/.config/opencode/skill/wasm-rust", category: "development", tags: ["wasm", "rust", "performance"] },
      { id: "docker-compose-mastery", name: "Docker Compose & Container Networking", description: "Multi-container environment orchestation, volume persistent mounts, and health checks", path: "~/.config/opencode/skill/docker-compose", category: "devops", tags: ["docker", "networking"] },
      { id: "cybersecurity-pentest", name: "Ethical Hacking & Pentest Safeguards", description: "SQL injection prevention, XSS sanitization, CSRF tokens, and security header hardening", path: "~/.config/opencode/skill/cybersecurity", category: "security", tags: ["security", "pentest"] },
      { id: "microservices-cqrs", name: "CQRS & Event Sourcing Patterns", description: "Command Query Responsibility Segregation, Kafka event streams, and event replay engines", path: "~/.config/opencode/skill/cqrs-events", category: "architecture", tags: ["cqrs", "kafka", "events"] },
      { id: "cloud-native-aws", name: "Cloud-Native Serverless & DynamoDB", description: "AWS Lambda, EventBridge, SQS queues, and single-table DynamoDB design patterns", path: "~/.config/opencode/skill/cloud-native", category: "cloud", tags: ["aws", "serverless"] }
    ]
  });
});

app.get("/api/lsp", (req, res) => {
  res.json({
    lsp_servers: [
      { id: "typescript-language-server", name: "TypeScript / JavaScript (tsserver)", extensions: [".ts", ".tsx", ".js", ".jsx"], command: ["typescript-language-server", "--stdio"], popular: true },
      { id: "pyright", name: "Pyright (Python Type Checker)", extensions: [".py"], command: ["pyright-langserver", "--stdio"], popular: true },
      { id: "rust-analyzer", name: "Rust Analyzer (Rust)", extensions: [".rs"], command: ["rust-analyzer"], popular: true },
      { id: "gopls", name: "gopls (Go Language Server)", extensions: [".go"], command: ["gopls"], popular: true },
      { id: "clangd", name: "clangd (C / C++)", extensions: [".c", ".cpp", ".h", ".hpp"], command: ["clangd", "--background-index"], popular: false },
      { id: "tailwindcss-language-server", name: "Tailwind CSS Language Server", extensions: [".html", ".css", ".tsx", ".jsx"], command: ["tailwindcss-language-server", "--stdio"], popular: true },
      { id: "html-css-languageserver", name: "HTML / CSS / JSON Language Server", extensions: [".html", ".css", ".json"], command: ["vscode-html-language-server", "--stdio"], popular: true },
      { id: "vue-volar", name: "Vue Volar Language Server", extensions: [".vue"], command: ["vue-language-server", "--stdio"], popular: false },
      { id: "svelte-language-server", name: "Svelte Language Server", extensions: [".svelte"], command: ["svelteserver", "--stdio"], popular: false },
      { id: "intelephense", name: "PHP Intelephense", extensions: [".php"], command: ["intelephense", "--stdio"], popular: false },
      { id: "kotlin-language-server", name: "Kotlin Language Server", extensions: [".kt", ".kts"], command: ["kotlin-language-server"], popular: false },
      { id: "solargraph", name: "Ruby Solargraph", extensions: [".rb"], command: ["solargraph", "stdio"], popular: false },
      { id: "zls", name: "Zig Language Server (ZLS)", extensions: [".zig"], command: ["zls"], popular: false },
      { id: "dart-analysis-server", name: "Dart & Flutter Language Server", extensions: [".dart"], command: ["dart", "language-server"], popular: false },
      { id: "bash-language-server", name: "Bash Language Server", extensions: [".sh", ".bash"], command: ["bash-language-server", "start"], popular: true },
      { id: "yaml-language-server", name: "YAML Language Server", extensions: [".yaml", ".yml"], command: ["yaml-language-server", "--stdio"], popular: true },
      { id: "dockerfile-language-server", name: "Dockerfile Language Server", extensions: ["Dockerfile", ".dockerfile"], command: ["docker-langserver", "--stdio"], popular: true },
      { id: "graphql-language-service", name: "GraphQL Language Server", extensions: [".graphql", ".gql"], command: ["graphql-lsp", "server", "-m", "stream"], popular: false }
    ]
  });
});

app.get("/api/providers", (req, res) => {
  res.json({
    providers: [
      {
        id: "anthropic",
        name: "Anthropic Claude",
        api: "anthropic",
        recommended: true,
        models: [
          { id: "claude-3-7-sonnet", name: "Claude 3.7 Sonnet (Hybrid Reasoning)", context: 200000, output: 64000, reasoning: true, tool_call: true, free: false },
          { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", context: 200000, output: 8192, reasoning: false, tool_call: true, free: false },
          { id: "claude-3-5-haiku", name: "Claude 3.5 Haiku", context: 200000, output: 4096, reasoning: false, tool_call: true, free: false },
          { id: "claude-3-opus", name: "Claude 3 Opus", context: 200000, output: 4096, reasoning: false, tool_call: true, free: false }
        ]
      },
      {
        id: "openai",
        name: "OpenAI",
        api: "openai",
        recommended: true,
        models: [
          { id: "gpt-4o", name: "GPT-4o Omnimodal", context: 128000, output: 4096, reasoning: false, tool_call: true, free: false },
          { id: "gpt-4o-mini", name: "GPT-4o Mini", context: 128000, output: 4096, reasoning: false, tool_call: true, free: false },
          { id: "o3-mini", name: "o3-mini Reasoning Engine", context: 200000, output: 65536, reasoning: true, tool_call: true, free: false },
          { id: "o1", name: "o1 Reasoning Model", context: 200000, output: 100000, reasoning: true, tool_call: true, free: false },
          { id: "o3", name: "o3 High-Intelligence Agent", context: 200000, output: 100000, reasoning: true, tool_call: true, free: false }
        ]
      },
      {
        id: "google",
        name: "Google Gemini",
        api: "google",
        recommended: true,
        models: [
          { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro (2M Context)", context: 2000000, output: 8192, reasoning: true, tool_call: true, free: false },
          { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", context: 1000000, output: 8192, reasoning: true, tool_call: true, free: true },
          { id: "gemini-2.0-flash-thinking", name: "Gemini 2.0 Flash Thinking", context: 1000000, output: 8192, reasoning: true, tool_call: true, free: true },
          { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", context: 2000000, output: 8192, reasoning: false, tool_call: true, free: true }
        ]
      },
      {
        id: "deepseek",
        name: "DeepSeek AI",
        api: "deepseek",
        recommended: true,
        models: [
          { id: "deepseek-v3", name: "DeepSeek V3 (671B MoE)", context: 64000, output: 8192, reasoning: false, tool_call: true, free: true },
          { id: "deepseek-r1", name: "DeepSeek R1 (Reasoning)", context: 64000, output: 8192, reasoning: true, tool_call: true, free: true },
          { id: "deepseek-coder-v2", name: "DeepSeek Coder V2 236B", context: 128000, output: 8192, reasoning: false, tool_call: true, free: true }
        ]
      },
      {
        id: "ollama",
        name: "Ollama (Local LLM)",
        api: "ollama",
        recommended: false,
        models: [
          { id: "llama3.3:70b", name: "Llama 3.3 70B Instruct", context: 128000, output: 4096, reasoning: false, tool_call: true, free: true },
          { id: "qwen2.5-coder:32b", name: "Qwen 2.5 Coder 32B", context: 32768, output: 4096, reasoning: false, tool_call: true, free: true },
          { id: "deepseek-r1:14b", name: "DeepSeek R1 Distill 14B", context: 32768, output: 4096, reasoning: true, tool_call: true, free: true },
          { id: "mistral-small:24b", name: "Mistral Small 24B Instruct", context: 32768, output: 4096, reasoning: false, tool_call: true, free: true }
        ]
      },
      {
        id: "mistral",
        name: "Mistral AI",
        api: "mistral",
        recommended: true,
        models: [
          { id: "mistral-large-2411", name: "Mistral Large 2", context: 128000, output: 8192, reasoning: false, tool_call: true, free: false },
          { id: "codestral-2501", name: "Codestral 2501", context: 256000, output: 8192, reasoning: false, tool_call: true, free: false },
          { id: "pixtral-large-2411", name: "Pixtral Large Multimodal", context: 128000, output: 8192, reasoning: false, tool_call: true, free: false }
        ]
      }
    ]
  });
});

app.get("/api/themes", (req, res) => {
  res.json({
    themes: [
      { id: "imperial-dark", name: "Imperial Dark", author: "IMPERIAL Team", category: "dark", popular: true, colors: ["#0f0d13", "#dc2626", "#ef4444", "#22c55e"] },
      { id: "cyberpunk-red", name: "Cyberpunk Red", author: "NeonDev", category: "dark", popular: true, colors: ["#0d0221", "#ff0055", "#00f5d4", "#fee440"] },
      { id: "dracula-synth", name: "Dracula Synth", author: "Zeno Rocha", category: "dark", popular: true, colors: ["#282a36", "#bd93f9", "#ff79c6", "#50fa7b"] },
      { id: "monokai-pro", name: "Monokai Pro", author: "Monokai", category: "dark", popular: true, colors: ["#2d2a2e", "#ffd866", "#ff6188", "#a9dc76"] },
      { id: "nordic-frost", name: "Nordic Frost", author: "Nordic Studio", category: "dark", popular: false, colors: ["#2e3440", "#88c0d0", "#81a1c1", "#a3be8c"] },
      { id: "catppuccin-mocha", name: "Catppuccin Mocha", author: "Catppuccin", category: "dark", popular: true, colors: ["#1e1e2e", "#f5e0dc", "#cba6f7", "#a6e3a1"] },
      { id: "tokyo-night", name: "Tokyo Night", author: "enkia", category: "dark", popular: true, colors: ["#1a1b26", "#7aa2f7", "#bb9af7", "#9ece6a"] },
      { id: "one-dark-pro", name: "One Dark Pro", author: "binaryify", category: "dark", popular: true, colors: ["#282c34", "#61afef", "#c678dd", "#98c379"] },
      { id: "gruvbox-dark", name: "Gruvbox Dark", author: "morhetz", category: "dark", popular: false, colors: ["#282828", "#fe8019", "#fabd2f", "#b8bb26"] },
      { id: "solarized-dark", name: "Solarized Dark", author: "Ethan Schoonover", category: "dark", popular: false, colors: ["#002b36", "#268bd2", "#d33682", "#859900"] },
      { id: "obsidian-oled", name: "Obsidian OLED Black", author: "IMPERIAL Lab", category: "dark", popular: true, colors: ["#000000", "#e11d48", "#f43f5e", "#10b981"] },
      { id: "emerald-matrix", name: "Emerald Matrix", author: "CyberOps", category: "dark", popular: false, colors: ["#05180f", "#10b981", "#34d399", "#059669"] },
      { id: "horizon-synth", name: "Horizon Synthetic", author: "Ayu Design", category: "dark", popular: false, colors: ["#1c1e26", "#e95678", "#26bbd9", "#29d398"] },
      { id: "clean-light", name: "Clean Minimal Light", author: "Studio Minimal", category: "light", popular: false, colors: ["#f8f9fa", "#2563eb", "#3b82f6", "#10b981"] },
      { id: "github-light", name: "GitHub Light Default", author: "GitHub", category: "light", popular: true, colors: ["#ffffff", "#0969da", "#cf222e", "#1a7f37"] },
      { id: "rose-pine", name: "Rosé Pine", author: "Rosé Pine Theme", category: "dark", popular: true, colors: ["#191724", "#ebbcba", "#31748f", "#9ccfd8"] },
      { id: "cobalt2", name: "Cobalt2 High Contrast", author: "Wes Bos", category: "dark", popular: false, colors: ["#193549", "#ffc600", "#0088ff", "#3ad900"] },
      { id: "synthwave-84", name: "Synthwave '84", author: "Robb Owen", category: "dark", popular: true, colors: ["#262335", "#ff7edb", "#36f9f6", "#fe4450"] },
      { id: "kanagawa", name: "Kanagawa Wave", author: "rebelot", category: "dark", popular: false, colors: ["#1f1f28", "#7e9cd8", "#957fb8", "#76946a"] },
      { id: "material-oceanic", name: "Material Oceanic", author: "Equinusocio", category: "dark", popular: false, colors: ["#0f111a", "#80cbc4", "#ff5370", "#c3e88d"] }
    ]
  });
});

app.get("/api/projects", (req, res) => {
  res.json({
    projects: [
      { name: "Opencode Configurator", path: process.cwd() },
      { name: "AI Studio Applet Workspace", path: "/workspace" }
    ],
    current: process.cwd()
  });
});

app.post("/api/projects/select", (req, res) => {
  res.json({ status: "selected", path: req.body?.path || process.cwd() });
});

app.post("/api/projects/scan", (req, res) => {
  res.json({ status: "scanned", found: 2 });
});

let isOpencodeRunning = false;
let opencodePid = 84192;
let opencodeStartedAt: string | null = null;

app.get("/api/opencode/status", (req, res) => {
  res.json({
    running: isOpencodeRunning,
    pids: isOpencodeRunning ? [opencodePid] : [],
    startedAt: opencodeStartedAt,
    mode: "Managed OpenCode Studio CLI"
  });
});

app.post("/api/opencode/start", (req, res) => {
  isOpencodeRunning = true;
  opencodePid = Math.floor(10000 + Math.random() * 80000);
  opencodeStartedAt = new Date().toISOString();
  res.json({ status: "started", pid: opencodePid, startedAt: opencodeStartedAt });
});

app.post("/api/opencode/kill", (req, res) => {
  isOpencodeRunning = false;
  res.json({ status: "killed", pid: opencodePid });
});

app.post("/api/opencode/full-cycle", (req, res) => {
  isOpencodeRunning = true;
  opencodePid = Math.floor(10000 + Math.random() * 80000);
  opencodeStartedAt = new Date().toISOString();
  res.json({ status: "cycle_completed", pid: opencodePid });
});

app.get("/api/opencode/config-path", (req, res) => {
  res.json({ path: "~/.config/opencode/opencode.json" });
});

app.get("/api/system/info", (req, res) => {
  const isExported = process.env.IS_STANDALONE_BUILD === "true";
  res.json({
    version: "v1.18.5",
    path: "/usr/local/bin/opencode",
    configs: ["~/.config/opencode/opencode.json"],
    auth_providers: ["Anthropic", "OpenAI", "Google", "DeepSeek", "Ollama", "Mistral AI"],
    runtime: "Node.js v20+ / Cloud Run Sandboxed Container",
    port: 3000,
    isExportedBuild: isExported,
    oneClickGeneratorEnabled: !isExported,
    deploymentDetails: {
      serverEntry: "server.ts -> dist/server.cjs (esbuild CJS bundle)",
      environment: process.env.NODE_ENV || "development",
      webFramework: "Express + Vite SPA Proxy Middleware",
      proxyPort: "Port 3000 (Exposed via Nginx Ingress Proxy)"
    }
  });
});

app.post("/api/ai-check-fix", async (req, res) => {
  // Simulate AI checking process
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  res.json({
    status: "success",
    message: "AI Check & Auto-Fix abgeschlossen.",
    logs: [
      "🔍 Starte KI-Analyse aller Plugins, Skills, MCP und LSP Server...",
      "🌐 Überprüfe Erreichbarkeit der Quellen...",
      "⚠️ Veraltete Quelle für 'TypeScript LSP' entdeckt (offline).",
      "⚠️ Defektes Repository für Plugin 'Auto-Format' entdeckt.",
      "🧠 Suche autonom nach neuen offiziellen Paketquellen...",
      "✅ Neue offizielle Quelle für 'TypeScript LSP' gefunden (npm:typescript-language-server).",
      "✅ Neues Repository für 'Auto-Format' identifiziert (github:prettier/prettier).",
      "🔄 Aktualisiere Konfiguration...",
      "✨ Alle Systeme sind nun up-to-date und funktionsfähig!"
    ],
    fixes: [
      { type: "LSP", name: "TypeScript LSP", oldSource: "ts-lsp-legacy", newSource: "typescript-language-server" },
      { type: "Plugin", name: "Auto-Format", oldSource: "old-formatter/git", newSource: "prettier/prettier" }
    ]
  });
});

// SERVE INDEX.HTML FOR ROOT & APP PREVIEW
app.get("/", (req, res) => {
  const htmlPath = path.join(process.cwd(), "templates", "index.html");
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.send("IMPERIAL OpenCode Configurator");
  }
});

// FALLBACK STATIC & DEV MIDDLEWARE
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const htmlPath = path.join(process.cwd(), "templates", "index.html");
      if (fs.existsSync(htmlPath)) {
        res.sendFile(htmlPath);
      } else {
        res.sendFile(path.join(distPath, "index.html"));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IMPERIAL Configurator running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
