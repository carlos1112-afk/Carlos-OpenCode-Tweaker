#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd "$DIR"
chmod +x start-mac.sh 2>/dev/null || true
./start-mac.sh
