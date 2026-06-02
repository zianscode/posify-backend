# POSify Backend API

POS (Point of Sale) backend system built with Express.js + TypeScript + Prisma + PostgreSQL.

## Tech Stack

| Teknologi | Versi |
|-----------|-------|
| Runtime | Node.js |
| Framework | Express 5 |
| Language | TypeScript 6 |
| ORM | Prisma 7 |
| Database | PostgreSQL |
| Validasi | Zod 4 |
| Auth | JWT + bcrypt |
| Real-time | Socket.io 4 |

## Persyaratan

- Node.js >= 18
- PostgreSQL
- npm

## Instalasi & Menjalankan

```bash
# 1. Clone & masuk direktori
cd posify-backend

# 2. Install dependencies
npm install

# 3. Generate Prisma client
npm run prisma:generate

# 4. Setup environment
# Edit file .env (sudah tersedia)
#   DATABASE_URL="postgresql://user:password@localhost:5432/posify"
#   JWT_SECRET="ganti_dengan_secret_anda"
#   PORT=5000

# 5. Jalankan migration (buat tabel database)
npx prisma migrate dev --name init

# 6. Seed data awal
npm run prisma:seed

# 7. Jalankan server development
npm run dev
```

Server akan berjalan di `http://localhost:5000`.

Cek kesehatan: `GET http://localhost:5000/health`

## Akun Seed (Password: `admin123`)

| Role | Email | Nama |
|------|-------|------|
| Admin | admin@posify.com | Super Admin |
| Manager | manager@posify.com | Store Manager |
| Kasir | kasir@posify.com | Cashier Terminal 1 |

## Struktur Proyek

```
src/
├── app.ts                          # Entry point Express
├── config/
│   ├── database.ts                 # PrismaClient singleton
│   ├── env.ts                      # Validasi environment variables (Zod)
│   └── socket.ts                   # Socket.io setup
├── middlewares/
│   ├── auth.middleware.ts          # Verifikasi JWT Bearer token
│   ├── error.middleware.ts         # Global error handler
│   ├── logger.middleware.ts        # Request logger
│   ├── role.middleware.ts          # Role-based access control
│   └── validate.middleware.ts      # Zod validation middleware
├── shared/
│   ├── errors.ts                   # Custom error classes
│   ├── response.ts                 # Standard response helpers
│   └── helpers.ts                  # bcrypt, JWT utilities
└── modules/
    ├── auth/                       # Login, refresh token, logout
    ├── category/                   # CRUD kategori
    ├── unit/                       # CRUD unit satuan
    ├── product/                    # CRUD produk + search + pagination
    ├── payment-method/             # List metode pembayaran
    ├── stock/                      # Adjust stok + riwayat movement
    ├── transaction/                # Transaksi POS + auto-deduct stok
    └── dashboard/                  # Summary, sales trend, top products
```

## API Endpoints

### Health & Welcome

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/health` | - | Cek koneksi database |
| GET | `/api/v1` | - | Welcome message |

### Auth

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/api/v1/auth/login` | - | Login |
| POST | `/api/v1/auth/refresh` | - | Refresh token |
| POST | `/api/v1/auth/logout` | JWT | Logout |

### Master Data

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/api/v1/categories` | JWT | All |
| POST | `/api/v1/categories` | JWT | admin, manager |
| PUT | `/api/v1/categories/:id` | JWT | admin, manager |
| DELETE | `/api/v1/categories/:id` | JWT | admin, manager |
| GET | `/api/v1/units` | JWT | All |
| POST | `/api/v1/units` | JWT | admin, manager |
| PUT | `/api/v1/units/:id` | JWT | admin, manager |
| DELETE | `/api/v1/units/:id` | JWT | admin, manager |
| GET | `/api/v1/products` | JWT | All |
| GET | `/api/v1/products/:id` | JWT | All |
| POST | `/api/v1/products` | JWT | admin, manager |
| PUT | `/api/v1/products/:id` | JWT | admin, manager |
| DELETE | `/api/v1/products/:id` | JWT | admin, manager |

### Stok

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | `/api/v1/stock/adjust` | JWT | admin, manager |
| GET | `/api/v1/stock/movements/:productId` | JWT | All |

### Transaksi

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/api/v1/transactions` | JWT | Buat transaksi POS |
| GET | `/api/v1/transactions` | JWT | Riwayat transaksi |
| GET | `/api/v1/transactions/:id` | JWT | Detail transaksi |

### Dashboard

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/api/v1/dashboard/summary` | JWT | admin, manager |
| GET | `/api/v1/dashboard/sales-trend` | JWT | admin, manager |
| GET | `/api/v1/dashboard/top-products` | JWT | admin, manager |

### Payment Methods

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/api/v1/payment-methods` | JWT | All |

## Format Response

Semua response menggunakan format seragam:

```json
// Sukses
{
  "status": "success",
  "message": "Pesan sukses",
  "data": { ... }
}

// Error
{
  "status": "error",
  "message": "Pesan error",
  "errors": [
    { "field": "name", "msg": "Nama produk wajib diisi" }
  ]
}

// Pagination
{
  "status": "success",
  "message": "Daftar produk berhasil diambil",
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

## Database Schema (PostgreSQL)

| Tabel | Deskripsi |
|-------|-----------|
| roles | Admin, manager, kasir |
| outlets | Cabang / outlet |
| users | Pengguna (terkait role & outlet) |
| categories | Kategori produk |
| units | Satuan produk (pcs, kg, botol, dll) |
| products | Produk dengan stok & harga |
| stock_movements | Riwayat keluar/masuk stok |
| payment_methods | Cash, QRIS, transfer |
| transactions | Header transaksi POS |
| transaction_items | Item detail transaksi |

## Scripts

```bash
npm run dev              # Jalankan development server
npm run build            # Compile TypeScript ke JavaScript
npm start                # Jalankan production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Jalankan migration
npm run prisma:seed      # Seed data awal
```

## Socket.io (Real-time)

- `join-outlet` — Join room outlet untuk notifikasi spesifik outlet
- `stock-alert` — Notifikasi stok menipis
- `new-transaction` — Notifikasi transaksi baru
