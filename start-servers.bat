@echo off
echo Iniciando servidores da Hannover Store...
echo.

echo Iniciando Backend (porta 3002)...
start "Backend" cmd /k "cd hannover-backend && npm start"

timeout /t 3 /nobreak > nul

echo Iniciando Frontend (porta 3000)...
start "Frontend" cmd /k "npm run dev"

echo.
echo Servidores iniciados!
echo Backend: http://localhost:3002
echo Frontend: http://localhost:3000
echo.
pause 