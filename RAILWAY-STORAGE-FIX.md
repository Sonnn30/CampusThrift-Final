# 🗂️ Fix Image Upload di Railway (404 Not Found)

## 🔍 Problem
- Image product tidak bisa ditampilkan (404 error)
- URL: `https://campusthrift-final-production.up.railway.app/storage/products/image.jpg`
- Root cause: **Railway filesystem is ephemeral** → uploaded files hilang setelah redeploy

## ✅ Solution: Railway Volume (Persistent Storage)

### Step 1: Create Railway Volume

1. **Buka Railway Dashboard**
   - Go to: https://railway.app/
   - Pilih project `daring-consideration` (atau nama project Anda)
   - Anda akan melihat tampilan canvas dengan service `CampusThrift-Final` dan `MySQL`

2. **Add Volume via Settings**
   - **KLIK** service `CampusThrift-Final` di canvas
   - Di panel kanan, klik tab **"Settings"** (icon gear ⚙️)
   - Scroll ke bawah sampai menemukan section **"Volumes"**
   - Klik button **"+ Add Volume"** atau **"New Volume"**

3. **Configure Volume**
   - **Mount Path**: `/app/storage/app/public`
   - Klik **"Add"** atau **"Save"**
   
4. **ATAU via Service Menu** (Alternative):
   - Klik **3 dots (•••)** di pojok kanan atas service card
   - Pilih **"Add Volume"**
   - Set **Mount Path**: `/app/storage/app/public`
   - Klik **"Add"**

5. **Redeploy**
   - Railway akan otomatis redeploy service Anda
   - Wait sampai deployment selesai (lihat di "Deployments" tab)

### Step 2: Update `nixpacks.toml`

Tambahkan storage:link command ke `[start]`:

```toml
[start]
cmd = 'php artisan storage:link && php artisan serve --host=0.0.0.0 --port=$PORT'
```

### Step 3: Push & Deploy

```bash
git add nixpacks.toml
git commit -m "Add storage:link to Railway start command"
git push origin main
```

---

## 🎯 Alternative: Cloudinary (Cloud Storage)

Jika Railway Volume masih bermasalah, gunakan **Cloudinary** (gratis 25GB):

### Step 1: Install Cloudinary Package

```bash
composer require cloudinary-labs/cloudinary-laravel
```

### Step 2: Update `.env` di Railway

Add these variables:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

### Step 3: Update `config/filesystems.php`

```php
'cloudinary' => [
    'driver' => 'cloudinary',
    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
    'api_key' => env('CLOUDINARY_API_KEY'),
    'api_secret' => env('CLOUDINARY_API_SECRET'),
    'url' => [
        'secure' => true
    ],
],
```

### Step 4: Update ProductController

Change line 149:
```php
// Before
->toDisk('public')

// After
->toDisk('cloudinary')
```

---

## ⚠️ Important Notes

1. **Railway Volume** = File persisten, tapi limited size
2. **Cloudinary** = Unlimited (25GB free), tapi butuh setup
3. **Local Development** tetap pakai `storage/app/public` seperti biasa
4. Images yang sudah ada di local **tidak otomatis masuk Railway** - perlu re-upload

---

## 🧪 Testing

Setelah setup:

1. Upload product baru di Railway production
2. Check apakah image muncul di Product Detail
3. Redeploy service → Check apakah image masih ada

---

## 🆘 Troubleshooting

### Volume tidak work?
```bash
# SSH ke Railway container (via Railway CLI)
railway run bash

# Check volume mounted
ls -la /app/storage/app/public

# Check symlink
ls -la /app/public/storage
```

### Image masih 404?
- Clear config cache: `railway run php artisan config:clear`
- Re-create symlink: `railway run php artisan storage:link --force`
- Check filesystem permissions di Railway

---

✅ **Recommended**: Gunakan **Railway Volume** dulu, kalau masih bermasalah baru pakai **Cloudinary**.

