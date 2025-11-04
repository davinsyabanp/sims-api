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

## Testing

Gunakan Postman atau tools API testing lainnya:

1. **Register User:**
```bash
POST http://localhost:3000/registration
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

2. **Login:**
```bash
POST http://localhost:3000/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

3. **Get Profile (with JWT Token):**
```bash
GET http://localhost:3000/profile
Authorization: Bearer <your_jwt_token>
```

## Deployment

### Railway Deployment

Lihat dokumentasi lengkap di [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) atau [railway-setup.md](./railway-setup.md)

Quick steps:
1. Push code ke GitHub
2. Login ke Railway (https://railway.app)
3. Create new project → Deploy from GitHub
4. Add MySQL database
5. Setup environment variables
6. Deploy!

## Project Structure

```
sims-api/
├── database/
│   ├── schema.sql      # Database schema
│   └── seed.sql        # Seed data
├── src/
│   ├── config/
│   │   └── database.js # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── routes/         # Route definitions
│   ├── utils/          # Utility functions
│   └── app.js          # Express app setup
├── uploads/            # Uploaded files
├── .env                # Environment variables (not committed)
├── package.json        # Dependencies
└── README.md          # This file
```

## License

ISC

