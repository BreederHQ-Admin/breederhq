# Clean workspace on Windows
Write-Host "Cleaning node_modules and lockfile..." -ForegroundColor Cyan
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }
Write-Host "Done. Run 'npm install' next." -ForegroundColor Green
