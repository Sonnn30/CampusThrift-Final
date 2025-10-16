# 🚂 CampusThrift - Railway Deployment Guide

> **Complete guide untuk deploy Laravel + Inertia.js + React ke Railway.app**

---

## 📚 Table of Contents

1. [Quick Start (5 Menit)](#quick-start)
2. [File yang Sudah Dibuat](#files-created)
3. [Step-by-Step Guide](#step-by-step)
4. [Troubleshooting](#troubleshooting)
5. [Post-Deployment](#post-deployment)
6. [FAQs](#faqs)

---

## 🚀 Quick Start

### Untuk yang buru-buru:

```bash
# 1. Generate APP_KEY (SAVE hasilnya!)
php artisan key:generate --show

# 2. Run preparation script (Windows)
.\prepare-deploy.ps1

# 3. Push ke GitHub
git add .
git commit -m "Ready for Railway"
git push

# 4. Buka Railway.app → Deploy from GitHub
# 5. Add MySQL → Set Variables → Generate Domain
# 6. Run migrations dengan Railway CLI
```

**👉 Baca:** `QUICK-START-RAILWAY.md` untuk detail.

---

## 📁 Files Created

Semua file konfigurasi sudah dibuat otomatis:

### Konfigurasi:
- ✅ `Procfile` - Server start command
- ✅ `nixpacks.toml` - Build configuration
- ✅ `railway.json` - Project settings
- ✅ `.railwayignore` - Ignore files

### Dokumentasi:
- ✅ `QUICK-START-RAILWAY.md` - Quick guide (5 menit)
- ✅ `deploy-railway.md` - Complete guide
- ✅ `DEPLOYMENT-CHECKLIST.md` - Step-by-step checklist
- ✅ `RAILWAY-VISUAL-GUIDE.md` - Dashboard guide
- ✅ `RAILWAY-TROUBLESHOOTING.md` - Error solutions
- ✅ `RAILWAY-DEPLOYMENT-SUMMARY.md` - Overview

### Scripts:
- ✅ `prepare-deploy.sh` - Bash (Linux/Mac)
- ✅ `prepare-deploy.ps1` - PowerShell (Windows)

---

## 📖 Step-by-Step

### PHASE 1: Persiapan Lokal (10 menit)

#### 1. Generate APP_KEY
```bash
php artisan key:generate --show
```
**Output:** `base64:abc123...` ← **COPY & SAVE!**

#### 2. Build Production
```bash
# Install dependencies
composer install --optimize-autoloader --no-dev
npm ci

# Build assets
npm run build

# Test cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Clear for deployment
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

**Atau gunakan script:**
```powershell
.\prepare-deploy.ps1  # Windows
```

---

### PHASE 2: GitHub Setup (5 menit)

#### 1. Create Repository
- Buka: https://github.com/new
- Name: `CampusThrift`
- Public/Private (terserah)
- Jangan centang "Initialize with README"
- Create repository

#### 2. Push Code
```bash
git init
git add .
git commit -m "Ready for Railway deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/CampusThrift.git
git push -u origin main
```

---

### PHASE 3: Railway Deployment (15 menit)

#### 1. Login Railway
- Buka: https://railway.app
- Click "Login" → "Login with GitHub"
- Authorize Railway

#### 2. Create Project
- Click "+ New Project"
- "Deploy from GitHub repo"
- Select `CampusThrift`
- Click "Deploy Now"

#### 3. Add MySQL Database
- Click "+ New" → "Database" → "Add MySQL"
- Tunggu provisioning (~2 menit)

#### 4. Set Environment Variables
- Click service "CampusThrift"
- Tab "Variables" → "Raw Editor"
- Paste ini (GANTI values):

```env
APP_NAME=CampusThrift
APP_ENV=production
APP_KEY=base64:YOUR_KEY_FROM_STEP_1
APP_DEBUG=false
APP_URL=https://your-app.railway.app

DB_CONNECTION=mysql
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_DATABASE=${MYSQLDATABASE}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}

SESSION_DRIVER=database
QUEUE_CONNECTION=database
BROADCAST_DRIVER=pusher

PUSHER_APP_ID=your_pusher_id
PUSHER_APP_KEY=your_pusher_key
PUSHER_APP_SECRET=your_pusher_secret
PUSHER_APP_CLUSTER=mt1

VITE_PUSHER_APP_KEY=${PUSHER_APP_KEY}
VITE_PUSHER_APP_CLUSTER=${PUSHER_APP_CLUSTER}
```

- Click "Save" (akan redeploy)

#### 5. Generate Domain
- Tab "Settings" → "Networking"
- Click "Generate Domain"
- Copy domain (contoh: `campusthrift.up.railway.app`)
- Update `APP_URL` di Variables dengan domain ini
- Save (redeploy lagi)

---

### PHASE 4: Run Migrations (5 menit)

#### Install Railway CLI
```bash
npm install -g @railway/cli
```

#### Login & Link
```bash
railway login
railway link
```

#### Run Migrations
```bash
railway run php artisan migrate --force
railway run php artisan storage:link
```

Optional seed:
```bash
railway run php artisan db:seed --force
```

---

### PHASE 5: Verification (5 menit)

#### Test Website
1. Buka domain Railway di browser
2. Test homepage → Product catalog
3. Test register/login
4. Test upload product
5. Test chat
6. Test COD flow

#### Check Logs
```bash
railway logs
```

Cari error:
```bash
railway logs | grep -i error
```

---

## 🔧 Troubleshooting

### Quick Fixes:

#### Error 500?
```bash
railway run php artisan cache:clear
railway run php artisan config:clear
railway logs
```

#### Database error?
```bash
railway run php artisan tinker
>>> DB::connection()->getPdo();
```

#### Assets 404?
```bash
npm run build
git add .
git commit -m "Fix assets"
git push
```

#### Pusher tidak connect?
1. Check Pusher credentials di Variables
2. Rebuild: `npm run build && git push`
3. Check browser console

**👉 Baca:** `RAILWAY-TROUBLESHOOTING.md` untuk solusi lengkap.

---

## 🎯 Post-Deployment

### Immediate:
- [ ] Monitor logs untuk errors
- [ ] Test semua fitur
- [ ] Check usage di Railway dashboard

### Optional Enhancements:

#### 1. Custom Domain
```
Settings → Networking → Add Custom Domain
```

#### 2. File Storage (Cloudinary)
```bash
composer require cloudinary-labs/cloudinary-laravel

# Add to Railway Variables:
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

#### 3. Email Service
```bash
# Mailtrap (free dev testing)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=...
MAIL_PASSWORD=...
```

#### 4. Error Tracking (Sentry)
```bash
composer require sentry/sentry-laravel

# Add to Variables:
SENTRY_LARAVEL_DSN=...
```

---

## 💰 Railway Free Tier

**Monthly Credits:** $5 USD

**Limits:**
- 500 execution hours
- 100 GB bandwidth
- Unlimited projects

**Tips Hemat:**
- Enable "Sleep after 30 min idle"
- Optimize images (compress)
- Use CDN untuk static files
- Monitor usage regularly

**Check Usage:**
Railway Dashboard → Settings → Usage

---

## 📊 Monitoring

### Daily/Weekly:
```bash
# Check logs
railway logs | tail -100

# Check status
railway status

# Check database
railway run php artisan tinker
>>> DB::table('users')->count();
```

### Health Check:
```bash
curl https://your-app.railway.app/health
```

Add health endpoint:
```php
// routes/web.php
Route::get('/health', function() {
    return response()->json(['status' => 'ok']);
});
```

---

## ❓ FAQs

### Q: Berapa lama deployment pertama?
**A:** ~30-40 menit total (persiapan + deploy + migrate)

### Q: Apakah gratis selamanya?
**A:** Ya, dengan limit $5/bulan. Cukup untuk traffic rendah.

### Q: Bisa custom domain?
**A:** Ya! Settings → Networking → Add Custom Domain

### Q: File upload dimana?
**A:** Gunakan Cloudinary (free tier 25GB)

### Q: Bagaimana cara update code?
**A:** `git push` → Railway auto-deploy

### Q: Database bisa diakses dari luar?
**A:** Ya, tapi expose port dulu di Settings

### Q: Apakah bisa scale up?
**A:** Ya, upgrade ke paid plan untuk lebih resources

### Q: SSL/HTTPS otomatis?
**A:** Ya! Railway auto-provide SSL certificate

---

## 🆘 Need Help?

### Resources:
- 📖 **Complete Guide:** `deploy-railway.md`
- ⚡ **Quick Start:** `QUICK-START-RAILWAY.md`
- ✅ **Checklist:** `DEPLOYMENT-CHECKLIST.md`
- 🎨 **Visual Guide:** `RAILWAY-VISUAL-GUIDE.md`
- 🔧 **Troubleshooting:** `RAILWAY-TROUBLESHOOTING.md`

### Community:
- **Railway Discord:** https://discord.gg/railway
- **Railway Docs:** https://docs.railway.app
- **Railway Status:** https://status.railway.app

### Common Commands:
```bash
# View logs
railway logs
railway logs --follow

# Run commands
railway run php artisan [command]

# Check status
railway status

# Variables
railway variables
railway variables set KEY=VALUE

# Redeploy
railway up
```

---

## 🎉 Success Criteria

Deployment berhasil jika:
- ✅ Website accessible via Railway domain
- ✅ Login/Register works
- ✅ Database connected
- ✅ Images upload works
- ✅ Chat/Pusher connected
- ✅ No errors in logs
- ✅ All pages responsive

**Congratulations! Your app is LIVE! 🚀**

---

## 📝 Maintenance

### Weekly:
- Check logs untuk errors
- Monitor usage (jangan over limit)
- Test critical features
- Backup database (manual export)

### Monthly:
- Review usage stats
- Update dependencies jika perlu
- Check Railway status/updates

### On Update:
```bash
git add .
git commit -m "Your changes"
git push  # Auto-deploy!
```

---

## 🔗 Quick Links

| Resource | Link |
|----------|------|
| **Railway Dashboard** | https://railway.app |
| **Railway Docs** | https://docs.railway.app |
| **Railway Discord** | https://discord.gg/railway |
| **Pusher Dashboard** | https://pusher.com |
| **GitHub Repo** | https://github.com/YOUR_USERNAME/CampusThrift |
| **Live App** | https://your-app.railway.app |

---

## 🌟 Tips for Success

1. **Always check logs first** when debugging
2. **Save your APP_KEY** somewhere safe
3. **Monitor usage** to avoid surprises
4. **Enable sleep mode** untuk hemat credit
5. **Use Cloudinary** untuk file storage
6. **Test locally** before push
7. **Read error messages** carefully
8. **Join Railway Discord** untuk bantuan cepat

---

**Happy Deploying! 🚂💨**

*Last updated: January 16, 2025*

---

## 📞 Support

Ada pertanyaan atau issue?
1. Check `RAILWAY-TROUBLESHOOTING.md`
2. Search Railway Discord
3. Ask di Railway Community

**Good luck with your deployment!** 🎉🚀

