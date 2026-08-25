#!/bin/bash
# Imperial OpenCode Studio - macOS Interactive Launcher
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd "$DIR"

clear
echo "=========================================================="
echo "    IMPERIAL OPENCODE STUDIO - MACOS SETUP & LAUNCHER"
echo "=========================================================="
echo ""

echo "1. Schalte macOS Gatekeeper Quarantäne frei..."
xattr -cr "ImperialOpenCode.app" 2>/dev/null || true
xattr -cr . 2>/dev/null || true

echo "2. Setze Ausführungsrechte (+x)..."
chmod +x "ImperialOpenCode.app/Contents/MacOS/ImperialOpenCode" 2>/dev/null || true
chmod +x "start-mac.sh" 2>/dev/null || true
chmod +x "Start_macOS.command" 2>/dev/null || true

echo "3. Prüfe Node.js Umgebung..."
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$HOME/.nvm/versions/node/$(ls "$HOME/.nvm/versions/node" 2>/dev/null | tail -n 1)/bin:$HOME/.fnm/current/bin:$HOME/.n/bin:$HOME/.volta/bin:$PATH"

NODE_CMD="$(which node 2>/dev/null)"
if [ -z "$NODE_CMD" ]; then
  for candidate in /opt/homebrew/bin/node /usr/local/bin/node "$HOME/.nvm/versions/node/"*/bin/node "$HOME/.fnm/current/bin/node"; do
    if [ -x "$candidate" ]; then
      NODE_CMD="$candidate"
      export PATH="$(dirname "$candidate"):$PATH"
      break
    fi
  done
fi

if [ -z "$NODE_CMD" ]; then
  echo ""
  echo "❌ FEHLER: Node.js ist nicht installiert!"
  echo "   Bitte lade Node.js von https://nodejs.org herunter"
  echo "   Oder führe im Terminal aus: brew install node"
  echo ""
  read -p "Drücke EINGABETASTE zum Beenden..."
  exit 1
fi

echo "✅ Node.js gefunden: $($NODE_CMD -v)"

if [ -d "ImperialOpenCode.app/Contents/Resources/app" ]; then
  cd "ImperialOpenCode.app/Contents/Resources/app" || exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "4. Installiere Abhängigkeiten (npm install)..."
  npm install
fi

if [ ! -d "dist" ]; then
  echo "5. Compiliere Standalone Production Build..."
  npm run build
fi

export IS_STANDALONE_BUILD="true"
export PORT="3000"

echo ""
echo "=========================================================="
echo " 🚀 Imperial OpenCode läuft unter: http://localhost:3000"
echo " (Lasse dieses Terminalfenster geöffnet)"
echo "=========================================================="
echo ""

(sleep 2 && open "http://localhost:3000") &
npm start
