# ⚡ OpenCode - Tweaker (v2.1 Pro)

> **High-Performance Visual Configuration Studio, Diagnostics Suite & Live Editor for OpenCode (`opencode.json`).**

![OpenCode Tweaker Banner](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80)

---

## 🌟 Übersicht (Features)

**OpenCode Tweaker** ist die ultimative grafische Management- und Optimierungs-Suite für Entwickler, die mit dem OpenCode KI-Agenten-Ökosystem arbeiten. Sie ermöglicht visuelle Konfiguration, Echtzeit-Validierung, AI-gestützte Fehlerbehebung und blitzschnelle Workflows.

### 🚀 Kernfunktionen

- ⚡ **Global Command Palette (`Ctrl + K` / `Cmd + K`)**:
  - Blitzschnelle Navigation zwischen Tabs (*Dashboard, opencode.json, KI-Modelle, Plugins & Skills, MCP & LSP, Themes, System*).
  - Direkte Aktionsausführung: *Config Speichern (`Ctrl + S`), JSON Formatieren (Prettify), Validieren, AI-Fix, OpenCode Starten, Wallpaper Umschalten*.
  - Schnell-Anwendung vorkonfigurierter Presets (*Fullstack Web, Python/Data Science, Autonomous Agent, General Optimal*).
  - Tastatursteuerung via Pfeiltasten (`↑`/`↓`), `Enter` und `Esc`.

- 📝 **Interaktiver `opencode.json` Live-Editor**:
  - **Echtzeit-Syntaxprüfung**: Erkennt Trailing Commas, fehlende Trennkommas, unquoted Keys, einfache Anführungszeichen und fehlerhafte Klammern beim Tippen.
  - **In-Textarea Wavy Underline**: Rote Wellenlinien markieren Syntaxfehler direkt an Ort und Stelle.
  - **Intelligente Hover-Tooltips**: Detaildiagnose mit Zeilen-/Spaltenangabe, Fehlerursache und konkretem Lösungsvorschlag.
  - **Gutter & Line Markers**: Zeilennummernleiste mit klickbaren Fehler-Symbolen (`❌`) für sekundenschnelles Anspringen.
  - **Tab-Indentation**: Volle Unterstützung für `Tab` (2 Spaces) und `Shift + Tab` (Outdent).

- ✨ **Integrierter AI Check & Auto-Fix**:
  - Automatische Erkennung veralteter Schema-Versionen, ungültiger Modell-Bezeichner, fehlender Umgebungsvariablen oder defekter Pfade.
  - Generiert bereinigte und optimierte `opencode.json`-Konfigurationen auf Knopfdruck.

- 🧩 **Modularer Katalog & Preset-Manager**:
  - Visuelle Konfiguration von **Plugins, MCP-Servern (Model Context Protocol), LSP (Language Server Protocol) und Skills**.
  - Provider-Manager für Anthropic Claude, OpenAI, Google Gemini, DeepSeek, Ollama und Mistral AI.
  - Integrierte Farbthemen (Tweaker Cyber, Tokyo Night, Dracula, Cyberpunk Neon).

- 🌧 **Cyberpunk & Minimal UI**:
  - Dynamischer Matrix-Code-Rain, Neural Network Partikel-Canvas oder cleanes Dark-Design.

---

## 🛠️ Schnellstart (Installation & Start)

### Voraussetzungen
- Node.js (v18 oder höher empfohlen)
- npm oder yarn / pnpm

### 1. Repository klonen
```bash
git clone https://github.com/your-username/opencode-tweaker.git
cd opencode-tweaker
```

### 2. Abhängigkeiten installieren
```bash
npm install
```

### 3. Umgebungsvariablen einrichten (Optional für AI-Features)
Kopiere die `.env.example` Datei und trage deinen Gemini API Key ein:
```bash
cp .env.example .env
```
*(Bearbeite `.env` und setze `GEMINI_API_KEY=dein_schluessel`)*

### 4. Entwicklungsserver starten
```bash
npm run dev
```
Öffne anschließend [http://localhost:3000](http://localhost:3000) im Browser.

### 5. Produktions-Build
Für die Produktion muss das Projekt zunächst gebaut werden:
```bash
npm run build
```

Anschließend kann der Server gestartet werden (dies setzt automatisch `NODE_ENV=production`):
```bash
npm start
```
Hinweis: Wenn der Port 3000 bereits belegt ist, erhältst du eine Fehlermeldung und der Server beendet sich sauber. Beende in diesem Fall den anderen Prozess.

---

## ⌨️ Tastaturkürzel (Shortcuts)

| Shortcut | Funktion |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>Cmd</kbd> + <kbd>K</kbd> | **Globale Befehlspalette öffnen** |
| <kbd>Ctrl</kbd> + <kbd>S</kbd> / <kbd>Cmd</kbd> + <kbd>S</kbd> | **Konfiguration / Editor sofort speichern** |
| <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd> | 2-Spaces Einrücken / Ausrücken im Editor |
| <kbd>Esc</kbd> | Aktiven Dialog / Befehlspalette schließen |
| <kbd>↑</kbd> / <kbd>↓</kbd> | In der Befehlspalette navigieren |
| <kbd>Enter</kbd> | Ausgewählten Befehl in der Palette ausführen |

---

## 📂 Projektstruktur

```text
├── server.ts             # Express Server & REST API Endpoints (/api/config, /api/mcp, /api/ai-check-fix)
├── templates/
│   └── index.html        # Vollständige Single-Page Visual Tweaker Suite mit Command Palette & Code Engine
├── metadata.json         # Anwendungs-Metadaten & Cloud-Berechtigungen
├── package.json          # Node.js Abhängigkeiten & Build-Skripte
├── tsconfig.json         # TypeScript Konfiguration
├── vite.config.ts        # Vite Build Pipeline
└── .env.example          # Vorlage für Umgebungsvariablen
```

---

## 📜 Lizenz

Veröffentlicht unter der [MIT License](LICENSE).
OpenCode Tweaker ist ein Community-Projekt zur Steigerung der Produktivität mit OpenCode.
