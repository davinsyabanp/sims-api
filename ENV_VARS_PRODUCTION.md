# Environment Variables untuk Production (Railway)

## ⚠️ PENTING: Environment Variables untuk PRODUCTION

**File ini menjelaskan environment variables yang HARUS di-set untuk production deployment di Railway.**

### ❌ JANGAN gunakan nilai development!
- Jangan gunakan `NODE_ENV=development`
- Jangan gunakan `localhost` untuk database
- Jangan gunakan JWT_SECRET yang sama dengan development
- Jangan gunakan password database yang sama dengan development

---

## 📋 Daftar Environment Variables

### 1. Server Configuration

```env
PORT=3000
NODE_ENV=production
```

**Penjelasan:**
- `PORT`: Railway akan otomatis set, tapi bisa di-set manual (default: 3000)
- `NODE_ENV`: **WAJIB `production`** (bukan `development`!)

---

### 2. MySQL Database Configuration

**Semua nilai harus dari Railway MySQL service, BUKAN localhost!**

```env
DB_HOST=<MYSQL_HOST_dari_Railway>
DB_PORT=<MYSQL_PORT_dari_Railway>
DB_NAME=<MYSQL_DATABASE_dari_Railway>
DB_USER=<MYSQL_USER_dari_Railway>
DB_PASSWORD=<MYSQL_PASSWORD_dari_Railway>
```

**Cara mendapatkan nilai:**
1. Di Railway dashboard, klik pada **MySQL service** yang sudah dibuat
2. Klik tab **"Variables"**
3. Copy semua nilai berikut:
   - `MYSQL_HOST` → paste ke `DB_HOST`
   - `MYSQL_PORT` → paste ke `DB_PORT`
   - `MYSQL_DATABASE` → paste ke `DB_NAME`
   - `MYSQL_USER` → paste ke `DB_USER`
   - `MYSQL_PASSWORD` → paste ke `DB_PASSWORD`

**Contoh:**
```env
DB_HOST=containers-us-west-123.railway.app
DB_PORT=12345
DB_NAME=railway
DB_USER=root
DB_PASSWORD=abc123xyz456
```

---

### 3. JWT Secret

```env
JWT_SECRET=<generate_random_string_32_chars>
```

**⚠️ PENTING:**
- **JANGAN gunakan JWT_SECRET yang sama dengan development!**
- Generate random string baru untuk production
- Minimum 32 karakter untuk keamanan

**Cara generate:**
```bash
# Di terminal lokal
openssl rand -base64 32
```

**Contoh output:**
```
K8mN9pQ2rT5vX8zA1bC4dE7fG0hJ3kL6mN9pQ2rT5v
```

**Gunakan output tersebut sebagai `JWT_SECRET`**

---

### 4. App URL

```env
APP_URL=https://<your-project-name>.railway.app
```

**Penjelasan:**
- Akan diupdate setelah deployment selesai
- Railway akan memberikan URL setelah deploy
- Format: `https://<project-name>.railway.app`

**Contoh:**
```env
APP_URL=https://sims-api-production.railway.app
```

---

## 📝 Checklist Environment Variables

Sebelum deploy, pastikan:

- [ ] `NODE_ENV=production` (BUKAN development)
- [ ] `DB_HOST` dari Railway MySQL (BUKAN localhost)
- [ ] `DB_PORT` dari Railway MySQL (BUKAN 3306 default)
- [ ] `DB_NAME` dari Railway MySQL
- [ ] `DB_USER` dari Railway MySQL
- [ ] `DB_PASSWORD` dari Railway MySQL
- [ ] `JWT_SECRET` generate baru (BUKAN development value)
- [ ] `APP_URL` akan diupdate setelah deploy

---

## 🔍 Verifikasi Environment Variables

Setelah setup, verifikasi di Railway dashboard:

1. Klik pada service **"sims-api"**
2. Klik tab **"Variables"**
3. Pastikan semua variables sudah benar:
   - ✅ `NODE_ENV=production`
   - ✅ Semua `DB_*` variables dari Railway MySQL
   - ✅ `JWT_SECRET` ada dan panjang (32+ chars)
   - ✅ `APP_URL` sudah diupdate (setelah deploy)

---

## 🐛 Troubleshooting

### Error: "Database connection failed"
- **Cek:** Apakah `DB_HOST` masih `localhost`? Harus dari Railway MySQL!
- **Cek:** Apakah semua `DB_*` variables sudah benar?
- **Cek:** Apakah MySQL service sudah running?

### Error: "JWT verification failed"
- **Cek:** Apakah `JWT_SECRET` sudah benar?
- **Cek:** Apakah `JWT_SECRET` berbeda dari development?

### Error: "Environment: development"
- **Cek:** Apakah `NODE_ENV=production` sudah di-set?
- **Cek:** Apakah environment variable sudah di-save di Railway?

---

## 📚 Reference

- Railway Docs: https://docs.railway.app
- Environment Variables: https://docs.railway.app/develop/variables

