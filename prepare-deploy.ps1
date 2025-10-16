# CampusThrift - Railway Deployment Preparation (Windows)

Write-Host "🚂 CampusThrift - Railway Deployment Preparation" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Generate APP_KEY
Write-Host "STEP 1: Generating APP_KEY..." -ForegroundColor Yellow
$APP_KEY = php artisan key:generate --show
Write-Host "✓ APP_KEY generated: $APP_KEY" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  SAVE THIS KEY! You'll need it for Railway environment variables." -ForegroundColor Red
Write-Host ""
Read-Host "Press Enter to continue"
Write-Host ""

# Step 2: Install dependencies
Write-Host "STEP 2: Installing production dependencies..." -ForegroundColor Yellow
composer install --optimize-autoloader --no-dev
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Composer dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Composer install failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Build frontend
Write-Host "STEP 3: Building frontend assets..." -ForegroundColor Yellow
npm ci
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend assets built" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend build failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Test caching
Write-Host "STEP 4: Testing production cache..." -ForegroundColor Yellow
php artisan config:cache
php artisan route:cache
php artisan view:cache
Write-Host "✓ Cache test successful" -ForegroundColor Green
Write-Host ""

# Clear cache
php artisan config:clear
php artisan route:clear
php artisan view:clear
Write-Host "✓ Cache cleared for deployment" -ForegroundColor Green
Write-Host ""

# Step 5: Check Git status
Write-Host "STEP 5: Checking Git status..." -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "✓ Git repository exists" -ForegroundColor Green
} else {
    Write-Host "⚠  Git not initialized. Initializing..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git initialized" -ForegroundColor Green
}
Write-Host ""

# Summary
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ DEPLOYMENT PREPARATION COMPLETE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Copy your APP_KEY: $APP_KEY" -ForegroundColor Cyan
Write-Host "2. Create GitHub repository"
Write-Host "3. Push code to GitHub"
Write-Host "4. Follow instructions in deploy-railway.md"
Write-Host ""
Write-Host "Quick commands:" -ForegroundColor Yellow
Write-Host '  git add .'
Write-Host '  git commit -m "Ready for Railway deployment"'
Write-Host '  git remote add origin https://github.com/YOUR_USERNAME/CampusThrift.git'
Write-Host '  git push -u origin main'
Write-Host ""
Write-Host "Press Enter to exit..."
Read-Host

