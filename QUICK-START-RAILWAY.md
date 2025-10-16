# 🚀 Quick Start - Deploy ke Railway (5 Menit!)

## ⚡ SUPER CEPAT (Copy-Paste)

### 1️⃣ Generate APP_KEY (SIMPAN HASILNYA!)
```bash
php artisan key:generate --show
```
**Output:** `base64:abc123xyz...` ← **COPY INI!**

---

### 2️⃣ Jalankan Persiapan (Windows)
```powershell
.\prepare-deploy.ps1
```

**Atau manual:**
```bash
composer install --optimize-autoloader --no-dev
npm ci
npm run build
```

---

### 3️⃣ Push ke GitHub
```bash
# Buat repo di GitHub dulu: https://github.com/new
# Nama: CampusThrift

# Lalu jalankan:
git init
git add .
git commit -m "Ready for Railway"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/CampusThrift.git
git push -u origin main
```

---

### 4️⃣ Deploy di Railway

**A. Create Project:**
1. https://railway.app → Login with GitHub
2. "New Project" → "Deploy from GitHub repo"
3. Pilih `CampusThrift`

**B. Add Database:**
1. Klik "+ New" → "Database" → "Add MySQL"

**C. Set Variables:**
1. Klik service "CampusThrift"
2. Tab "Variables" → "Raw Editor"
3. Paste ini (GANTI `APP_KEY` dan `PUSHER_*`):

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

PUSHER_APP_ID=your_id
PUSHER_APP_KEY=your_key
PUSHER_APP_SECRET=your_secret
PUSHER_APP_CLUSTER=mt1

VITE_PUSHER_APP_KEY=${PUSHER_APP_KEY}
VITE_PUSHER_APP_CLUSTER=${PUSHER_APP_CLUSTER}
```

**D. Generate Domain:**
1. Tab "Settings" → "Networking"
2. "Generate Domain"
3. Copy domain (contoh: `campusthrift.up.railway.app`)
4. Update `APP_URL` di Variables dengan domain ini
5. Save (auto-redeploy)

---

### 5️⃣ Run Migrations

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login & link
railway login
railway link

# Run migrations
railway run php artisan migrate --force
railway run php artisan storage:link
```

---

## ✅ DONE! 

Buka domain Railway Anda di browser! 🎉

---

## 🐛 Troubleshooting Cepat

**Error 500?**
```bash
railway logs
railway run php artisan cache:clear
```

**Database error?**
```bash
railway run php artisan tinker
>>> DB::connection()->getPdo();
```

**Assets 404?**
```bash
npm run build
git add .
git commit -m "Fix assets"
git push
```

---

## 📚 Docs Lengkap

Baca `deploy-railway.md` untuk penjelasan detail.

---

## 💡 Tips

1. **Free Tier:** $5/bulan (cukup untuk project kecil)
2. **Sleep Mode:** Enable di Settings untuk hemat
3. **Logs:** `railway logs --follow` untuk real-time
4. **Redeploy:** Just `git push`!

---

**Happy Deploying! 🚂🚀**

