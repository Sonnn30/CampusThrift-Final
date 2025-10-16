# 🎨 Railway Dashboard Visual Guide

## 📍 Langkah-Langkah dengan Screenshot Guide

---

## STEP 1: Login & Create Project

### A. Homepage Railway
```
┌──────────────────────────────────────────┐
│  🚂 Railway                    [Login]   │
│                                           │
│      Deploy from GitHub                  │
│      Start from a template               │
│      Start from scratch                  │
└──────────────────────────────────────────┘
```

**Actions:**
1. Klik "Login" (pojok kanan atas)
2. Login with GitHub (recommended)
3. Authorize Railway

---

## STEP 2: New Project

### B. Dashboard View
```
┌──────────────────────────────────────────┐
│  Dashboard    [+ New Project]            │
│                                           │
│  Your Projects:                          │
│  (empty)                                 │
└──────────────────────────────────────────┘
```

**Actions:**
1. Klik "+ New Project"
2. Pilih "Deploy from GitHub repo"
3. Authorize Railway untuk akses GitHub repos
4. Cari dan pilih "CampusThrift"
5. Klik "Deploy Now"

---

## STEP 3: Project Dashboard

### C. Project View (After Deploy)
```
┌────────────────────────────────────────────────┐
│  CampusThrift                     [+ New]      │
│                                                 │
│  Services:                                     │
│  ┌─────────────────┐                          │
│  │ CampusThrift    │  🟢 Active               │
│  │ main branch     │  Deploying...            │
│  └─────────────────┘                          │
│                                                 │
│  Recent Deployments:                           │
│  - Initial commit (deploying...)              │
└────────────────────────────────────────────────┘
```

**What you see:**
- ✅ Service "CampusThrift" terlihat
- 🟡 Status: Deploying (tunggu 5-10 menit)
- 📝 Logs akan muncul di panel bawah

---

## STEP 4: Add MySQL Database

### D. Add Service Button
```
┌────────────────────────────────────────────────┐
│  CampusThrift                     [+ New]  ←── │
│                                                 │
│  Click "+ New" button:                         │
│  ┌──────────────────┐                         │
│  │ Database         │ ← Select this           │
│  │ Empty Service    │                         │
│  │ GitHub Repo      │                         │
│  └──────────────────┘                         │
└────────────────────────────────────────────────┘
```

**Actions:**
1. Klik "+ New" (pojok kanan atas)
2. Pilih "Database"
3. Pilih "Add MySQL"
4. Tunggu provisioning (2-3 menit)

### E. After MySQL Added
```
┌────────────────────────────────────────────────┐
│  CampusThrift                     [+ New]      │
│                                                 │
│  Services:                                     │
│  ┌─────────────────┐  ┌──────────────────┐   │
│  │ CampusThrift    │  │ MySQL            │   │
│  │ 🟢 Active       │  │ 🟢 Active        │   │
│  └─────────────────┘  └──────────────────┘   │
└────────────────────────────────────────────────┘
```

---

## STEP 5: Configure Environment Variables

### F. Service Settings
```
┌────────────────────────────────────────────────┐
│  CampusThrift                                  │
│  ┌─────────────────────────────────────────┐  │
│  │ Deployments  Variables  Settings        │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
│  Click "Variables" tab ↑                       │
└────────────────────────────────────────────────┘
```

**Actions:**
1. Klik service "CampusThrift"
2. Klik tab "Variables"
3. Klik "Raw Editor" (pojok kanan atas)

### G. Variables Editor
```
┌────────────────────────────────────────────────┐
│  Variables                    [Raw Editor]     │
│  ┌──────────────────────────────────────────┐ │
│  │ APP_NAME=CampusThrift                    │ │
│  │ APP_ENV=production                       │ │
│  │ APP_KEY=base64:...                       │ │
│  │ APP_DEBUG=false                          │ │
│  │ APP_URL=https://...                      │ │
│  │ ...                                      │ │
│  │ (paste all variables here)              │ │
│  └──────────────────────────────────────────┘ │
│  [Cancel]                      [Save]          │
└────────────────────────────────────────────────┘
```

**Actions:**
1. Paste semua environment variables
2. Klik "Save"
3. Railway akan auto-redeploy

---

## STEP 6: Generate Domain

### H. Settings Tab
```
┌────────────────────────────────────────────────┐
│  Settings                                      │
│                                                 │
│  General                                       │
│  ┌──────────────────────────────────────────┐ │
│  │ Service Name: CampusThrift               │ │
│  │ Start Command: php artisan serve...     │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  Networking                                    │
│  ┌──────────────────────────────────────────┐ │
│  │ Public Networking                        │ │
│  │ [Generate Domain]  ← Click this         │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

**Actions:**
1. Klik tab "Settings"
2. Scroll ke "Networking"
3. Klik "Generate Domain"

### I. After Domain Generated
```
┌────────────────────────────────────────────────┐
│  Networking                                    │
│  ┌──────────────────────────────────────────┐ │
│  │ Public Domain:                           │ │
│  │ campusthrift-production.up.railway.app  │ │
│  │ [Copy] [Remove]                          │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

**Important:**
1. Copy domain yang diberikan
2. Kembali ke tab "Variables"
3. Update `APP_URL` dengan domain ini
4. Save (will redeploy)

---

## STEP 7: Monitor Deployment

