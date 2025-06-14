@echo off
echo Iniciando Hannover Store...
echo.

echo Iniciando Backend (porta 3002)...
start "Backend" cmd /k "cd hannover-backend && node server-simple.js"

timeout /t 3 /nobreak >nul

echo Iniciando Frontend (porta 3001)...
start "Frontend" cmd /k "npm run dev"

echo.
echo Ambos os servidores foram iniciados!
echo Backend: http://localhost:3002
echo Frontend: http://localhost:3001
echo.
echo Pressione qualquer tecla para sair...
pause >nul 