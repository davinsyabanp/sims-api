# Railway Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Preparation
- [ ] Semua kode sudah di-commit ke GitHub
- [ ] Repository sudah public atau private dengan Railway access
- [ ] `.env` file sudah di-ignore (tidak commit)
- [ ] `package.json` sudah benar dengan start script

### 2. Database Preparation
- [ ] Script `database/schema.sql` sudah siap
- [ ] Script `database/seed.sql` sudah siap
- [ ] Database schema sudah ditest lokal

### 3. Environment Variables (PRODUCTION)
- [ ] **⚠️ PASTIKAN semua env vars untuk PRODUCTION, BUKAN development!**
- [ ] List semua env vars yang diperlukan:
  - [ ] `PORT=3000` (Railway akan set otomatis, tapi bisa set manual)
  - [ ] `NODE_ENV=production` ⚠️ **WAJIB production, bukan development!**
  - [ ] `DB_HOST` (dari Railway MySQL service, BUKAN localhost)
  - [ ] `DB_PORT` (dari Railway MySQL service, BUKAN 3306 default)
  - [ ] `DB_NAME` (dari Railway MySQL service)
  - [ ] `DB_USER` (dari Railway MySQL service)
  - [ ] `DB_PASSWORD` (dari Railway MySQL service)
  - [ ] `JWT_SECRET` ⚠️ **Generate baru untuk production, JANGAN gunakan development value!**
  - [ ] `APP_URL` (akan diupdate setelah deploy dengan URL dari Railway)

## 🚀 Deployment Steps

### Step 1: Railway Account
- [ ] Login ke https://railway.app
- [ ] Login dengan GitHub
- [ ] Authorize Railway access

### Step 2: Create Project
- [ ] Create New Project
- [ ] Deploy from GitHub repo
- [ ] Pilih repository `sims-api`
- [ ] Railway akan auto-detect project

### Step 3: Add MySQL Database
- [ ] Klik "+ New" → "Database" → "Add MySQL"
- [ ] Tunggu MySQL service ready
- [ ] Copy semua connection variables:
  - [ ] `MYSQL_HOST`
  - [ ] `MYSQL_PORT`
  - [ ] `MYSQL_DATABASE`
  - [ ] `MYSQL_USER`
  - [ ] `MYSQL_PASSWORD`

### Step 4: Setup Environment Variables
- [ ] Klik service "sims-api"
- [ ] Tab "Variables"
- [ ] Add semua env vars (lihat list di atas)
- [ ] Generate JWT_SECRET: `openssl rand -base64 32`

### Step 5: Setup Database Schema
- [ ] Connect ke MySQL (via Railway dashboard atau MySQL client)
- [ ] Run `database/schema.sql`
- [ ] Run `database/seed.sql`
- [ ] Verify tables created

### Step 6: Deploy
- [ ] Railway akan auto-deploy setelah push
- [ ] Atau manual deploy dari dashboard
- [ ] Tunggu build selesai
- [ ] Check logs untuk error

### Step 7: Update APP_URL
- [ ] Copy URL dari Railway (format: `https://<project-name>.railway.app`)
- [ ] Update env var `APP_URL` dengan URL tersebut
- [ ] Railway akan auto-redeploy

### Step 8: Verify Deployment
- [ ] Test health check: `GET https://<your-url>/`
- [ ] Test public endpoint: `GET https://<your-url>/banner`
- [ ] Test registration: `POST https://<your-url>/registration`
- [ ] Test login: `POST https://<your-url>/login`
- [ ] Test protected endpoint dengan JWT token

## 🔍 Post-Deployment Verification

### API Endpoints
- [ ] `GET /` - Health check
- [ ] `GET /banner` - Public endpoint
- [ ] `POST /registration` - User registration
- [ ] `POST /login` - User login
- [ ] `GET /profile` - Get profile (with JWT)
- [ ] `GET /services` - Get services (with JWT)
- [ ] `GET /balance` - Get balance (with JWT)
- [ ] `POST /topup` - Top up (with JWT)
- [ ] `POST /transaction` - Payment (with JWT)
- [ ] `GET /transaction/history` - History (with JWT)

### Database
- [ ] Tables created: `users`, `balances`, `banners`, `services`, `transactions`
- [ ] Seed data inserted: 6 banners, 12 services
- [ ] Database connection working

### File Upload
- [ ] Upload folder created
- [ ] Profile image upload working
- [ ] Image accessible via URL

## 🐛 Troubleshooting

### Database Connection Error
- [ ] Check semua DB env vars sudah benar
- [ ] Check MySQL service running
- [ ] Check connection format
- [ ] Check logs di Railway dashboard

### Build Error
- [ ] Check build logs
- [ ] Check `package.json` dependencies
- [ ] Check Node.js version compatibility

### Port Error
- [ ] Pastikan app.js menggunakan `process.env.PORT`
- [ ] Railway akan otomatis set PORT

### Upload Error
- [ ] Check uploads folder created
- [ ] Check folder permissions
- [ ] Check logs untuk detail error

## 📝 Notes

- **Free Tier**: Railway memberikan $5 credit per bulan (cukup untuk development)
- **Auto-Sleep**: Aplikasi akan sleep setelah idle, wake up saat ada request
- **Logs**: Check logs di Railway dashboard untuk debugging
- **Metrics**: Railway menyediakan basic metrics (CPU, Memory, Network)
- **Database Backup**: Setup backup strategy (penting!)

## 🔗 Useful Links

- Railway Dashboard: https://railway.app
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app

