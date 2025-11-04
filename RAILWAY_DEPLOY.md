# Panduan Deployment ke Railway

## Langkah 1: Persiapan GitHub Repository

1. Pastikan semua kode sudah di-commit ke GitHub
2. Pastikan repository sudah public (untuk free tier) atau private dengan Railway integration

## Langkah 2: Buat Akun Railway

1. Kunjungi https://railway.app
2. Klik **"Start a New Project"**
3. Login dengan GitHub (pilih akun GitHub Anda)
4. Authorize Railway untuk mengakses repository

## Langkah 3: Create New Project

1. Pilih **"Deploy from GitHub repo"**
2. Pilih repository `sims-api` Anda
3. Railway akan otomatis mendeteksi project

## Langkah 4: Setup Database MySQL

1. Di dashboard Railway project Anda, klik **"+ New"**
2. Pilih **"Database"** → **"Add MySQL"**
3. Railway akan membuat database MySQL baru
4. Copy **Connection URL** atau credentials berikut:
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_DATABASE`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`

## Langkah 5: Setup Environment Variables

1. Di project dashboard, klik **"Variables"** tab
2. Tambahkan environment variables berikut:

```env
# Server Configuration (PRODUCTION)
PORT=3000
NODE_ENV=production

# MySQL Database Configuration (dari Railway MySQL service)
DB_HOST=<MYSQL_HOST_dari_Railway>
DB_PORT=<MYSQL_PORT_dari_Railway>
DB_NAME=<MYSQL_DATABASE_dari_Railway>
DB_USER=<MYSQL_USER_dari_Railway>
DB_PASSWORD=<MYSQL_PASSWORD_dari_Railway>

# JWT Secret (PRODUCTION - generate baru, JANGAN gunakan development value!)
JWT_SECRET=<generate_random_string_32_chars>

# App URL (update setelah deploy dengan URL dari Railway)
APP_URL=https://<your-project-name>.railway.app
```

**⚠️ PENTING - Environment Variables untuk PRODUCTION:**
- **NODE_ENV=production** (BUKAN development!)
- **JWT_SECRET** harus generate baru untuk production (JANGAN gunakan yang sama dengan development)
- Semua nilai database harus dari Railway MySQL service (bukan localhost)
- APP_URL akan diupdate setelah deployment selesai

**Cara mendapatkan DB credentials:**
- Klik pada MySQL service yang sudah dibuat
- Di tab **"Variables"** akan terlihat semua connection variables:
  - `MYSQL_HOST` → isi di `DB_HOST`
  - `MYSQL_PORT` → isi di `DB_PORT`
  - `MYSQL_DATABASE` → isi di `DB_NAME`
  - `MYSQL_USER` → isi di `DB_USER`
  - `MYSQL_PASSWORD` → isi di `DB_PASSWORD`

**Generate JWT_SECRET untuk Production:**
```bash
openssl rand -base64 32
```
atau gunakan online generator, tapi **PASTIKAN berbeda dari development value!**

## Langkah 6: Setup Database Schema

1. Setelah MySQL service dibuat, klik pada service tersebut
2. Klik tab **"Connect"** atau **"Query"**
3. Copy script dari `database/schema.sql`
4. Jalankan script untuk membuat database schema
5. Jalankan script dari `database/seed.sql` untuk seed data

**Alternatif:**
- Gunakan Railway MySQL CLI atau web interface
- Atau gunakan MySQL client lokal dengan connection string dari Railway

## Langkah 7: Deploy Application

1. Railway akan otomatis deploy setelah:
   - Push ke GitHub (jika auto-deploy enabled)
   - Atau manual deploy dari dashboard
2. Tunggu hingga build selesai
3. Aplikasi akan otomatis start

## Langkah 8: Update APP_URL

1. Setelah deploy selesai, Railway akan memberikan URL:
   - Format: `https://<project-name>.railway.app`
2. Copy URL tersebut
3. Update environment variable `APP_URL` dengan URL tersebut
4. Redeploy aplikasi (Railway akan auto-redeploy jika ada perubahan env var)

## Langkah 9: Verifikasi Deployment

1. Test endpoint: `https://<your-app-url>/`
2. Test health check endpoint
3. Test API endpoints dengan Postman

## Troubleshooting

### Database Connection Error
- Pastikan semua DB environment variables sudah benar
- Pastikan MySQL service sudah running
- Check connection string format

### Upload Folder Error
- Railway akan otomatis create folder `uploads`
- Pastikan folder permissions sudah benar
- Check logs jika ada error

### Port Error
- Railway akan otomatis set PORT environment variable
- Pastikan app.js menggunakan `process.env.PORT`

### Build Error
- Check build logs di Railway dashboard
- Pastikan semua dependencies terinstall
- Check Node.js version compatibility

## Monitoring

1. **Logs**: Klik service → tab **"Logs"** untuk melihat real-time logs
2. **Metrics**: Railway menyediakan basic metrics (CPU, Memory, Network)
3. **Deployments**: History semua deployment ada di tab **"Deployments"**

## Free Tier Limits

- **$5 credit per bulan** (cukup untuk development/small apps)
- **512MB RAM** per service
- **1GB disk space**
- **100GB bandwidth**
- **Auto-sleep** setelah 5 menit idle (akan wake up saat ada request)

## Tips

1. **Database**: Gunakan Railway MySQL untuk development (free tier cukup)
2. **Environment Variables**: Simpan semua secrets di Railway Variables, jangan commit ke GitHub
3. **Auto-deploy**: Enable auto-deploy dari main branch
4. **Health Check**: Railway akan auto-check health endpoint
5. **Custom Domain**: Railway free tier tidak support custom domain, tapi bisa upgrade

## Next Steps

1. Setup database migration (jika perlu)
2. Setup CI/CD pipeline
3. Monitor logs dan metrics
4. Setup backup database (penting!)

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app