### J. Deployments Tab
```
┌────────────────────────────────────────────────┐
│  Deployments  Variables  Settings              │
│                                                 │
│  Active Deployment:                            │
│  ┌──────────────────────────────────────────┐ │
│  │ 🟢 Ready for Railway deployment          │ │
│  │ main • abc1234                           │ │
│  │ Deployed 2 minutes ago                   │ │
│  │ [View Logs] [Redeploy]                   │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  Build Logs:                                   │
│  ┌──────────────────────────────────────────┐ │
│  │ Installing dependencies...               │ │
│  │ Building frontend...                     │ │
│  │ ✓ Build completed                        │ │
│  │ Starting server...                       │ │
│  │ ✓ Server started on port 3000           │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

**Status Indicators:**
- 🟢 **Active** = Running perfectly
- 🟡 **Building** = Deploying...
- 🔴 **Failed** = Error (check logs)
- ⚪ **Inactive** = Sleeping (free tier)

---

## STEP 8: View Logs

### K. Logs View
```
┌────────────────────────────────────────────────┐
│  [Search logs...]                  [Download]  │
│                                                 │
│  2025-01-16 10:30:15  INFO   Server started   │
│  2025-01-16 10:30:20  INFO   Route loaded     │
│  2025-01-16 10:30:25  INFO   Database conn... │
│  2025-01-16 10:30:30  INFO   Ready to serve  │
│                                                 │
│  ✓ Application is running                     │
└────────────────────────────────────────────────┘
```

**Accessing Logs:**
- Method 1: Deployment tab → View Logs
- Method 2: Railway CLI: `railway logs`
- Method 3: Real-time: `railway logs --follow`

---

## STEP 9: Database Variables (Auto-Injected)

### L. MySQL Service Variables
```
┌────────────────────────────────────────────────┐
│  MySQL                                         │
│  Variables:                                    │
│  ┌──────────────────────────────────────────┐ │
│  │ MYSQLHOST = mysql.railway.internal       │ │
│  │ MYSQLPORT = 3306                         │ │
│  │ MYSQLDATABASE = railway                  │ │
│  │ MYSQLUSER = root                         │ │
│  │ MYSQLPASSWORD = ****************         │ │
│  │ DATABASE_URL = mysql://...               │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  These are automatically available to         │
│  CampusThrift service via ${VARIABLE}         │
└────────────────────────────────────────────────┘
```

**Note:** Tidak perlu manual set, sudah auto-inject!

---

## STEP 10: Usage Monitoring

### M. Usage Dashboard
```
┌────────────────────────────────────────────────┐
│  Usage                                         │
│                                                 │
│  Current Billing Period:                      │
│  Jan 1 - Jan 31, 2025                         │
│                                                 │
│  ┌──────────────────────────────────────────┐ │
│  │ Credit Used:    $1.23 / $5.00           │ │
│  │ ▓▓▓▓▓░░░░░░░░░░░░░░░░░ 24.6%           │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  ┌──────────────────────────────────────────┐ │
│  │ Execution Hours: 123 / 500 hours        │ │
│  │ ▓▓▓▓▓░░░░░░░░░░░░░░░░░ 24.6%           │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  ┌──────────────────────────────────────────┐ │
│  │ Bandwidth: 12.3 GB / 100 GB             │ │
│  │ ▓▓░░░░░░░░░░░░░░░░░░░░ 12.3%           │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

**Access:** Settings → Usage

---

## 🎯 Quick Reference - Tab Locations

### Main Tabs (Service Level):
```
┌────────────────────────────────────────┐
│ [Deployments] [Variables] [Settings]  │
└────────────────────────────────────────┘
```

**Deployments:**
- View build logs
- Monitor deployment status
- Redeploy manually
- View deployment history

**Variables:**
- Set environment variables
- Use Raw Editor for bulk edit
- Reference other service variables

**Settings:**
- Generate domain
- Configure sleep settings
- Set custom start command
- View service metrics
- Monitor usage
- Danger zone (delete)

---

## 🚨 Common Visual Indicators

### Status Colors:
- 🟢 **Green** = Active, healthy
- 🟡 **Yellow** = Building, deploying
- 🔴 **Red** = Failed, error
- ⚪ **Gray** = Inactive, sleeping

### Icons:
- 🚂 **Train** = Railway logo
- 🗄️ **Database** = MySQL service
- 📦 **Package** = Application service
- ⚙️ **Gear** = Settings
- 📊 **Chart** = Metrics/Usage
- 🔗 **Link** = Domain/URL
- 📝 **Document** = Logs

---

## 💡 Tips untuk Navigate Dashboard

1. **Always check Deployments tab first** untuk status
2. **Use Raw Editor** untuk Variables (lebih cepat)
3. **Monitor Usage** regularly (Settings → Usage)
4. **Enable email notifications** untuk alerts
5. **Use Railway CLI** untuk quick access dari terminal
6. **Bookmark your domain** untuk quick testing
7. **Save deployment logs** saat error terjadi

---

## 🆘 Where to Find Help in Dashboard

### Help Button (?)
- Located: Top-right corner
- Access: Documentation, Discord, Support

### Community
- Discord: In-app link atau https://discord.gg/railway
- Docs: https://docs.railway.app
- Status: https://status.railway.app

---

**Visual guide complete! Use this sebagai referensi saat navigate Railway dashboard.** 🎨✨

