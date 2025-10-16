# 🔧 Railway Troubleshooting Guide

## Common Issues & Solutions for CampusThrift Deployment

---

## 🚨 ERROR 1: Build Failed

### Symptoms:
```
❌ Build failed
Error: npm install failed
Error: composer install failed
```

### Solutions:

#### A. Check package.json and composer.json
```bash
# Locally test:
composer install --no-dev
npm ci
npm run build
```

#### B. Update nixpacks.toml if needed
```toml
[phases.install]
cmds = [
  'composer install --no-dev --optimize-autoloader --no-interaction',
  'npm ci --legacy-peer-deps'  # Add if npm conflicts
]
```

#### C. Check Railway logs:
```bash
railway logs
```

**Common causes:**
- Missing dependencies in composer.json
- npm package conflicts
- PHP version mismatch

---

## 🚨 ERROR 2: 500 Internal Server Error

### Symptoms:
```
Website shows: "500 | SERVER ERROR"
```

### Solutions:

#### A. Check APP_KEY is set:
```bash
railway run php artisan tinker
>>> env('APP_KEY')
# Should return: "base64:..."
```

If empty:
```bash
# Generate locally
php artisan key:generate --show

# Set in Railway Variables
APP_KEY=base64:your_generated_key
```

#### B. Clear all caches:
```bash
railway run php artisan cache:clear
railway run php artisan config:clear
railway run php artisan route:clear
railway run php artisan view:clear
```

#### C. Check logs for specific error:
```bash
railway logs | grep -i error
```

#### D. Verify .env variables:
- Check all required variables are set in Railway
- Check for typos in variable names
- Verify APP_DEBUG=false (not true)

---

## 🚨 ERROR 3: Database Connection Failed

### Symptoms:
```
SQLSTATE[HY000] [2002] Connection refused
PDO::__construct(): php_network_getaddresses: getaddrinfo failed
```

### Solutions:

#### A. Verify MySQL service is running:
1. Go to Railway dashboard
2. Check MySQL service status (should be 🟢 Active)
3. If 🔴 Failed, restart it

#### B. Check database variables:
```bash
railway run php artisan tinker
>>> echo env('DB_HOST');
>>> echo env('DB_DATABASE');
>>> DB::connection()->getPdo();
```

Expected output:
```
mysql.railway.internal
railway
PDO Object (...)
```

#### C. Verify Variables are using Railway references:
```env
DB_HOST=${MYSQLHOST}  # NOT hardcoded
DB_PORT=${MYSQLPORT}
DB_DATABASE=${MYSQLDATABASE}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}
```

#### D. Run migrations:
```bash
railway run php artisan migrate --force
```

---

## 🚨 ERROR 4: Assets Not Loading (CSS/JS 404)

### Symptoms:
```
GET /build/assets/app-abc123.js 404 Not Found
GET /build/assets/app-xyz789.css 404 Not Found
```

### Solutions:

#### A. Ensure build folder is committed:
```bash
# Check if public/build exists
ls public/build

# If empty, build:
npm run build

# Add and commit:
git add public/build
git commit -m "Add built assets"
git push
```

#### B. Verify Vite build in nixpacks.toml:
```toml
[phases.build]
cmds = [
  'npm run build',  # This should be here
  'php artisan config:cache',
  'php artisan route:cache',
  'php artisan view:cache'
]
```

#### C. Check APP_URL matches domain:
```env
# In Railway Variables:
APP_URL=https://your-actual-domain.up.railway.app
```

#### D. Clear browser cache:
- Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

---

## 🚨 ERROR 5: Pusher/Chat Not Working

### Symptoms:
```
Chat messages not sending
Pusher connection failed
WebSocket connection error
```

### Solutions:

#### A. Verify Pusher credentials:
```bash
railway run php artisan tinker
>>> echo env('PUSHER_APP_KEY');
>>> echo env('PUSHER_APP_SECRET');
```

#### B. Check Pusher Variables:
```env
# Must be set in Railway:
PUSHER_APP_ID=your_id
PUSHER_APP_KEY=your_key
PUSHER_APP_SECRET=your_secret
PUSHER_APP_CLUSTER=mt1

# Frontend variables (important!):
VITE_PUSHER_APP_KEY=${PUSHER_APP_KEY}
VITE_PUSHER_APP_CLUSTER=${PUSHER_APP_CLUSTER}
```

#### C. Rebuild frontend after Pusher changes:
```bash
npm run build
git add .
git commit -m "Update Pusher config"
git push
```

#### D. Test Pusher connection:
1. Open browser console (F12)
2. Look for: `Pusher: Connection established`
3. If failed, check Pusher dashboard for app status

---

## 🚨 ERROR 6: File Upload Failed

### Symptoms:
```
Unable to upload product images
Error: Storage path not writable
```

### Solutions:

#### A. Create storage link:
```bash
railway run php artisan storage:link
```

#### B. Check storage permissions:
```bash
railway run ls -la storage
railway run ls -la public/storage
```

#### C. Use Cloudinary (Recommended for production):
```bash
composer require cloudinary-labs/cloudinary-laravel

# Add to Railway Variables:
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Update config/filesystems.php
# Update controllers to use Cloudinary
```

---

