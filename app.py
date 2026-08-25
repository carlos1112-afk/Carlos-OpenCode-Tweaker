import os
import json
import subprocess
import signal
from flask import Flask, render_template, request, jsonify

app = Flask(__name__, template_folder='templates', static_folder='static')

# CONFIG PATHS
CONFIG_PATH = os.path.expanduser('~/.config/opencode/opencode.json')
PROJECTS_FILE = os.path.expanduser('~/.config/opencode/projects.json')

# DEFAULT CONFIG SCHEMA
DEFAULT_CONFIG = {
    "$schema": "https://opencode.ai/config.json",
    "model": "anthropic/claude-3-7-sonnet",
    "small_model": "anthropic/claude-3-5-haiku",
    "default_agent": "build",
    "plugin": [],
    "mcp": {},
    "lsp": {},
    "skills": {
        "paths": [],
        "urls": []
    },
    "provider": {},
    "agent": {},
    "theme": "imperial-dark",
    "permission": {},
    "instructions": "",
    "experimental": {}
}

def load_config_data():
    if not os.path.exists(CONFIG_PATH):
        os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
        with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
            json.dump(DEFAULT_CONFIG, f, indent=2)
        return DEFAULT_CONFIG.copy()
    try:
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return DEFAULT_CONFIG.copy()

def save_config_data(new_config):
    os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
    current = load_config_data()
    # Deep merge root keys
    for k, v in new_config.items():
        if isinstance(v, dict) and k in current and isinstance(current[k], dict):
            current[k].update(v)
        else:
            current[k] = v
    with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
        json.dump(current, f, indent=2)
    return current

# ROUTE: MAIN APP
@app.route('/')
def index():
    return render_template('index.html')

# ROUTE: CONFIG API
@app.route('/api/config', methods=['GET', 'POST'])
def handle_config():
    if request.method === 'POST':
        data = request.json or {}
        saved = save_config_data(data)
        return jsonify(saved)
    return jsonify(load_config_data())

@app.route('/api/config/preview', methods=['POST'])
def config_preview():
    data = request.json or {}
    return jsonify(data)

# ROUTE: PLUGINS
@app.route('/api/plugins', methods=['GET'])
def get_plugins():
    plugins = [
        {"id": "opencode-theme", "name": "Theme Selector", "description": "Manage theme settings for opencode", "npm": "@opencode/plugin-theme", "category": "ui", "tags": ["theme", "ui"]},
        {"id": "opencode-git", "name": "Git Integration", "description": "Automated git commits and workflow helpers", "npm": "@opencode/plugin-git", "category": "development", "tags": ["git", "vcs"]},
        {"id": "opencode-voice", "name": "Voice Assistant", "description": "Speak prompts directly to OpenCode", "npm": "@opencode/plugin-voice", "category": "accessibility", "tags": ["voice", "audio"]},
        {"id": "opencode-linter", "name": "Linter Suite", "description": "Auto-lint code during editing sessions", "npm": "@opencode/plugin-linter", "category": "quality", "tags": ["linter", "code"]}
    ]
    return jsonify({"plugins": plugins})

@app.route('/api/plugins/install', methods=['POST'])
def install_plugins():
    data = request.json or {}
    plugins = data.get('plugins', [])
    return jsonify({"status": "success", "installed": plugins})

# ROUTE: MCP
@app.route('/api/mcp', methods=['GET'])
def get_mcp():
    mcps = [
        {"id": "puppeteer", "name": "Puppeteer Browser", "description": "Control headless Chrome for scraping and testing", "type": "local", "command": ["npx", "-y", "@modelcontextprotocol/server-puppeteer"], "category": "browser", "popular": True},
        {"id": "postgres", "name": "PostgreSQL DB", "description": "Query and inspect Postgres databases", "type": "local", "command": ["npx", "-y", "@modelcontextprotocol/server-postgres"], "category": "database", "popular": True},
        {"id": "github", "name": "GitHub API", "description": "Access issues, PRs, and repositories", "type": "local", "command": ["npx", "-y", "@modelcontextprotocol/server-github"], "category": "development", "popular": True},
        {"id": "filesystem", "name": "Filesystem Access", "description": "Secure local directory manipulation", "type": "local", "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem"], "category": "filesystem", "popular": False}
    ]
    return jsonify({"mcpServers": mcps})

@app.route('/api/mcp/install', methods=['POST'])
def install_mcp():
    data = request.json or {}
    mcps = data.get('mcps', [])
    return jsonify({"status": "success", "installed": mcps})

