# ✅ Railway Deployment Checklist

## Pre-Deployment (Lokal)

- [ ] File konfigurasi sudah dibuat:
  - [ ] `Procfile`
  - [ ] `nixpacks.toml`
  - [ ] `railway.json`
  - [ ] `.railwayignore`

- [ ] Generate APP_KEY:
  ```bash
  php artisan key:generate --show
  ```
  **Hasil:** `_________________________________` ← TULIS DI SINI!

- [ ] Install dependencies production:
  ```bash
  composer install --optimize-autoloader --no-dev
  npm ci
  npm run build
  ```

- [ ] Test production config:
  ```bash
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
  ```

- [ ] Clear cache:
  ```bash
  php artisan config:clear
  php artisan route:clear
  php artisan view:clear
  ```

---

## GitHub Setup

- [ ] Buat repository di GitHub:
  - URL: `https://github.com/____________________/CampusThrift`

- [ ] Push code ke GitHub:
  ```bash
  git init
  git add .
  git commit -m "Ready for Railway deployment"
  git branch -M main
  git remote add origin https://github.com/YOUR_USERNAME/CampusThrift.git
  git push -u origin main
  ```

---

## Railway Setup

### 1. Account & Project
- [ ] Daftar/Login di https://railway.app
- [ ] Create New Project
- [ ] Deploy from GitHub repo → pilih `CampusThrift`

### 2. Database
- [ ] Add MySQL database:
  - Klik "+ New" → "Database" → "Add MySQL"
  - Tunggu provisioning selesai

### 3. Environment Variables
- [ ] Set variables di service CampusThrift:
  - [ ] `APP_NAME=CampusThrift`
  - [ ] `APP_ENV=production`
  - [ ] `APP_KEY=base64:...` ← dari step generate APP_KEY
  - [ ] `APP_DEBUG=false`
  - [ ] `APP_URL=https://your-app.railway.app` ← update setelah generate domain
  - [ ] `DB_CONNECTION=mysql`
  - [ ] `DB_HOST=${MYSQLHOST}`
  - [ ] `DB_PORT=${MYSQLPORT}`
  - [ ] `DB_DATABASE=${MYSQLDATABASE}`
  - [ ] `DB_USERNAME=${MYSQLUSER}`
  - [ ] `DB_PASSWORD=${MYSQLPASSWORD}`
  - [ ] `SESSION_DRIVER=database`
  - [ ] `QUEUE_CONNECTION=database`
  - [ ] `BROADCAST_DRIVER=pusher`
  - [ ] `PUSHER_APP_ID=___________`
  - [ ] `PUSHER_APP_KEY=___________`
  - [ ] `PUSHER_APP_SECRET=___________`
  - [ ] `PUSHER_APP_CLUSTER=mt1`
  - [ ] `VITE_PUSHER_APP_KEY=${PUSHER_APP_KEY}`
  - [ ] `VITE_PUSHER_APP_CLUSTER=${PUSHER_APP_CLUSTER}`

### 4. Domain
- [ ] Generate domain di Settings → Networking
- [ ] Copy domain: `_________________________________`
- [ ] Update `APP_URL` dengan domain ini
- [ ] Tunggu redeploy selesai

---

## Railway CLI Setup

- [ ] Install Railway CLI:
  ```bash
  npm install -g @railway/cli
  ```

- [ ] Login:
  ```bash
  railway login
  ```

- [ ] Link project:
  ```bash
  railway link
  ```

- [ ] Run migrations:
  ```bash
  railway run php artisan migrate --force
  railway run php artisan storage:link
  ```

---

## Testing

- [ ] Buka domain Railway di browser
- [ ] Test halaman utama (ProductCatalog)
- [ ] Test Login
- [ ] Test Register
- [ ] Test Upload Product (Seller)
- [ ] Test Chat/Messaging
- [ ] Test COD Appointment Flow
- [ ] Test Profile page
- [ ] Test MySchedule

---

## Troubleshooting

Jika ada error:

```bash
# Check logs
railway logs

# Clear cache
railway run php artisan cache:clear
railway run php artisan config:clear

# Verify database connection
railway run php artisan tinker
>>> DB::connection()->getPdo();
>>> exit
```

---

## Post-Deployment (Optional)

- [ ] Setup Custom Domain
- [ ] Setup Cloudinary untuk image storage
- [ ] Setup Email service (Mailtrap/SendGrid)
- [ ] Enable monitoring/analytics
- [ ] Setup backup strategy

---

## 📊 Railway Free Tier Monitor

**Monthly Limits:**
- Credit: $5 USD
- Execution hours: 500 hours
- Bandwidth: 100 GB

**Current Usage:** Check di Railway dashboard

**Tips:**
- Enable "Sleep on idle" untuk hemat credit
- Monitor usage di Settings → Usage

---

## 🆘 Need Help?

1. Check logs: `railway logs`
2. Railway Docs: https://docs.railway.app
3. Railway Discord: https://discord.gg/railway
4. Baca `deploy-railway.md` untuk detail lengkap

---

**Deployment Date:** _______________
**Domain:** _______________
**Status:** [ ] Success / [ ] Failed / [ ] In Progress

