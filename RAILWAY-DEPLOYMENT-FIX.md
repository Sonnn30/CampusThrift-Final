# 🔧 Railway Deployment Error Fix

## ❌ Error: `composer: command not found`

### Error Details:
```
ERROR: failed to build: failed to solve: process "/bin/bash -ol pipefail -c composer install --no-dev --optimize-autoloader --no-interaction" did not complete successfully: exit code: 127
```

---

## 🎯 Solution Steps

### **STEP 1: Update nixpacks.toml (SUDAH DILAKUKAN ✅)**

File `nixpacks.toml` sudah diupdate dengan menambahkan `php82Packages.composer`.

**Isi baru:**
```toml
[phases.setup]
nixPkgs = ['php82', 'php82Extensions.pdo', 'php82Extensions.pdo_mysql', 'php82Extensions.mbstring', 'php82Extensions.xml', 'php82Extensions.curl', 'php82Extensions.zip', 'php82Extensions.gd', 'php82Packages.composer', 'nodejs-18_x']

[phases.install]
cmds = [
  'composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist',
  'npm ci --legacy-peer-deps'
]

[phases.build]
cmds = [
  'npm run build',
  'php artisan config:cache',
  'php artisan route:cache',
  'php artisan view:cache'
]

[start]
cmd = 'php artisan serve --host=0.0.0.0 --port=$PORT'
```

---

### **STEP 2: Commit & Push Updated File**

```bash
git add nixpacks.toml
git commit -m "Fix: Add composer to nixpacks configuration"
git push
```

Railway akan otomatis detect perubahan dan redeploy.

---

### **STEP 3: Monitor Deployment**

#### **A. Via Railway Dashboard:**
1. Buka Railway dashboard
2. Klik project "CampusThrift"
3. Tab "Deployments"
4. Watch build logs

#### **B. Via Railway CLI:**
```bash
railway logs --follow
```

Tunggu hingga muncul:
```
✓ Build completed
✓ Server started on port 3000
```

---

## 🔄 Alternative Solutions (Jika Masih Error)

### **Solution A: Use Alternative Config**

Jika masih error, gunakan config alternative:

```bash
# Rename current nixpacks.toml
mv nixpacks.toml nixpacks.toml.backup

# Use simple version
mv nixpacks-simple.toml nixpacks.toml

# Commit & push
git add nixpacks.toml
git commit -m "Use alternative nixpacks config"
git push
```

---

### **Solution B: Let Railway Auto-Detect**

Jika nixpacks masih bermasalah:

```bash
# Delete nixpacks.toml temporarily
git rm nixpacks.toml

# Commit
git commit -m "Let Railway auto-detect build system"
git push
```

Railway akan auto-detect Laravel dan build dengan default config.

**Restore later:**
```bash
git revert HEAD
git push
```

---

### **Solution C: Use Heroku Buildpack**

Railway support Heroku buildpacks:

**Create `railway.toml`:**
```toml
[build]
builder = "HEROKU"

[deploy]
startCommand = "php artisan serve --host=0.0.0.0 --port=$PORT"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

**Commit:**
```bash
git add railway.toml
git commit -m "Use Heroku buildpack"
git push
```

---

### **Solution D: Check Railway Service Settings**

1. Railway Dashboard → Service "CampusThrift"
2. Settings → Builder
3. Pastikan: **NIXPACKS** atau **AUTO**
4. Jika DOCKERFILE, change ke NIXPACKS

---

## 🔍 Debugging Steps

### **1. Check Railway Logs:**
```bash
railway logs | grep -i error
railway logs | grep -i composer
```

### **2. Verify File Exists:**
```bash
# Local check
cat nixpacks.toml

# Check if committed
git status
git log -1 --name-only
```

### **3. Check Railway Variables:**
```bash
railway variables
```

Pastikan semua environment variables sudah diset.

### **4. Manual Build Test (Local):**
```bash
# Test composer install
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Test npm
npm ci

# Test build
npm run build

