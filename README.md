# 📦 PharmStock - Sistem Manajemen Inventori Reagen Farmasi

Sistem manajemen inventori reagen farmasi yang profesional dan modern, dibangun dengan Next.js 14, TypeScript, Tailwind CSS, dan Supabase. Dirancang khusus untuk kontrol stok pabrik di industri farmasi.

## ✨ Fitur Utama

### 📊 Dashboard & Monitoring
- **Real-time Dashboard** - Monitor total reagen, stok menipis, kadaluarsa, dan akan kadaluarsa
- **Statistik Lengkap** - Overview stok dengan visual card yang informatif
- **Status Alerts** - Peringatan visual untuk reagen kadaluarsa dan hampir habis

### 🔍 Pencarian & Filter
- **Pencarian Cerdas** - Cari berdasarkan nama, merek, atau nomor batch
- **Filter Lanjutan** - Filter berdasarkan tipe, status kadaluarsa, dan level stok
- **Pengurutan Otomatis** - Diurutkan berdasarkan tren pemakaian (stock_out)

### 📦 Manajemen Stok
- **Stok Masuk/Keluar** - Transaksi stok yang mudah dan cepat
- **Riwayat Transaksi** - Tracking lengkap semua perubahan stok
- **Update Real-time** - Perubahan langsung tersimpan ke database

### 📧 Notifikasi Email
- **Email Otomatis** - Notifikasi saat ada perubahan stok
- **100% Gratis** - Menggunakan Supabase Auth (tanpa pihak ketiga)
- **Format Profesional** - Email HTML dengan styling modern
- **Tanpa Batasan** - Kirim email tanpa rate limit

### 🎨 User Interface
- **Desain Modern** - Interface yang clean dan intuitif
- **Responsive** - Berfungsi sempurna di desktop, tablet, dan mobile
- **Bahasa Indonesia** - Seluruh antarmuka dalam Bahasa Indonesia
- **Dark Mode Ready** - Siap untuk implementasi dark mode

### 🔐 Keamanan & Auth
- **Supabase Authentication** - Login dengan email/password
- **Protected Routes** - Halaman utama hanya bisa diakses setelah login
- **User Management** - Sistem user terintegrasi dengan Supabase Auth

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components dengan Lucide React icons
- **State Management**: React Hooks

### Backend
- **Database**: Supabase (PostgreSQL)
- **Prasyarat
- Node.js 18+ dan npm
- Akun Supabase (gratis)
- Git (untuk deployment)

### 1. Clone & Install
```bash
git clone <repository-url>
cd daftar-reagen
npm install
```

### 2. Setup Supabase