## 🚨 ERROR 7: Migration Failed

### Symptoms:
```
SQLSTATE[42S01]: Base table or view already exists
SQLSTATE[42000]: Syntax error or access violation
```

### Solutions:

#### A. Fresh migration:
```bash
railway run php artisan migrate:fresh --force
```

⚠️ **Warning:** This will drop all tables!

#### B. Rollback and re-migrate:
```bash
railway run php artisan migrate:rollback --force
railway run php artisan migrate --force
```

#### C. Check specific migration file:
```bash
railway run php artisan migrate --force --path=database/migrations/2025_01_16_xxx_migration.php
```

#### D. Fix migration conflicts:
- Check for duplicate table names
- Verify foreign key constraints
- Check data types compatibility

---

## 🚨 ERROR 8: Domain Not Working

### Symptoms:
```
Cannot access https://your-app.railway.app
ERR_NAME_NOT_RESOLVED
```

### Solutions:

#### A. Wait for DNS propagation (5-10 minutes)

#### B. Verify domain is generated:
1. Railway dashboard → Service → Settings
2. Networking section → Check domain exists
3. If missing, click "Generate Domain"

#### C. Check service is running:
- Status should be 🟢 Active
- If 🔴 Failed, check logs: `railway logs`

#### D. Test with curl:
```bash
curl -I https://your-app.railway.app
```

Expected: `HTTP/2 200` or `HTTP/2 302`

---

## 🚨 ERROR 9: Deployment Timeout

### Symptoms:
```
Build timeout exceeded
Deployment took too long
```

### Solutions:

#### A. Optimize build process:
```toml
# nixpacks.toml
[phases.install]
cmds = [
  'composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist',
  'npm ci --production'  # Only prod dependencies
]
```

#### B. Reduce asset size:
```bash
# Optimize images before upload
# Use lazy loading for components
# Split large bundles
```

#### C. Increase timeout (if using custom plan):
Contact Railway support

---

## 🚨 ERROR 10: Out of Memory

### Symptoms:
```
JavaScript heap out of memory
FATAL ERROR: Reached heap limit
```

### Solutions:

#### A. Increase Node memory:
```json
// package.json
{
  "scripts": {
    "build": "NODE_OPTIONS=--max_old_space_size=4096 vite build"
  }
}
```

#### B. Optimize build:
```js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          // Split large libraries
        }
      }
    }
  }
});
```

---

## 🚨 ERROR 11: Railway CLI Issues

### Symptoms:
```
railway: command not found
railway link failed
```

### Solutions:

#### A. Reinstall Railway CLI:
```bash
npm uninstall -g @railway/cli
npm install -g @railway/cli
```

#### B. Login again:
```bash
railway logout
railway login
```

#### C. Link project manually:
```bash
railway link [project-id]
```

Get project ID from Railway dashboard URL:
`https://railway.app/project/[PROJECT-ID]`

---

## 🛠️ General Debugging Steps

### 1. Check Logs (ALWAYS FIRST!)
```bash
railway logs
railway logs --follow  # Real-time
railway logs | grep -i error
```

### 2. Verify Environment Variables
```bash
railway variables
railway run env | grep APP
```

### 3. Test Database Connection
```bash
railway run php artisan tinker
>>> DB::connection()->getPdo();
>>> DB::table('users')->count();
```

### 4. Clear All Caches
```bash
railway run php artisan cache:clear
railway run php artisan config:clear
railway run php artisan route:clear
railway run php artisan view:clear
railway run php artisan optimize:clear
```

### 5. Redeploy from Scratch
```bash
# In Railway dashboard:
# Settings → Redeploy from Scratch
```

### 6. Check Railway Status
- https://status.railway.app
- Check if there's ongoing incident

---

## 📊 Monitoring & Prevention

### Regular Checks:
```bash
# Daily/Weekly:
railway logs | tail -100
railway status
```

### Usage Monitoring:
- Check credit usage: Railway Dashboard → Settings → Usage
- Set up alerts when approaching limit

### Health Check Endpoint:
Create `/health` route:
```php
// routes/web.php
Route::get('/health', function() {
    return response()->json([
        'status' => 'ok',
        'database' => DB::connection()->getPdo() ? 'connected' : 'disconnected'
    ]);
});
```

Test: `curl https://your-app.railway.app/health`

---

## 🆘 When All Else Fails

1. **Check Railway Status Page:** https://status.railway.app
2. **Search Railway Discord:** https://discord.gg/railway
3. **Railway Docs:** https://docs.railway.app
4. **Delete and Redeploy:**
   - Remove service from Railway
   - Create new project
   - Follow deployment steps again

---

## 📞 Getting Help

### Railway Community:
- Discord: https://discord.gg/railway (very responsive!)
- Docs: https://docs.railway.app
- Status: https://status.railway.app

### Laravel Community:
- Laracasts: https://laracasts.com
- Laravel Discord: https://discord.gg/laravel
- Stack Overflow: Tag `laravel`

### When Asking for Help, Include:
1. Error message (full log)
2. Railway logs output
3. Environment variables (hide sensitive data!)
4. Steps you've already tried
5. When the error started occurring

---

**Most issues dapat diselesaikan dengan check logs + clear cache! 🔧✨**

