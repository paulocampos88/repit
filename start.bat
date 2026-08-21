@echo off
cd /d "%~dp0"
echo Starting Repit dev server...
call npm run dev
pause
