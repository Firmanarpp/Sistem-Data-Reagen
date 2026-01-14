<div align="center">

# 📦 PharmStock

### Sistem Manajemen Inventori Reagen Laboratorium

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

**Aplikasi web modern untuk mengelola inventori reagen laboratorium dengan sistem tracking stok real-time, notifikasi kadaluarsa otomatis, dan riwayat transaksi lengkap.**

[Demo](#demo) • [Fitur](#-fitur-utama) • [Instalasi](#-instalasi--setup) • [Dokumentasi](#-dokumentasi-teknis) • [Kontribusi](#-kontribusi)

---

</div>

## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Instalasi & Setup](#-instalasi--setup)
- [Struktur Project](#-struktur-project)
- [Dokumentasi Teknis](#-dokumentasi-teknis)
- [Keamanan](#-keamanan)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)

---

## 🎯 Tentang Project

**PharmStock** adalah sistem manajemen inventori reagen laboratorium yang dirancang khusus untuk membantu laboratorium farmasi dalam mengelola stok reagen secara efisien. Aplikasi ini menyediakan solusi lengkap untuk:

- 📊 **Monitoring Stok Real-time** - Pantau ketersediaan reagen kapan saja
- ⏰ **Peringatan Kadaluarsa** - Notifikasi otomatis untuk reagen yang akan/sudah kadaluarsa
- 📉 **Analisis Pemakaian** - Tracking penggunaan reagen untuk perencanaan pembelian
- 📧 **Notifikasi Email** - Pemberitahuan otomatis setiap transaksi stok
- 📱 **Responsive Design** - Akses dari desktop, tablet, maupun mobile

### Mengapa PharmStock?

| Masalah | Solusi PharmStock |
|---------|-------------------|
| Stok reagen sering kehabisan tanpa peringatan | Sistem peringatan stok minimum otomatis berdasarkan kategori berat sediaan |
| Reagen kadaluarsa terpakai | Notifikasi visual 3 bulan sebelum kadaluarsa |
| Sulit melacak riwayat penggunaan | Riwayat transaksi lengkap yang persisten |
| Data hilang saat reagen dihapus | Arsitektur soft-delete dengan preservasi history |
| Akses tidak terkontrol | Role-based access control (Admin/User) |

---

## ✨ Fitur Utama

### 1. 🏠 Dashboard Interaktif

<details>
<summary><strong>Lihat Detail Fitur</strong></summary>

Dashboard utama menampilkan overview lengkap kondisi inventori:

**Statistik Cards:**
- 📦 **Total Reagen** - Jumlah seluruh reagen dalam sistem
- ⚠️ **Kadaluarsa** - Reagen yang sudah melewati tanggal kadaluarsa (badge merah)
- ⏰ **Akan Kadaluarsa** - Reagen yang kadaluarsa dalam 3 bulan (badge kuning)
- 📉 **Stok Rendah** - Reagen dengan stok di bawah minimum

**Fitur Pencarian & Filter:**
```
🔍 Pencarian     → Nama reagen, brand, batch number
📋 Filter Tipe   → Cair | Padat | Reagen Suhu 2-8°C
📅 Filter Status → Kadaluarsa | Akan Kadaluarsa | Valid
📊 Filter Stok   → Rendah | Cukup
🔄 Sortir        → Berdasarkan nama atau pemakaian tertinggi
```

**Export Data:**
- 📥 Export seluruh data ke format Excel (.xlsx)
- Filter yang diterapkan ikut ter-export

</details>

### 2. 📦 Manajemen Stok

<details>
<summary><strong>Lihat Detail Fitur</strong></summary>

**Transaksi Stok Masuk (Stock In):**
- Catat penambahan stok baru
- Input jumlah dan catatan/notes
- Otomatis update akumulasi `stock_in`

**Transaksi Stok Keluar (Stock Out):**
- Catat penggunaan/pengambilan stok
- Validasi otomatis: tidak bisa melebihi stok tersedia
- Otomatis update akumulasi `stock_out`

**Notifikasi Email Otomatis:**
```
📧 Email dikirim setelah setiap transaksi berisi:
   • Nama reagen
   • Jenis transaksi (Masuk/Keluar)
   • Jumlah perubahan
   • Stok sebelum & sesudah
   • Catatan transaksi
```

**Tracking Pemakaian:**
- Setiap reagen mencatat total `stock_in` dan `stock_out`
- Sortir dashboard berdasarkan pemakaian tertinggi
- Analisis tren untuk perencanaan pembelian

</details>

### 3. 🚨 Sistem Peringatan Otomatis

<details>
<summary><strong>Lihat Detail Fitur</strong></summary>

**Deteksi Status Kadaluarsa:**

| Status | Kondisi | Tampilan Visual |
|--------|---------|-----------------|
| 🔴 **Kadaluarsa** | Tanggal sudah terlewati | Badge merah "⚠️ Kadaluarsa" |
| 🟡 **Akan Kadaluarsa** | Dalam 90 hari (3 bulan) | Badge kuning "⏰ Akan Kadaluarsa" |
| 🟢 **Valid** | Lebih dari 90 hari | Tanpa badge |
| ⚪ **Tidak Ada** | Tanggal tidak diisi | Tanpa badge |

**Algoritma Level Stok Dinamis:**

Sistem menggunakan **berat sediaan (initial_weight)** untuk menentukan stok minimum yang berbeda-beda:

```javascript
// Konversi ke satuan dasar (gram/ml)
if (unit === 'kg') normalizedWeight = initialWeight * 1000
if (unit === 'L')  normalizedWeight = initialWeight * 1000

// Tentukan minimum stok berdasarkan 7 kelompok
```

| Berat Sediaan | Stok Minimum | Contoh Kasus |
|---------------|--------------|--------------|
| ≤ 10 g/ml | 2 | Reagen mahal/jarang dipakai |
| ≤ 25 g/ml | 5 | Reagen kemasan kecil |
| ≤ 50 g/ml | 8 | Reagen standar |
| ≤ 100 g/ml | 20 | Reagen kemasan medium |
| ≤ 250 g/ml | 40 | Reagen sering dipakai |
| ≤ 500 g/ml | 75 | Reagen kemasan besar |
| > 500 g/ml | 150 | Reagen bulk/industri |

</details>

### 4. 📜 Riwayat Transaksi

<details>
<summary><strong>Lihat Detail Fitur</strong></summary>

**Halaman History** (`/history`) mencatat seluruh aktivitas transaksi:

**Filter Tersedia:**
- 📅 **Range Tanggal** - Pilih periode mulai dan akhir
- 🔍 **Nama Reagen** - Cari berdasarkan nama
- 🏷️ **Batch Number** - Cari berdasarkan nomor batch
- 🏢 **Brand** - Cari berdasarkan merek

**Informasi Per Transaksi:**
```
┌─────────────────────────────────────────────────────┐
│ 🧪 [Nama Reagen]              📅 14 Jan 2026 10:30 │
│ ────────────────────────────────────────────────── │
│ ⬆️ Stok Masuk: +50 ml                              │
│ 📊 Perubahan: 100 → 150 ml                         │
│ 📝 Catatan: Pengadaan bulanan                      │
└─────────────────────────────────────────────────────┘
```

**Visualisasi Data:**
- 📈 Grafik tren stok harian menggunakan **Recharts**
- Export hasil filter ke Excel

**Preservasi Data (Soft Delete):**
```
Ketika reagen dihapus:
✓ reagent_id menjadi NULL
✓ reagent_name & reagent_unit tetap tersimpan
✓ History page menampilkan "(dihapus)" sebagai penanda
✓ Data historis TIDAK hilang
```

</details>

### 5. 🔐 Autentikasi & Otorisasi

<details>
<summary><strong>Lihat Detail Fitur</strong></summary>

**Sistem Login Fleksibel:**
- ✉️ Login dengan **Email + Password**
- 👤 Login dengan **Username + Password**

**Registrasi Akun:**
- Input: Email, Username (unique), Password, Nama Lengkap
- Validasi: Password min. 6 karakter, Username min. 3 karakter
- Otomatis buat profile di tabel `profiles`

**Role-Based Access Control:**

| Fitur | Admin | User Biasa |
|-------|:-----:|:----------:|
| View Dashboard | ✅ | ✅ |
| View History | ✅ | ✅ |
| Export Excel | ✅ | ✅ |
| Tambah Reagen | ✅ | ❌ |
| Edit Reagen | ✅ | ❌ |
| Hapus Reagen | ✅ | ❌ |
| Transaksi Stok | ✅ | ❌ |

**Daftar Admin:**
```javascript
const adminEmails = ['gmpsmg@gmail.com', 'projectfarmasi26@gmail.com']
```

**Protected Routes:**
- `AuthGuard` component membungkus seluruh aplikasi
- Otomatis redirect ke `/login` jika tidak terautentikasi
- Otomatis redirect ke `/` jika sudah login mengakses `/login`

</details>

### 6. ✏️ CRUD Reagen (Admin Only)

<details>
<summary><strong>Lihat Detail Fitur</strong></summary>

**Tambah Reagen Baru:**
```
Form Input:
├── Nama Reagen*         (wajib)
├── Jenis                 [Cair | Padat | Reagen Suhu 2-8°C]
├── Brand/Merek          (opsional)
├── Nomor Batch          (opsional)
├── Stok Awal*           (wajib)
├── Berat Sediaan        (untuk perhitungan minimum stok)
├── Satuan               [ml | L | g | kg]
├── Tanggal Kadaluarsa   (opsional)
└── Tanggal Kedatangan   (opsional)
```

**Edit Reagen:**
- Update semua field reagen
- Modal dengan pre-filled data existing

**Hapus Reagen:**
- Konfirmasi dialog sebelum hapus
- Soft delete: history tetap preserved
- Hanya admin yang bisa menghapus

</details>

---

## 🛠 Tech Stack

### Frontend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| ![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js) | 16.1.1 | React framework dengan App Router, SSR/SSG |
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | 19.2.3 | Library UI dengan hooks modern |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | 5.x | Type safety dan developer experience |
| ![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | 4.x | Utility-first CSS framework |
| ![Lucide](https://img.shields.io/badge/Lucide-F56565?style=flat-square) | 0.562.0 | Modern icon library |

### Backend & Database

| Teknologi | Kegunaan |
|-----------|----------|
| ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white) | Backend-as-a-Service |
| PostgreSQL | Relational database |
| Row Level Security | Data-level security |
| Edge Functions | Serverless functions (Deno) |
| Supabase Auth | Authentication system |

### Libraries Pendukung

| Library | Versi | Kegunaan |
|---------|-------|----------|
| `date-fns` | 4.1.0 | Formatting dan manipulasi tanggal |
| `xlsx` | 0.18.5 | Export data ke Excel |
| `recharts` | 3.6.0 | Visualisasi grafik interaktif |

---

## 🏗 Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Next.js 16 (App Router)                │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │  │
│  │  │   /login    │ │  /register  │ │     / (Dashboard)   │ │  │
│  │  └─────────────┘ └─────────────┘ └─────────────────────┘ │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │                    /history                          │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │                                                           │  │
│  │  Components: ReagentCard | StockModal | AddReagentModal  │  │
│  │              EditReagentModal | FilterBar | StatsCard    │  │
│  │              AuthGuard                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SUPABASE LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Supabase Client                        │  │
│  │  • Authentication (Email/Password, Username lookup)       │  │
│  │  • Database Queries (CRUD operations)                     │  │
│  │  • Real-time Subscriptions (future)                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────┐ ┌───────────────┐ ┌────────────────────┐    │
│  │   reagents    │ │  transactions │ │     profiles       │    │
│  │   (table)     │ │    (table)    │ │     (table)        │    │
│  └───────┬───────┘ └───────┬───────┘ └────────────────────┘    │
│          │                 │                                    │
│          └────────┬────────┘                                    │
│                   │ ON DELETE SET NULL                          │
│                   ▼                                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Edge Function: send-stock-notification       │  │
│  │              (Deno Runtime - Email via Gmail SMTP/Resend) │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Instalasi & Setup

### Prerequisites

- **Node.js** 18.x atau lebih baru
- **npm** atau **yarn**
- Akun **Supabase** (gratis di [supabase.com](https://supabase.com))

### Langkah 1: Clone Repository

```bash
git clone https://github.com/your-username/daftar-reagen.git
cd daftar-reagen
```

### Langkah 2: Install Dependencies

```bash
npm install
# atau
yarn install
```

### Langkah 3: Setup Supabase

1. **Buat Project Baru** di [Supabase Dashboard](https://app.supabase.com)

2. **Buat Tabel Database** dengan SQL berikut:

<details>
<summary><strong>📋 SQL: Create Tables</strong></summary>

```sql
-- Tabel Reagents
CREATE TABLE reagents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('Cair', 'Padat', 'Reagen Suhu 2-8°C')),
  batch_number TEXT,
  arrival_date DATE,
  expiry_date DATE,
  brand TEXT,
  stock NUMERIC NOT NULL DEFAULT 0,
  stock_in NUMERIC NOT NULL DEFAULT 0,
  stock_out NUMERIC NOT NULL DEFAULT 0,
  initial_weight NUMERIC,
  unit TEXT NOT NULL DEFAULT 'ml',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reagent_id UUID REFERENCES reagents(id) ON DELETE SET NULL,
  reagent_name TEXT NOT NULL,
  reagent_unit TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('in', 'out')),
  amount NUMERIC NOT NULL,
  old_stock NUMERIC NOT NULL,
  new_stock NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX idx_transactions_reagent_id ON transactions(reagent_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_reagents_expiry_date ON reagents(expiry_date);
```

</details>

3. **Jalankan Migration** untuk history preservation (opsional jika database baru):

```sql
-- Jalankan isi file: migration-keep-history.sql
```

### Langkah 4: Setup Environment Variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> 💡 Dapatkan values dari **Supabase Dashboard** → **Settings** → **API**

### Langkah 5: Setup Edge Function (Optional)

Untuk mengaktifkan notifikasi email:

```bash
# Install Supabase CLI
npm install -g supabase

# Login ke Supabase
supabase login

# Link ke project
supabase link --project-ref your-project-ref

# Deploy function
supabase functions deploy send-stock-notification

# Set secrets untuk email
supabase secrets set USE_GMAIL=true
supabase secrets set GMAIL_EMAIL=your-email@gmail.com
supabase secrets set GMAIL_APP_PASSWORD=your-app-password
```

### Langkah 6: Jalankan Development Server

```bash
npm run dev
```

🎉 Buka [http://localhost:3000](http://localhost:3000) di browser!

---

## 📁 Struktur Project

```
daftar-reagen/
│
├── 📂 src/
│   ├── 📂 app/                      # Next.js App Router
│   │   ├── 📄 page.tsx              # Dashboard utama (/)
│   │   ├── 📄 layout.tsx            # Root layout dengan AuthGuard
│   │   ├── 📄 globals.css           # Global styles & Tailwind imports
│   │   │
│   │   ├── 📂 history/
│   │   │   └── 📄 page.tsx          # Halaman riwayat transaksi
│   │   │
│   │   ├── 📂 login/
│   │   │   └── 📄 page.tsx          # Halaman login
│   │   │
│   │   └── 📂 register/
│   │       └── 📄 page.tsx          # Halaman registrasi
│   │
│   ├── 📂 components/               # React Components
│   │   ├── 📄 AddReagentModal.tsx   # Modal form tambah reagen
│   │   ├── 📄 EditReagentModal.tsx  # Modal form edit reagen
│   │   ├── 📄 StockModal.tsx        # Modal transaksi stok
│   │   ├── 📄 ReagentCard.tsx       # Card display reagen
│   │   ├── 📄 StatsCard.tsx         # Card statistik dashboard
│   │   ├── 📄 FilterBar.tsx         # Komponen filter dropdown
│   │   └── 📄 AuthGuard.tsx         # HOC untuk protected routes
│   │
│   └── 📂 lib/                      # Utilities & Configuration
│       ├── 📄 supabase.ts           # Supabase client & type definitions
│       └── 📄 utils.ts              # Helper functions (formatDate, etc.)
│
├── 📂 supabase/
│   └── 📂 functions/
│       └── 📂 send-stock-notification/
│           ├── 📄 index.ts          # Edge function handler
│           ├── 📄 deno.json         # Deno configuration
│           └── 📄 function.json     # Function metadata
│
├── 📂 public/                       # Static assets
│
├── 📄 migration-keep-history.sql    # Database migration script
├── 📄 next.config.ts                # Next.js configuration
├── 📄 postcss.config.mjs            # PostCSS configuration
├── 📄 tailwind.config.ts            # Tailwind CSS configuration
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 vercel.json                   # Vercel deployment config
├── 📄 package.json                  # Dependencies & scripts
└── 📄 README.md                     # Dokumentasi project
```

---

## 📚 Dokumentasi Teknis

### Type Definitions

```typescript
// lib/supabase.ts

export type Reagent = {
  id: string
  name: string
  type: 'Cair' | 'Padat' | 'Reagen Suhu 2-8°C' | null
  batch_number: string | null
  arrival_date: string | null
  expiry_date: string | null
  brand: string | null
  stock_in: number
  stock_out: number
  stock: number
  initial_weight: number | null
  unit: string
  created_at: string
  updated_at: string
}

export type Transaction = {
  id: string
  reagent_id: string | null
  reagent_name: string
  reagent_unit: string
  type: 'in' | 'out'
  amount: number
  old_stock: number
  new_stock: number
  notes: string | null
  created_at: string
}
```

### Utility Functions

```typescript
// lib/utils.ts

// Format tanggal ke format Indonesia
formatDate(date: string | null): string
// Output: "14 Jan 2026"

// Cek status kadaluarsa
getExpiryStatus(expiryDate: string | null): 'expired' | 'expiring' | 'valid' | 'none'

// Tentukan level stok berdasarkan berat sediaan
getStockLevel(stock: number, initialWeight?: number | null, unit?: string, type?: string | null): 'low' | 'high'

// Cek apakah user adalah admin
isAdmin(email: string | null | undefined): boolean

// Utility untuk class names
cn(...classes: (string | boolean | undefined)[]): string
```

### Database Schema

```
┌──────────────────────────────────────────────────────────────┐
│                         REAGENTS                              │
├──────────────────────────────────────────────────────────────┤
│ id              │ UUID        │ PK, auto-generated           │
│ name            │ TEXT        │ NOT NULL                     │
│ type            │ TEXT        │ 'Cair'|'Padat'|'Suhu 2-8°C' │
│ batch_number    │ TEXT        │ nullable                     │
│ arrival_date    │ DATE        │ nullable                     │
│ expiry_date     │ DATE        │ nullable                     │
│ brand           │ TEXT        │ nullable                     │
│ stock           │ NUMERIC     │ current stock                │
│ stock_in        │ NUMERIC     │ total masuk                  │
│ stock_out       │ NUMERIC     │ total keluar                 │
│ initial_weight  │ NUMERIC     │ berat sediaan                │
│ unit            │ TEXT        │ 'ml'|'L'|'g'|'kg'           │
│ created_at      │ TIMESTAMPTZ │ auto                         │
│ updated_at      │ TIMESTAMPTZ │ auto                         │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ ON DELETE SET NULL
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                       TRANSACTIONS                            │
├──────────────────────────────────────────────────────────────┤
│ id              │ UUID        │ PK, auto-generated           │
│ reagent_id      │ UUID        │ FK → reagents.id (nullable)  │
│ reagent_name    │ TEXT        │ NOT NULL (preserved)         │
│ reagent_unit    │ TEXT        │ NOT NULL (preserved)         │
│ type            │ TEXT        │ 'in' | 'out'                 │
│ amount          │ NUMERIC     │ jumlah perubahan             │
│ old_stock       │ NUMERIC     │ stok sebelum                 │
│ new_stock       │ NUMERIC     │ stok sesudah                 │
│ notes           │ TEXT        │ catatan transaksi            │
│ created_at      │ TIMESTAMPTZ │ auto                         │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                         PROFILES                              │
├──────────────────────────────────────────────────────────────┤
│ id              │ UUID        │ PK, FK → auth.users          │
│ email           │ TEXT        │ NOT NULL                     │
│ username        │ TEXT        │ UNIQUE, NOT NULL             │
│ full_name       │ TEXT        │ nullable                     │
│ created_at      │ TIMESTAMPTZ │ auto                         │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔐 Keamanan

### 1. Authentication Layer

- ✅ **Supabase Auth** - Secure authentication dengan JWT
- ✅ **Password Hashing** - Bcrypt di server-side
- ✅ **Session Management** - Automatic token refresh
- ✅ **Protected Routes** - `AuthGuard` component

### 2. Authorization Layer

- ✅ **Role-Based Access** - Admin vs User biasa
- ✅ **Double Validation** - Check di client + server
- ✅ **Admin Whitelist** - Hardcoded admin emails

### 3. Data Security

- ✅ **Row Level Security (RLS)** - Database-level security
- ✅ **Environment Variables** - Secrets tidak exposed ke client
- ✅ **Type Safety** - TypeScript mencegah runtime errors
- ✅ **Input Validation** - Form validation + DB constraints

### 4. API Security

- ✅ **HTTPS Only** - Encrypted communication
- ✅ **CORS Headers** - Configured di Edge Functions
- ✅ **API Key Protection** - Anon key dengan RLS

---

## 🌐 Deployment

### Deploy ke Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy ke production
vercel --prod
```

**Environment Variables di Vercel:**

1. Buka **Vercel Dashboard** → Project → **Settings** → **Environment Variables**
2. Tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Konfigurasi Vercel

File `vercel.json` sudah dikonfigurasi:

```json
{
  "framework": "nextjs"
}
```

---

## 🗺 Roadmap

### ✅ Completed (v0.1.0)

- [x] Dashboard dengan statistik real-time
- [x] CRUD reagen lengkap
- [x] Transaksi stok masuk/keluar
- [x] Sistem peringatan kadaluarsa
- [x] Perhitungan stok minimum dinamis
- [x] Riwayat transaksi dengan filter
- [x] Export data ke Excel
- [x] Autentikasi email/username
- [x] Role-based access control
- [x] Email notification via Edge Function
- [x] Soft delete dengan history preservation
- [x] Responsive design (mobile-friendly)

### 🔄 In Progress

- [ ] Grafik analytics lebih detail
- [ ] Performance optimization

### 📋 Planned

- [ ] Real-time updates dengan Supabase Subscriptions
- [ ] Bulk import reagen dari Excel
- [ ] Push notification untuk stok rendah
- [ ] Dashboard analytics advanced
- [ ] Multi-language support (EN/ID)
- [ ] Dark mode
- [ ] Print report ke PDF
- [ ] Barcode/QR code scanner
- [ ] Mobile app (React Native)

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. **Fork** repository ini
2. Buat **branch** baru (`git checkout -b feature/AmazingFeature`)
3. **Commit** perubahan (`git commit -m 'Add some AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. Buat **Pull Request**

---

## 📄 Lisensi

Private Project - All Rights Reserved

---

## 📞 Kontak

Untuk pertanyaan atau dukungan, silakan hubungi tim pengembang.

---

<div align="center">

**PharmStock** - Sistem Manajemen Inventori Reagen Laboratorium

Made with ❤️ using Next.js, React, and Supabase

---

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)

**Last Updated**: January 14, 2026 | **Version**: 0.1.0

</div>
