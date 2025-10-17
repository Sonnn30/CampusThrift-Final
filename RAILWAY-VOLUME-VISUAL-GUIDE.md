# 📸 Visual Guide: Add Volume di Railway

## 🎯 **Cara Menemukan Volume Settings**

### **Method 1: Via Settings Tab** ⭐ (Recommended)

```
Step-by-Step:

1. Buka https://railway.app/
2. Pilih project: "daring-consideration"
3. Anda akan lihat tampilan canvas seperti ini:

   ┌─────────────────────────────────────────────┐
   │                                             │
   │    ╔═══════════════════╗                   │
   │    ║ CampusThrift-     ║                   │
   │    ║ Final             ║                   │
   │    ║                   ║                   │
   │    ╚═══════════════════╝                   │
   │                                             │
   │    ╔═══════════════════╗                   │
   │    ║ MySQL             ║                   │
   │    ║                   ║                   │
   │    ╚═══════════════════╝                   │
   │                                             │
   └─────────────────────────────────────────────┘

4. KLIK pada card "CampusThrift-Final"

5. Panel kanan akan muncul dengan tabs:
   ┌─────────────────────────────────────┐
   │ [Deployments] [Settings] [Metrics]  │  ← KLIK "Settings" tab
   └─────────────────────────────────────┘

6. Scroll ke bawah di Settings sampai menemukan:

   ╔═══════════════════════════════════════╗
   ║ 🗂️ Volumes                            ║
   ║                                       ║
   ║ Add persistent storage to your        ║
   ║ service                               ║
   ║                                       ║
   ║ [+ New Volume]  ← KLIK INI           ║
   ╚═══════════════════════════════════════╝

7. Modal akan muncul:
   ╔═══════════════════════════════════════╗
   ║ Add Volume                            ║
   ║                                       ║
   ║ Mount Path: [________________]       ║
   ║             ↑ ISI INI                ║
   ║                                       ║
   ║         [Cancel]  [Add]              ║
   ╚═══════════════════════════════════════╝

8. ISI Mount Path dengan:
   /app/storage/app/public

9. Klik "Add"

✅ DONE! Railway akan auto-redeploy.
```

---

### **Method 2: Via Service Menu** (Alternative)

```
1. Di canvas, HOVER mouse ke card "CampusThrift-Final"

2. Di pojok kanan atas card, klik icon "•••" (3 dots)

   ╔═══════════════════════════════╗
   │ CampusThrift-Final        [•••] ← KLIK INI
   │                               │
   │ PHP • Active                  │
   ╚═══════════════════════════════╝

3. Dropdown menu akan muncul:
   ┌──────────────────────┐
   │ Open in New Tab      │
   │ View Logs            │
   │ View Deployments     │
   │ View Settings        │
   │ Add Volume          │ ← KLIK INI
   │ Delete Service       │
   └──────────────────────┘

4. Modal "Add Volume" akan muncul → Lanjut ke step 7-9 di Method 1
```

---

## 🔍 **Kalau Masih Tidak Ketemu?**

### **Screenshot Lokasi Volume:**

Railway memiliki 2 lokasi Volume settings:

**A. Service-Level Volume (Yang kita butuhkan):**
```
Project → Service → Settings → Scroll Down → "Volumes" section
```

**B. Project-Level Storage:**
```
Jika Anda melihat tab "Data" atau "Storage" di level project,
itu bukan yang kita cari. Kita butuh "Volume" di service level.
```

---

## 📝 **Mount Path Explanation**

```
Mount Path: /app/storage/app/public
            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            |
            └─> Di Railway, root folder project ada di "/app"
                Jadi Laravel storage structure menjadi:
                
                /app/storage/app/public  ← Upload folder (persistent)
                /app/public/storage      ← Symlink target
```

**Why this path?**
- Laravel menyimpan upload di: `storage/app/public/`
- Anda pakai Laravel Mediable yang store ke: `storage/app/public/products/`
- Railway Volume akan membuat folder ini **persistent** (tidak hilang saat redeploy)

---

## ⚠️ **Important Notes**

1. **Volume Size**: Railway free tier = **1GB gratis** per volume
2. **Billing**: Volume dikenakan biaya setelah 1GB
3. **Alternative**: Jika tidak mau pakai Volume, gunakan **Cloudinary** (lihat `RAILWAY-STORAGE-FIX.md`)

---

## 🧪 **Verify Volume Berhasil**

Setelah add volume & redeploy:

1. **Check di Settings Tab**:
   - Kembali ke Settings → Volumes
   - Anda akan lihat volume yang sudah dibuat:
   ```
   ╔═══════════════════════════════════════╗
   ║ 🗂️ Volumes                            ║
   ║                                       ║
   ║ Mount Path: /app/storage/app/public   ║
   ║ Size: 1GB                             ║
   ║ [Remove]                              ║
   ╚═══════════════════════════════════════╝
   ```

2. **Test Upload Product**:
   - Login ke website Railway Anda
   - Upload product baru dengan gambar
   - Check apakah gambar muncul di Product Detail
   - **Redeploy** service → Check apakah gambar **masih ada**

---

## 🆘 **Still Can't Find Volume?**

Kemungkinan:
1. **Railway UI berubah** - Railway sering update UI mereka
2. **Free tier limitation** - Check apakah akun Anda masih free tier
3. **Region issue** - Beberapa region mungkin belum support Volume

**Solution**: Pakai **Cloudinary** sebagai gantinya (lihat `RAILWAY-STORAGE-FIX.md` section "Alternative: Cloudinary")

---

✅ **Quick Recap:**

```bash
1. Railway Dashboard → Project "daring-consideration"
2. Klik service "CampusThrift-Final"
3. Tab "Settings" → Scroll ke "Volumes"
4. "+ New Volume" → Mount Path: /app/storage/app/public
5. Add → Wait for redeploy
6. Test upload image
```

🎉 **DONE!**

