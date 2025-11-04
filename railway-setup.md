# Quick Setup Railway - Step by Step

## 1. Persiapan

### Pastikan kode sudah di GitHub:
```bash
git add .
git commit -m "Setup Railway deployment"
git push origin main
```

## 2. Login ke Railway

1. Buka https://railway.app
2. Klik **"Login"** → pilih **"Login with GitHub"**
3. Authorize Railway untuk akses repository

## 3. Create New Project

1. Klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Pilih repository `sims-api`
4. Railway akan otomatis detect project

## 4. Add MySQL Database

1. Di project dashboard, klik **"+ New"**
2. Pilih **"Database"** → **"Add MySQL"**
3. Tunggu hingga MySQL service ready
4. Klik pada MySQL service → tab **"Variables"**
5. Copy semua connection variables:
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_DATABASE`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`

## 5. Setup Environment Variables

1. Klik pada service **"sims-api"** (atau nama service Anda)
2. Klik tab **"Variables"**
3. Klik **"New Variable"** dan tambahkan:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# MySQL Database Configuration (dari Railway MySQL service)
DB_HOST=<MYSQL_HOST_dari_Railway>
DB_PORT=<MYSQL_PORT_dari_Railway>
DB_NAME=<MYSQL_DATABASE_dari_Railway>
DB_USER=<MYSQL_USER_dari_Railway>
DB_PASSWORD=<MYSQL_PASSWORD_dari_Railway>

# JWT Secret (generate random string - JANGAN gunakan development value!)
JWT_SECRET=<generate_random_string_32_chars>

# App URL (update setelah deploy dengan URL dari Railway)
APP_URL=https://<your-project-name>.railway.app
```

**⚠️ PENTING:**
- Pastikan `NODE_ENV=production` (BUKAN development)
- Generate JWT_SECRET baru untuk production (JANGAN gunakan yang sama dengan development)
- APP_URL akan diupdate setelah deploy selesai

**Cara generate JWT_SECRET:**
```bash
# Di terminal lokal
openssl rand -base64 32
```

## 6. Setup Database Schema

Setelah MySQL service ready, jalankan script berikut:

### Option 1: Via Railway Dashboard
1. Klik MySQL service → tab **"Connect"**
2. Klik **"Open Query Editor"**
3. Copy script dari `database/schema.sql`
4. Paste dan execute
5. Copy script dari `database/seed.sql`
6. Paste dan execute

### Option 2: Via MySQL Client (Lokal)
1. Install MySQL client (jika belum)
2. Dapatkan connection string dari Railway:
   - Klik MySQL service → tab **"Connect"**
   - Copy **"Connection URL"**
3. Connect dari terminal:
```bash
mysql -h <MYSQL_HOST> -P <MYSQL_PORT> -u <MYSQL_USER> -p<MYSQL_PASSWORD> <MYSQL_DATABASE>
```
4. Copy-paste script dari `database/schema.sql`
5. Copy-paste script dari `database/seed.sql`

## 7. Deploy

1. Railway akan otomatis deploy setelah:
   - Push ke GitHub (jika auto-deploy enabled)
   - Atau manual deploy dari dashboard
2. Tunggu build selesai (check tab **"Deployments"**)
3. Setelah selesai, Railway akan memberikan URL:
   - Format: `https://<project-name>.railway.app`

## 8. Update APP_URL

1. Setelah deploy selesai, copy URL dari Railway
2. Update environment variable `APP_URL` dengan URL tersebut
3. Railway akan auto-redeploy

## 9. Test Deployment

1. Test health check:
   ```
   GET https://<your-app-url>/
   ```

2. Test API:
   ```
   GET https://<your-app-url>/banner
   ```

3. Test dengan Postman (lihat dokumentasi API)

## Troubleshooting

### Database Connection Error
- Pastikan semua DB env vars sudah benar
- Pastikan MySQL service sudah running
- Check connection format (host, port, user, password)

### Build Error
- Check logs di Railway dashboard
- Pastikan `package.json` sudah benar
- Pastikan Node.js version compatible

### Port Error
- Railway otomatis set PORT env var
- Pastikan app.js menggunakan `process.env.PORT`

### Upload Folder Error
- Railway akan auto-create folder
- Pastikan permissions sudah benar
- Check logs untuk detail error

## Tips

1. **Monitor Logs**: Klik service → tab **"Logs"** untuk real-time logs
2. **Auto-Deploy**: Enable auto-deploy dari main branch
3. **Environment**: Pisahkan production dan development env vars
4. **Database Backup**: Setup backup database (penting!)
5. **Health Check**: Railway akan auto-check health endpoint

## Free Tier Limits

- **$5 credit per bulan** (cukup untuk development)
- **512MB RAM** per service
- **1GB disk space**
- **100GB bandwidth**
- **Auto-sleep** setelah idle (wake up saat ada request)

## Next Steps

1. Setup database migration
2. Setup CI/CD pipeline
3. Monitor logs dan metrics
4. Setup backup strategy

