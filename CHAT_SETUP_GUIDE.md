# 🚀 Panduan Setup Chat System - CampusThrift

## ✅ Yang Sudah Dikerjakan

Sistem chat telah berhasil diupgrade dengan fitur-fitur berikut:

### 1. **Database & Models**
- ✅ Tabel `conversations` untuk menyimpan percakapan antara 2 user
- ✅ Tabel `messages` untuk menyimpan pesan dalam conversation
- ✅ Model `Conversation` dan `Message` dengan relasi lengkap
- ✅ Migration sudah dijalankan

### 2. **Backend (Laravel)**
- ✅ `ChatController` dengan method:
  - `show($recipientId)` - Menampilkan chat dengan user tertentu
  - `message(Request)` - Mengirim pesan
  - `getMessages($conversationId)` - Mengambil history pesan
- ✅ Event `Message` yang broadcast ke channel `chat.{conversation_id}`
- ✅ Routes di `web.php` dan `api.php` sudah diupdate

### 3. **Frontend (React/TypeScript)**
- ✅ `chat.tsx` diupdate untuk:
  - Menerima data recipient (user tujuan)
  - Subscribe ke channel Pusher spesifik per conversation
  - Menampilkan nama user tujuan di header
  - Mengirim pesan dengan conversation_id
- ✅ Tombol chat di berbagai halaman sudah diupdate dengan recipient ID:
  - `ProductCard_ProductGrid.tsx` - Chat dengan seller dari product
  - `ProductDetail.tsx` - Tombol chat tambahan untuk buyer
  - `SellerProductPageNavbar.tsx` - Chat dengan seller
  - `TransactionDetail.tsx` - Chat dengan buyer/seller dari transaksi

### 4. **Product Data**
- ✅ Semua controller product sudah include `user_id` dan `seller_id`:
  - `ProductController` (index, show)
  - `AuthManager` (UserDashboard)
  - `TransactionDetailController` (untuk buyer_id dan seller_id)

---

## 🔧 Langkah-langkah Setup

### **Step 1: Konfigurasi Pusher di `.env`**

Buka file `.env` di root project dan tambahkan/update baris berikut:

```env
BROADCAST_DRIVER=pusher

PUSHER_APP_ID=your_app_id_here
PUSHER_APP_KEY=6ace5906628421242d73
PUSHER_APP_SECRET=your_app_secret_here
PUSHER_APP_CLUSTER=ap1
```

