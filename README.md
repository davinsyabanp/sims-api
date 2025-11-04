# SIMS PPOB API

REST API untuk sistem Payment Point Online Bank (PPOB) menggunakan Express.js dan MySQL.

## Features

- ✅ User Registration & Authentication (JWT)
- ✅ User Profile Management
- ✅ Balance Management (Top Up)
- ✅ Transaction History
- ✅ Service Payment
- ✅ Banner & Services Information
- ✅ File Upload (Profile Image)

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd sims-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy `.env.example` ke `.env` dan isi dengan konfigurasi Anda:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sims_ppob_db
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key

# App URL
APP_URL=http://localhost:3000
```

### 4. Setup Database

1. Buat database MySQL:
```sql
CREATE DATABASE sims_ppob_db;
```

2. Jalankan schema:
```bash
mysql -u root -p sims_ppob_db < database/schema.sql
```

3. Jalankan seed data:
```bash
mysql -u root -p sims_ppob_db < database/seed.sql
```

### 5. Run Application

```bash
# Development
npm run dev

# Production
npm start
```

Server akan berjalan di `http://localhost:3000`

## API Documentation

### Public Endpoints

- `POST /registration` - Register new user
- `POST /login` - User login
- `GET /banner` - Get all banners

### Protected Endpoints (Require JWT Token)

- `GET /profile` - Get user profile
- `PUT /profile/update` - Update profile
- `PUT /profile/image` - Update profile image
- `GET /services` - Get all services
- `GET /balance` - Get user balance
- `POST /topup` - Top up balance
- `POST /transaction` - Create payment transaction
- `GET /transaction/history` - Get transaction history

## Deployment

### Railway Deployment

1. Push code ke GitHub
2. Login ke Railway (https://railway.app)
3. Create new project → Deploy from GitHub
4. Add MySQL database service
5. Setup environment variables di Railway dashboard:
   - `PORT` (default: 3000)
   - `NODE_ENV=production`
   - `DB_HOST` (dari Railway MySQL service)
   - `DB_PORT` (dari Railway MySQL service)
   - `DB_NAME` (dari Railway MySQL service)
   - `DB_USER` (dari Railway MySQL service)
   - `DB_PASSWORD` (dari Railway MySQL service)
   - `JWT_SECRET` (generate secret key untuk production)
   - `APP_URL` (URL aplikasi Railway Anda)
6. Jalankan SQL schema dan seed data pada database MySQL
7. Deploy!

