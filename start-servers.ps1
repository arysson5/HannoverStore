Write-Host "Iniciando servidores da Hannover Store..." -ForegroundColor Green
Write-Host ""

Write-Host "Iniciando Backend (porta 3002)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd hannover-backend; npm start"

Start-Sleep -Seconds 3

Write-Host "Iniciando Frontend (porta 3000)..." -ForegroundColor Yellow  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host ""
Write-Host "Servidores iniciados!" -ForegroundColor Green
Write-Host "Backend: http://localhost:3002" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 