**Cara mendapatkan credentials Pusher:**
1. Login ke [Pusher Dashboard](https://dashboard.pusher.com)
2. Pilih aplikasi Anda atau buat baru
3. Klik tab **"App Keys"**
4. Copy:
   - `app_id` → `PUSHER_APP_ID`
   - `key` → `PUSHER_APP_KEY` (sudah ada di code)
   - `secret` → `PUSHER_APP_SECRET`
   - `cluster` → `PUSHER_APP_CLUSTER` (ap1)

### **Step 2: Clear Cache Laravel**

Setelah update `.env`, jalankan:

```bash
php artisan config:clear
php artisan cache:clear
```

### **Step 3: Restart Development Server**

Restart Laravel dan frontend server:

```bash
# Terminal 1 - Laravel
php artisan serve

# Terminal 2 - Frontend (jika pakai Vite/npm)
npm run dev
```

---

## 📝 Cara Menggunakan Chat

### **Untuk Buyer:**

1. **Dari Product Catalog:**
   - Klik icon chat di product card → otomatis chat dengan seller product tersebut

2. **Dari Product Detail:**
   - Klik tombol chat di samping "Make Appointment" → chat dengan seller

3. **Dari Transaction Detail:**
   - Klik tombol "Chat" → chat dengan seller dari transaksi tersebut

### **Untuk Seller:**

1. **Dari Transaction Detail:**
   - Klik tombol "Chat" → chat dengan buyer dari transaksi tersebut

---

## 🔍 Cara Kerja Sistem

1. **URL Chat:** `/{role}/chat/{recipientId}`
   - Contoh: `/Buyer/chat/5` (buyer chat dengan user ID 5)
   - Contoh: `/Seller/chat/3` (seller chat dengan user ID 3)

2. **Conversation Otomatis:**
   - Sistem otomatis membuat conversation antara 2 user
   - Tidak ada duplikat conversation (1 conversation untuk 2 user)

3. **Real-time Messaging:**
   - Pusher broadcast ke channel `chat.{conversation_id}`
   - Hanya user yang terlibat dalam conversation yang menerima message

4. **Data yang Ditampilkan:**
   - Header: Nama user tujuan
   - Messages: Dari siapa (me/other), isi pesan, waktu

---

## 🐛 Troubleshooting

### **Chat tidak terkoneksi / Pusher error:**

1. **Cek Browser Console (F12):**
   - Lihat apakah ada error dari Pusher
   - Pastikan `Pusher.logToConsole = true` untuk debugging

2. **Cek Pusher Dashboard:**
   - Buka [Pusher Debug Console](https://dashboard.pusher.com)
   - Lihat apakah events terkirim saat Anda send message

3. **Cek Laravel Log:**
   - Buka `storage/logs/laravel.log`
   - Lihat apakah ada error saat broadcast

4. **Common Issues:**
   - ❌ `BROADCAST_DRIVER=null` → Harus `pusher`
   - ❌ `PUSHER_APP_SECRET` kosong → Harus diisi
   - ❌ Config cache belum di-clear → Jalankan `php artisan config:clear`

### **Message tidak muncul:**

1. Cek apakah `conversation_id` terkirim saat submit
2. Cek apakah Pusher channel subscription berhasil di console
3. Pastikan kedua user subscribe ke channel yang sama

### **Error 403 Unauthorized:**

- Pastikan user sudah login
- Cek apakah user memiliki akses ke conversation tersebut

---

## 🎯 Testing

### **Test Manual:**

1. **Login sebagai Buyer** (Browser 1)
2. **Login sebagai Seller** (Browser 2 / Incognito)
3. **Buyer:** Buka product detail, klik chat
4. **Kirim pesan dari Buyer**
5. **Cek apakah Seller menerima pesan secara real-time**
6. **Balas dari Seller**
7. **Cek apakah Buyer menerima balasan**

### **Test dari Dashboard Pusher:**

1. Buka Pusher Dashboard → Debug Console
2. Kirim test event:
   - Channel: `chat.1` (sesuaikan dengan conversation_id)
   - Event: `message`
   - Data:
     ```json
     {
       "id": 999,
       "conversation_id": 1,
       "message": "Test message from Pusher",
       "sender_name": "Test User",
       "sender_id": 1
     }
     ```
3. Cek apakah message muncul di chat UI

---

## 📦 File-file yang Diubah

### Backend:
- `database/migrations/*_create_conversations_table.php`
- `database/migrations/*_create_messages_table.php`
- `app/Models/Conversation.php` ✨ New
- `app/Models/Message.php` ✨ New
- `app/Http/Controllers/ChatController.php` 🔄 Major update
- `app/Events/Message.php` 🔄 Updated
- `routes/web.php` 🔄 Updated
- `routes/api.php` 🔄 Updated
- `app/Http/Controllers/TransactionDetailController.php` 🔄 Updated
- `app/Http/Controllers/ProductController.php` 🔄 Updated
- `app/Http/Controllers/AuthManager.php` 🔄 Updated

### Frontend:
- `resources/js/pages/chat.tsx` 🔄 Major update
- `resources/js/pages/ProductCard_ProductGrid.tsx` 🔄 Updated
- `resources/js/pages/ProductDetail.tsx` 🔄 Updated
- `resources/js/pages/SellerProductPageNavbar.tsx` 🔄 Updated
- `resources/js/pages/TransactionDetail.tsx` 🔄 Updated

---

## 🎉 Selesai!

Sistem chat Anda sekarang sudah:
- ✅ Terkoneksi per user (buyer ↔ seller)
- ✅ Real-time dengan Pusher
- ✅ Menampilkan nama user tujuan
- ✅ Menyimpan history chat di database
- ✅ Terintegrasi dengan product dan transaction

**Selamat menggunakan! 🚀**

---

## 📞 Need Help?

Jika masih ada masalah, cek:
1. Browser Console (F12) untuk error JavaScript
2. Laravel Log (`storage/logs/laravel.log`)
3. Pusher Dashboard Debug Console
4. Network tab (F12) untuk melihat API requests

**Happy Coding! 💻✨**

