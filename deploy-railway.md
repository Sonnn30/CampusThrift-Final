# 🚂 Deploy CampusThrift ke Railway.app

## 📋 Langkah-Langkah Deployment

### STEP 1: Persiapan Project (Sudah Selesai ✅)
File konfigurasi sudah dibuat:
- ✅ Procfile
- ✅ nixpacks.toml
- ✅ railway.json
- ✅ .railwayignore

---

### STEP 2: Generate APP_KEY

Jalankan command ini dan **COPY hasilnya**:

```bash
php artisan key:generate --show
```

**Output akan seperti:** `base64:abc123...xyz`
**SIMPAN INI!** Akan digunakan di Railway nanti.

---

### STEP 3: Optimasi untuk Production

```bash
# Install dependencies production
composer install --optimize-autoloader --no-dev

# Build frontend assets
npm run build

# Test production config
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Clear cache setelah test
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

---

### STEP 4: Push ke GitHub

```bash
# Initialize git (jika belum)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for Railway deployment"

# Rename branch to main (jika masih master)
git branch -M main

# Add remote (GANTI dengan URL repo Anda)
git remote add origin https://github.com/YOUR_USERNAME/CampusThrift.git

# Push
git push -u origin main
```

**Jika belum punya GitHub repository:**
1. Buka https://github.com
2. Klik "New repository"
3. Nama: `CampusThrift`
4. Public/Private (terserah)
5. Jangan centang "Initialize with README"
6. Create repository
7. Copy URL yang diberikan
8. Jalankan commands di atas dengan URL tersebut

---

### STEP 5: Deploy di Railway

#### A. Daftar/Login Railway
1. Buka https://railway.app
2. Klik "Login" (bisa pakai GitHub account)
3. Authorize Railway untuk akses GitHub

#### B. Create New Project
1. Klik "New Project"
2. Pilih "Deploy from GitHub repo"
3. Pilih repository `CampusThrift`
4. Railway akan otomatis detect dan mulai deploy

#### C. Add MySQL Database
1. Di project dashboard, klik "+ New"
2. Pilih "Database"
3. Pilih "Add MySQL"
4. Tunggu MySQL provisioning selesai

#### D. Set Environment Variables
1. Klik service "CampusThrift" (yang pertama)
2. Klik tab "Variables"
3. Klik "Raw Editor"
4. Paste ini (GANTI nilai-nilai yang perlu):

```env
APP_NAME=CampusThrift
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_FROM_STEP_2
APP_DEBUG=false
APP_URL=https://your-app.railway.app

DB_CONNECTION=mysql
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_DATABASE=${MYSQLDATABASE}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}

BROADCAST_DRIVER=pusher
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
SESSION_DRIVER=database
SESSION_LIFETIME=120

PUSHER_APP_ID=your_pusher_app_id
PUSHER_APP_KEY=your_pusher_key
PUSHER_APP_SECRET=your_pusher_secret
PUSHER_APP_CLUSTER=mt1

VITE_PUSHER_APP_KEY=${PUSHER_APP_KEY}
VITE_PUSHER_APP_CLUSTER=${PUSHER_APP_CLUSTER}
```

5. Klik "Save"
6. Railway akan auto-redeploy

#### E. Generate Public Domain
1. Klik tab "Settings"
2. Scroll ke "Networking"
3. Klik "Generate Domain"
4. Copy domain yang diberikan (contoh: `campusthrift-production.up.railway.app`)
5. Update `APP_URL` di Variables dengan domain ini
6. Save (akan auto-redeploy lagi)

---

### STEP 6: Run Database Migrations

#### Install Railway CLI (Windows):
```bash
# Via NPM
npm install -g @railway/cli
```

Atau download dari: https://docs.railway.app/develop/cli

#### Login dan Link Project:
```bash
# Login ke Railway
railway login

# Link ke project
railway link

# Select your project "CampusThrift"
```

#### Run Migrations:
```bash
# Run migrations
railway run php artisan migrate --force

# Create storage link
railway run php artisan storage:link

# Optional: Seed database
railway run php artisan db:seed --force
```

---

### STEP 7: Verifikasi Deployment

1. Buka domain Railway Anda di browser
2. Test login/register
3. Test upload gambar
4. Test chat (Pusher)
5. Check logs jika ada error:
   ```bash
   railway logs
   ```

---

## 🔧 TROUBLESHOOTING

### Error 1: "500 Internal Server Error"
```bash
# Check logs
railway logs

# Clear cache
railway run php artisan cache:clear
railway run php artisan config:clear
railway run php artisan view:clear

# Verify APP_KEY is set
railway variables
```

### Error 2: "Database connection failed"
```bash
# Verify database variables
railway run php artisan tinker
>>> DB::connection()->getPdo();
>>> exit

# Check if MySQL service is running
# Di Railway dashboard, cek status MySQL service
```

### Error 3: "Assets not loading (404)"
```bash
# Rebuild assets
npm run build
git add public/build
git commit -m "Add built assets"
git push

# Or set in .gitignore to NOT ignore build folder
```

### Error 4: "Pusher not working"
- Verify Pusher credentials di Variables
- Check VITE_PUSHER_* variables
- Rebuild frontend: `npm run build`

---

## 📊 Monitoring & Maintenance

### View Logs:
```bash
railway logs
railway logs --follow  # Real-time
```

### Check Service Status:
```bash
railway status
```

### Update Environment Variables:
```bash
railway variables set KEY=VALUE
```

### Redeploy:
```bash
# Push any changes
git add .
git commit -m "Update"
git push

# Manual redeploy
railway up
```

### Access Database:
```bash
railway run php artisan tinker
```

---

## 💰 Railway Free Tier Limits

- **$5 USD credit per month**
- **500 execution hours per month**
- **100 GB outbound bandwidth**

**Tips menghemat credit:**
- Set "Sleep on idle" di Settings
- Optimize image sizes
- Use CDN untuk static assets (optional)

---

## 🎯 Next Steps (Optional)

### 1. Custom Domain:
1. Di Railway Settings → Networking
2. Add Custom Domain
3. Update DNS records di domain provider

### 2. Setup File Storage (Cloudinary):
```bash
composer require cloudinary-labs/cloudinary-laravel

# Update .env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Enable HTTPS (Auto by Railway):
Railway automatically provides SSL certificate

### 4. Setup Email (Mailtrap/SendGrid):
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
```

---

## 📞 Support

**Railway Docs:** https://docs.railway.app
**Community:** https://discord.gg/railway

**Error di deployment? Share screenshot logs!**