# Test artisan
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 📝 Common Causes & Fixes

### **Cause 1: nixpacks.toml not committed**
```bash
git add nixpacks.toml
git commit -m "Add nixpacks config"
git push
```

### **Cause 2: Wrong PHP version**
Update nixpacks.toml:
```toml
nixPkgs = ['php81', 'php81Packages.composer', ...]  # Try PHP 8.1
```

### **Cause 3: Railway cache issue**
1. Railway Dashboard → Settings
2. Scroll to bottom
3. Click "Redeploy from Scratch"

### **Cause 4: Build timeout**
Update nixpacks.toml with faster install:
```toml
[phases.install]
cmds = [
  'composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-scripts',
  'npm ci --omit=dev'
]
```

---

## ✅ Verification Steps

After deploy succeeds:

### **1. Check Service Status:**
```bash
railway status
```

Expected: `🟢 Active`

### **2. Check Logs:**
```bash
railway logs | tail -50
```

Should see: `Server started on port...`

### **3. Test Domain:**
```bash
curl -I https://your-app.railway.app
```

Expected: `HTTP/2 200` or `HTTP/2 302`

### **4. Test Website:**
Open browser: `https://your-app.railway.app`

Should see: Homepage loaded

---

## 🆘 Still Not Working?

### **Option 1: Railway Discord (Fastest!)**
1. Join: https://discord.gg/railway
2. Go to #help channel
3. Share:
   - Error message
   - nixpacks.toml content
   - Build logs

### **Option 2: Try Different Platform**

**Render.com (Free Forever):**
- Simpler configuration
- Auto-detect Laravel
- Free PostgreSQL/MySQL

**Steps:**
1. Create account: https://render.com
2. New Web Service → Connect GitHub
3. Auto-detected as PHP
4. Add MySQL database
5. Set environment variables
6. Deploy!

---

## 📊 Deployment Status Checklist

- [ ] nixpacks.toml updated with composer
- [ ] File committed to git
- [ ] Pushed to GitHub
- [ ] Railway redeploying
- [ ] Build logs showing progress
- [ ] No error in logs
- [ ] Service status: Active
- [ ] Domain accessible
- [ ] Website loads

---

## 💡 Prevention Tips

### **1. Always Test Locally First:**
```bash
composer install
npm run build
php artisan serve
```

### **2. Keep Dependencies Updated:**
```bash
composer update
npm update
```

### **3. Use .railwayignore:**
Already created! Ensures clean deployments.

### **4. Monitor Resource Usage:**
Railway Dashboard → Settings → Usage

### **5. Enable Notifications:**
Railway Dashboard → Settings → Notifications
- Email alerts untuk deployment failures

---

## 📚 Additional Resources

**Railway Docs:**
- https://docs.railway.app/deploy/deployments
- https://docs.railway.app/deploy/builds
- https://docs.railway.app/reference/nixpacks

**Nixpacks Docs:**
- https://nixpacks.com/docs
- https://nixpacks.com/docs/providers/php

**Laravel Deployment:**
- https://laravel.com/docs/10.x/deployment

---

## 🎯 Quick Command Reference

```bash
# Push changes
git add .
git commit -m "Fix deployment"
git push

# Watch logs
railway logs --follow

# Check status
railway status

# Redeploy manually
railway up

# Run artisan commands
railway run php artisan migrate --force
railway run php artisan optimize:clear

# Check variables
railway variables

# Link to project (if needed)
railway link
```

---

## ✨ Success Indicators

Your deployment is successful when:
1. ✅ Build completes without errors
2. ✅ Service shows as "Active"
3. ✅ Domain is accessible
4. ✅ Homepage loads correctly
5. ✅ Database connection works
6. ✅ Assets (CSS/JS) load
7. ✅ No 500 errors

---

**Error ini mudah diperbaiki! Ikuti Step 1-2 dan harusnya sudah solved.** 🚀

**Update: nixpacks.toml sudah diperbaiki. Tinggal commit & push!**

