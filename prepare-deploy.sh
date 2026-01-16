#!/bin/bash

echo " CampusThrift - Railway Deployment Preparation"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Generate APP_KEY
echo -e "${YELLOW}STEP 1: Generating APP_KEY...${NC}"
APP_KEY=$(php artisan key:generate --show)
echo -e "${GREEN}✓ APP_KEY generated: ${APP_KEY}${NC}"
echo ""
echo "  SAVE THIS KEY! You'll need it for Railway environment variables."
echo ""
read -p "Press Enter to continue..."
echo ""

# Step 2: Install dependencies
echo -e "${YELLOW}STEP 2: Installing production dependencies...${NC}"
composer install --optimize-autoloader --no-dev
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Composer dependencies installed${NC}"
else
    echo -e "${RED}✗ Composer install failed${NC}"
    exit 1
fi
echo ""

# Step 3: Build frontend
echo -e "${YELLOW}STEP 3: Building frontend assets...${NC}"
npm ci
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend assets built${NC}"
else
    echo -e "${RED}✗ Frontend build failed${NC}"
    exit 1
fi
echo ""

# Step 4: Test caching
echo -e "${YELLOW}STEP 4: Testing production cache...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo -e "${GREEN}✓ Cache test successful${NC}"
echo ""

# Clear cache
php artisan config:clear
php artisan route:clear
php artisan view:clear
echo -e "${GREEN}✓ Cache cleared for deployment${NC}"
echo ""

# Step 5: Check Git status
echo -e "${YELLOW}STEP 5: Checking Git status...${NC}"
if [ -d .git ]; then
    echo -e "${GREEN}✓ Git repository exists${NC}"
else
    echo -e "${YELLOW}⚠  Git not initialized. Initializing...${NC}"
    git init
    echo -e "${GREEN}✓ Git initialized${NC}"
fi
echo ""

# Summary
echo "================================================"
echo -e "${GREEN}✅ DEPLOYMENT PREPARATION COMPLETE!${NC}"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Copy your APP_KEY: ${APP_KEY}"
echo "2. Create GitHub repository"
echo "3. Push code: git add . && git commit -m 'Ready for deployment' && git push"
echo "4. Follow instructions in deploy-railway.md"
echo ""
echo "Quick commands:"
echo "  git add ."
echo "  git commit -m 'Ready for Railway deployment'"
echo "  git remote add origin https://github.com/YOUR_USERNAME/CampusThrift.git"
echo "  git push -u origin main"
echo ""

