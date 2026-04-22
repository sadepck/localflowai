# Script para crear carpeta con archivos esenciales para deploy
# Ejecutar en PowerShell desde D:\localflowai

Write-Host "Creando carpeta para deploy..." -ForegroundColor Green

# Crear carpeta de destino
$destino = "D:\localflowai-deploy"
if (Test-Path $destino) {
    Remove-Item -Recurse -Force $destino
    Write-Host "Carpeta anterior eliminada" -ForegroundColor Yellow
}
New-Item -ItemType Directory -Path $destino | Out-Null

Write-Host "Copiando archivos raíz..." -ForegroundColor Cyan

# Copiar archivos de configuración raíz
Copy-Item "package.json" $destino
Copy-Item "package-lock.json" $destino
Copy-Item "vite.config.js" $destino
Copy-Item "tailwind.config.js" $destino
Copy-Item "postcss.config.js" $destino
Copy-Item "eslint.config.js" $destino
Copy-Item "index.html" $destino
Copy-Item "netlify.toml" $destino
Copy-Item ".gitignore" $destino
Copy-Item ".env.example" $destino
Copy-Item "README.md" $destino
Copy-Item "SETUP.md" $destino
Copy-Item "ARCHITECTURE.md" $destino
Copy-Item "DEPLOY.md" $destino

Write-Host "Copiando carpeta src..." -ForegroundColor Cyan

# Copiar toda la carpeta src con su estructura
Copy-Item -Recurse "src" $destino

Write-Host "Copiando carpeta supabase..." -ForegroundColor Cyan

# Copiar carpeta supabase
Copy-Item -Recurse "supabase" $destino

Write-Host "Copiando carpeta public (si existe)..." -ForegroundColor Cyan

# Copiar public si existe
if (Test-Path "public") {
    Copy-Item -Recurse "public" $destino
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "✅ Carpeta de deploy creada exitosamente!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Ubicación: $destino" -ForegroundColor Yellow
Write-Host ""
Write-Host "Siguiente paso:" -ForegroundColor Cyan
Write-Host "1. Abre PowerShell en: $destino" -ForegroundColor White
Write-Host "2. Ejecuta: git init" -ForegroundColor White
Write-Host "3. Ejecuta: git add ." -ForegroundColor White
Write-Host "4. Ejecuta: git commit -m 'Initial commit'" -ForegroundColor White
Write-Host "5. Crea repo en GitHub y sube el código" -ForegroundColor White
Write-Host ""
