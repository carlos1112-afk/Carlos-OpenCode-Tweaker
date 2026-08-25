@echo off
title Imperial OpenCode Studio - 1-Click EXE Builder & Launcher
color 0A
cls
echo ================================================================
echo    IMPERIAL OPENCODE STUDIO - 1-CLICK EXE BUILDER & LAUNCHER
echo ================================================================
echo.

echo [1/4] Checking Node.js Environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed! 
    echo Please download and install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [2/4] Installing Project Dependencies...
if not exist "node_modules" (
    call npm install
) else (
    echo Dependencies already initialized.
)

echo [3/4] Compiling Standalone Production Build...
call npm run build

echo [4/4] Building Native Executable (ImperialOpenCode.exe)...
powershell -Command "$code = @'
using System;
using System.Diagnostics;
using System.IO;
using System.Threading;

namespace ImperialOpenCode {
    class Program {
        static void Main(string[] args) {
            Console.WriteLine(\"====================================================\");
            Console.WriteLine(\"   IMPERIAL OPENCODE STUDIO - STANDALONE EXE       \");
            Console.WriteLine(\"====================================================\");
            string appDir = AppDomain.CurrentDomain.BaseDirectory;
            ProcessStartInfo psi = new ProcessStartInfo(\"cmd.exe\", \"/c npm start\") {
                WorkingDirectory = appDir,
                UseShellExecute = false,
                CreateNoWindow = false
            };
            psi.EnvironmentVariables[\"PORT\"] = \"3000\";
            psi.EnvironmentVariables[\"IS_STANDALONE_BUILD\"] = \"true\";
            
            try {
                Process server = Process.Start(psi);
                Thread.Sleep(2000);
                Process.Start(new ProcessStartInfo(\"http://localhost:3000\") { UseShellExecute = true });
                Console.WriteLine(\"\n[SUCCESS] Server active at http://localhost:3000\");
                server.WaitForExit();
            } catch (Exception ex) {
                Console.WriteLine(\"[ERROR] Failed to start server: \" + ex.Message);
            }
        }
    }
'@; Add-Type -TypeDefinition $code -OutputAssembly 'ImperialOpenCode.exe' -OutputType ConsoleApplication"

if exist "ImperialOpenCode.exe" (
    echo.
    echo ================================================================
    echo  SUCCESS: ImperialOpenCode.exe compiled successfully!
    echo ================================================================
    echo.
    echo Launching ImperialOpenCode.exe now...
    start ImperialOpenCode.exe
) else (
    echo.
    echo [INFO] Starting Application directly via npm...
    start http://localhost:3000
    call npm start
)

pause