#### A. Buat Project Supabase
1. Buat akun di [supabase.com](https://supabase.com)
2. Buat project baru
3. Tunggu hingga project siap

#### B. Setup Database
Jalankan SQL berikut di Supabase SQL Editor:

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
  stock_in NUMERIC DEFAULT 0,
  stock_out NUMERIC DEFAULT 0,
  stock NUMERIC DEFAULT 0,
  unit TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
### Tabel: `reagents`
| Field | Type | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary key |
| name | TEXT | Nama reagen |
| type | TEXT | Tipe: 'Cair', 'Padat', 'Reagen Suhu 2-8°C' |
| batch_number | TEXT | Nomor batch |
| arrival_date | DATE | Tanggal kedatangan |
| expiry_date | DATE | Tanggal kadaluarsa |
| brand | TEXT | Merek reagen |
| stock_in | NUMERIC | Total stok masuk |
| stock_out | NUMERIC | Total stok keluar |
| stock | NUMERIC | Stok saat ini |
| unit | TEXT | Satuan (ml, g, L, dll) |
| created_at | TIMESTAMPTZ | Waktu dibuat |
| updated_at | TIMESTAMPTZ | Waktu update terakhir |

### Tabel: `transactions`
| Field | Type | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary key |
| reagent_id | UUID | Foreign key ke reagents |
| type | TEXT | 'in' atau 'out' |
| amount | NUMERIC | Jumlah transaksi |
| old_stock | NUMERIC | Stok sebelum transaksi |
| new_stock | NUMERIC | Stok setelah transaksi |
| notes | TEXT | Catatan (optional) |
| created_at | TIMESTAMPTZ | Waktu transaksi |
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reagent_id UUID REFERENCES reagents(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('in', 'out')),
  amount NUMERIC NOT NULL,
  old_stock NUMERIC NOT NULL,
  new_stock NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE reagents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies untuk authenticated users
CREATE POLICY "Allow authenticated users" ON reagents FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users" ON transactions FOR ALL USING (auth.role() = 'authenticated');
```

#### C. Enable Authentication
1. Buka Authentication → Providers di Supabase Dashboard
2. Enable Email Provider
3. Disable email confirmation untuk development (optional)

### 3. Configure Environment Variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Cara mendapatkan credentials:**
1. Buka Supabase Dashboard
2. Ke Settings → API
3. Copy `Project URL` dan `anon/public key`

### 4. Run Development Server

```bash
npm run dev
```

Buk📧 Setup Email Notifikasi

Aplikasi ini dilengkapi dengan fitur email notifikasi otomatis menggunakan Supabase Edge Functions - **100% GRATIS tanpa pihak ketiga!**

### Install Supabase CLI

#### Windows (Scoop)
```powershell
# Install Scoop (jika belum)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# Install Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

#### macOS/Linux
```bash
brew install supabase/tap/supabase
```

### Deploy Edge Function

```bash
# 1. Login ke Supabase
supabase login

# 2. Link project (ganti dengan project ref Anda)
supabase link --project-ref your-project-ref

# 3. Deploy email notification function
supabaCara Penggunaan

### Login & Register
1. **Register** - Buka `/register` untuk membuat akun baru
2. **Login** - Gunakan email dan password untuk masuk
3. **Protected Routes** - Semua halaman utama hanya bisa diakses setelah login

### Dashboard
- **Overview Cards** - Lihat statistik: Total Reagen, Stok Menipis, Kadaluarsa, Akan Kadaluarsa
- **Quick Actions** - Tombol cepat untuk tambah reagen dan lihat riwayat
- **Visual Alerts** - Kartu berwarna merah untuk expired/low stock, kuning untuk expiring soon

### Manajemen Reagen

#### Tambah Reagen Baru
1. Click tombol **"+ Tambah Reagen"**
2. Isi form:
   - Nama reagen (wajib)
   - Tipe: Cair / Padat / Reagen Suhu 2-8°C
   - Nomor Batch
   - Tanggal kedatangan
   - Tanggal kadaluarsa
   - Merek
   - Stok awal (wajib)
   - Satuan (wajib)
3. Click **"Simpan"**

#### Edit Reagen
1. Click tombol **Edit** (ikon pensil) pada kartu reagen
2. Update data yang diperlukan
3. Click **"Simpan Perubahan"**

#### Hapus Reagen
1. Click tombol **Hapus** (ikon tempat sampah) pada kartu reagen
2. Konfirmasi penghapusan
3. Reagen dan semua transaksi terkait akan dihapus

#### Kelola Stok
1. Click tombol **"Kelola Stok"** pada kartu reagen
2. Pilih jenis transaksi:
   - **Stok Masuk** - Untuk penambahan stok
   - **Stok Keluar** - Untuk pengurangan stok (pemakaian)
3. Masukkan jumlah
4. Tambahkan catatan (optional)
5. Click **"Simpan"**
6. Email notifikasi otomatis terkirim

### Pencarian & Filter

#### Pencarian
- Ketik di search box untuk mencari berdasarkan:
  - Nama reagen
  - Merek
  - Nomor batch

#### Filter
- **Filter Tipe** - Cair, Padat, Reagen Suhu 2-8°C
- **Filter Status Kadaluarsa** - Semua, Kadaluarsa, Akan Kadaluarsa, Belum Kadaluarsa
- **Filter Stok** - Semua, Stok Menipis (<10)

### Riwayat Transaksi
1. Click tombol **"Riwayat"** di header
2. Lihat semua transaksi stok masuk/keluar
3. Detail: tanggal, reagen, tipe, jumlah, stok lama/baru, catatan
4. Sorted by terbaru di atas

---

## 🔒 Security & Best Practices

### Keamanan
- ✅ **Row Level Security (RLS)** enabled di Supabase
- ✅ **Authentication Required** untuk semua operasi
- ✅ **Protected Routes** menggunakan AuthGuard
- ✅ **Environment Variables** tidak di-commit ke git
- ✅ **HTTPS** otomatis di production (Vercel)

### Best Practices
- Database queries menggunakan Supabase client
- Error handling yang proper
- Loading states untuk UX yang baik
- Responsive design untuk semua device
- Email notifikasi non-blocking (async)

---

## 📁 Struktur Project

```
daftar-reagen/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Dashboard utama
│   │   ├── layout.tsx         # Root layout
│   │   ├── login/             # Halaman login
│   │   ├── register/          # Halaman register
│   │   └── history/           # Halaman riwayat transaksi
│   ├── components/            # React Components
│   │   ├── AddReagentModal.tsx
│   │   ├── EditReagentModal.tsx
│   │   ├── StockModal.tsx
│   │   ├── AuthGuard.tsx
│   │   ├── FilterBar.tsx
│   │   ├── ReagentCard.tsx
│   │   └── StatsCard.tsx
│   └── lib/                   # Utilities
│       ├── supabase.ts        # Supabase client & types
│       └── utils.ts           # Helper functions
├── supabase/
│   └── functions/             # Edge Functions
│       └── send-stock-notification/
│           ├── index.ts       # Email notification function
│           ├── deno.json      # Deno config
│           └── function.json  # Function metadata
├── public/                    # Static assets
├── .env.local                 # Environment variables (tidak di-commit)
├── .vercelignore             # Files to ignore saat deploy Vercel
├── vercel.json               # Vercel configuration
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies & scripts
└── README.md                 # Dokumentasi ini
```

---

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Supabase CLI Commands

```bash
# Login ke Supabase
supabase login

# Link ke project
supabase link --project-ref your-project-ref

# Deploy Edge Function
supabase functions deploy send-stock-notification

# List functions
supabase functions list

# View logs
supabase functions logs send-stock-notification

# Delete function (jika perlu)
supabase functions delete send-stock-notification
```

---

## 🎯 Roadmap & Future Features

- [ ] Export data ke Excel/CSV
- [ ] Print labels untuk reagen
- [ ] Barcode/QR code scanning
- [ ] Multi-user dengan role management
- [ ] Email reminder untuk reagen hampir kadaluarsa
- [ ] Dashboard analytics & reports
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Integration dengan sistem ERP

---

## 🐛 Known Issues & Limitations

1. **Email di Spam** - Email pertama mungkin masuk spam (tandai sebagai "Not Spam")
2. **TypeScript Errors di VS Code** - Error di folder `supabase/functions` adalah normal (Deno runtime)
3. **Email Formatting** - Beberapa email client mungkin render HTML berbeda

---

## 💡 Tips & Tricks

### Performance
- Database indexes sudah dioptimalkan
- Edge Functions menggunakan Deno (lebih cepat dari Node.js)
- Vercel CDN untuk assets static

### Monitoring
```bash
# Check Edge Function status
supabase functions list

# View recent logs
supabase functions logs send-stock-notification --limit 50

# Monitor real-time logs
supabase functions logs send-stock-notification --follow
```

### Backup Database
```bash
# Export dari Supabase Dashboard
Settings → Database → Backups

# Atau gunakan pg_dump (advanced)
```

---

## 🤝 Contributing

Contributions are welcome! Jika ingin berkontribusi:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**PharmStock Development Team**

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Vercel](https://vercel.com/) - Deployment platform
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library

---

## 📞 Support

Jika mengalami masalah atau punya pertanyaan:

1. Check dokumentasi di atas
2. Lihat Supabase logs: `supabase functions logs send-stock-notification`
3. Check browser console (F12) untuk error frontend
4. Verifikasi environment variables sudah benar

---

**Happy Coding! 🚀**a mungkin masuk ke folder Spam. Tandai sebagai "Not Spam".

---

## 🌐 Deploy to Production

### A. Deploy ke Vercel

#### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Import ke Vercel
1. Buka [vercel.com](https://vercel.com) dan sign in dengan GitHub
2. Click "Add New Project"
3. Select repository Anda
4. Click "Import"

#### 3. Configure Environment Variables ⚠️ PENTING
Tambahkan di Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

#### 4. Deploy
- Click "Deploy"
- Tunggu build selesai (~2 menit)
- Aplikasi live di `your-project.vercel.app`

### B. Deploy Edge Function ke Supabase

Edge Function sudah otomatis deployed saat menjalankan:
```bash
supabase functions deploy send-stock-notification
```

**Function URL akan otomatis tersedia di:**
```
https://your-project.supabase.co/functions/v1/send-stock-notification
```

### Verifikasi Deployment

1. **Cek Vercel:**
   - Buka URL production Anda
   - Test login dan fungsi aplikasi

2. **Cek Edge Function:**
   ```bash
   supabase functions list
   ```
   
   Output:
   ```
   NAME                           STATUS    REGION
   send-stock-notification        ACTIVE    us-east-1
   ```

3. **Test Email di Production:**
   - Login ke aplikasi production
   - Kelola stok
   - Cek email masuk

### Troubleshooting

**Build Error di Vercel:**
- Pastikan environment variables sudah diset
- Variables harus prefix `NEXT_PUBLIC_`
- Test build lokal: `npm run build`

**Email Tidak Terkirim:**
```bash
# Cek logs Edge Function
supabase functions logs send-stock-notification

# Re-deploy jika perlu
supabase functions deploy send-stock-notification
```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "Add New Project"
   - Select your `Sistem-Data-Reagen` repository
   - Click "Import"

3. **Configure Environment Variables** ⚠️ IMPORTANT
   - Before deploying, add these environment variables in Vercel:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://omordpoktvfysdlcgeim.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   - Get from: `.env.local` file or Supabase Dashboard → Project Settings → API

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-project.vercel.app`

### Troubleshooting Build Errors

If you get "supabaseUrl is required" error:
- Make sure environment variables are set in Vercel dashboard
- Variables must start with `NEXT_PUBLIC_` to be accessible in client

## 📖 Usage

- **Add Reagent**: Click "+ Add Reagent" button
- **Manage Stock**: Click "Manage Stock" on any card
- **Filter**: Use search and filter controls
- **Alerts**: Red = Expired/Low Stock, Yellow = Expiring Soon

## 🔒 Security

⚠️ Default setup uses public access. For production:
- Implement Supabase Auth
- Update RLS policies
- Add rate limiting

## 📄 License

MIT License