# ROUTE: SKILLS
@app.route('/api/skills', methods=['GET'])
def get_skills():
    skills = [
        {"id": "react-patterns", "name": "React Best Practices", "description": "Coding standards and hooks guidelines for React 19", "path": "~/.config/opencode/skill/react-patterns", "category": "development", "tags": ["react", "frontend"]},
        {"id": "python-fastapi", "name": "FastAPI Master", "description": "API route schemas and async execution patterns", "path": "~/.config/opencode/skill/python-fastapi", "category": "development", "tags": ["python", "backend"]},
        {"id": "security-audit", "name": "Security Inspector", "description": "Audit dependencies and code vulnerability patterns", "path": "~/.config/opencode/skill/security-audit", "category": "security", "tags": ["security", "audit"]}
    ]
    return jsonify({"skills": skills})

# ROUTE: LSP
@app.route('/api/lsp', methods=['GET'])
def get_lsp():
    lsp_servers = [
        {"id": "pyright", "name": "Pyright (Python)", "extensions": [".py"], "command": ["pyright-langserver", "--stdio"], "popular": True},
        {"id": "typescript-language-server", "name": "TypeScript/JS", "extensions": [".ts", ".tsx", ".js", ".jsx"], "command": ["typescript-language-server", "--stdio"], "popular": True},
        {"id": "rust-analyzer", "name": "Rust Analyzer", "extensions": [".rs"], "command": ["rust-analyzer"], "popular": True}
    ]
    return jsonify({"lsp_servers": lsp_servers})

# ROUTE: PROVIDERS
@app.route('/api/providers', methods=['GET'])
def get_providers():
    providers = [
        {
            "id": "anthropic",
            "name": "Anthropic",
            "api": "anthropic",
            "recommended": True,
            "models": [
                {"id": "claude-3-7-sonnet", "name": "Claude 3.7 Sonnet", "context": 200000, "output": 8192, "reasoning": True, "tool_call": True, "free": False},
                {"id": "claude-3-5-haiku", "name": "Claude 3.5 Haiku", "context": 200000, "output": 4096, "reasoning": False, "tool_call": True, "free": False}
            ]
        },
        {
            "id": "openai",
            "name": "OpenAI",
            "api": "openai",
            "recommended": True,
            "models": [
                {"id": "gpt-4o", "name": "GPT-4o", "context": 128000, "output": 4096, "reasoning": False, "tool_call": True, "free": False},
                {"id": "o3-mini", "name": "o3-mini", "context": 200000, "output": 65536, "reasoning": True, "tool_call": True, "free": False}
            ]
        }
    ]
    return jsonify({"providers": providers})

# ROUTE: THEMES
@app.route('/api/themes', methods=['GET'])
def get_themes():
    themes = [
        {"id": "imperial-dark", "name": "Imperial Dark", "author": "IMPERIAL Team", "category": "dark", "popular": True, "colors": ["#0a0a0a", "#ff3333", "#00ff66"]},
        {"id": "cyberpunk-red", "name": "Cyberpunk Red", "author": "NeonDev", "category": "dark", "popular": True, "colors": ["#0d0221", "#ff0055", "#00f5d4"]},
        {"id": "clean-light", "name": "Clean Minimal Light", "author": "Studio", "category": "light", "popular": False, "colors": ["#f8f9fa", "#3b82f6", "#10b981"]}
    ]
    return jsonify({"themes": themes})

# ROUTE: PROJECTS
@app.route('/api/projects', methods=['GET'])
def get_projects():
    projects = [
        {"name": "Opencode Configurator", "path": os.getcwd()},
        {"name": "AI Studio Applet", "path": "/workspace"}
    ]
    return jsonify({"projects": projects, "current": os.getcwd()})

@app.route('/api/projects/select', methods=['POST'])
def select_project():
    data = request.json or {}
    return jsonify({"status": "selected", "path": data.get('path')})

@app.route('/api/projects/scan', methods=['POST'])
def scan_projects():
    return jsonify({"status": "scanned", "found": 2})

# ROUTE: OPENCODE APP CONTROL
@app.route('/api/opencode/status', methods=['GET'])
def opencode_status():
    return jsonify({"running": False, "pids": []})

@app.route('/api/opencode/start', methods=['POST'])
def opencode_start():
    return jsonify({"status": "started"})

@app.route('/api/opencode/kill', methods=['POST'])
def opencode_kill():
    return jsonify({"status": "killed"})

@app.route('/api/opencode/full-cycle', methods=['POST'])
def opencode_full_cycle():
    return jsonify({"status": "cycle_completed"})

@app.route('/api/opencode/import', methods=['POST'])
def opencode_import():
    data = request.json or {}
    config = data.get('config', {})
    saved = save_config_data(config)
    return jsonify({"status": "imported", "config": saved})

@app.route('/api/opencode/config-path', methods=['GET'])
def opencode_config_path():
    return jsonify({"path": CONFIG_PATH})

# ROUTE: SYSTEM
@app.route('/api/system/info', methods=['GET'])
def system_info():
    return jsonify({
        "version": "v1.18.5",
        "path": "/usr/local/bin/opencode",
        "configs": [CONFIG_PATH],
        "auth_providers": ["Anthropic", "OpenAI", "Google"]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=50123, debug=True)
