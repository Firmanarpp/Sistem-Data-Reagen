# 🎤 Script Presentasi PharmStock
## Sistem Manajemen Inventori Reagen Laboratorium

---

## 📌 PEMBUKAAN (1 menit)

**Assalamualaikum Wr. Wb. / Selamat [pagi/siang/sore],**

Perkenalkan, saya [NAMA ANDA] akan mempresentasikan website **PharmStock** - sistem manajemen inventori reagen laboratorium yang telah kami kembangkan.

**PharmStock** adalah aplikasi web berbasis cloud untuk mengelola stok reagen laboratorium dengan fitur lengkap meliputi:

✅ Dashboard monitoring real-time  
✅ Sistem peringatan kadaluarsa otomatis  
✅ Tracking transaksi stok lengkap  
✅ Notifikasi email setiap transaksi  
✅ Role-based access control (Admin & User)  

Mari saya paparkan fitur-fitur website ini secara detail.

---

## 🎯 DEMO WEBSITE & FITUR (12-15 menit)

### 1. DASHBOARD UTAMA (2 menit)

**[Tampilkan layar dashboard]**

"Ini adalah halaman utama PharmStock. Mari saya jelaskan komponen-komponennya:"

**A. Statistics Cards (bagian atas)**
```
- Total Reagen: [angka] - menampilkan jumlah seluruh reagen
- Kadaluarsa: [angka] - reagen yang sudah expired (warna merah)
- Akan Kadaluarsa: [angka] - dalam 90 hari (warna kuning)
- Stok Rendah: [angka] - di bawah minimum (warna merah)
```

**B. Search & Filter System**
"Sistem filter yang powerful untuk menemukan reagen dengan cepat:"

```
🔍 Search Box → ketik nama reagen, brand, atau batch number
📋 Filter Tipe → Cair, Padat, atau Reagen Suhu 2-8°C
📅 Filter Kadaluarsa → Expired, Akan Expired, atau Valid
📊 Filter Stok → Rendah atau Cukup
🔄 Sort → Berdasarkan nama alfabetis atau pemakaian tertinggi
```

**Contoh penggunaan:**
"Misalnya saya ingin melihat reagen cair yang stoknya rendah..."
*[Lakukan filter demo]*

**C. Reagent Cards**
"Setiap reagen ditampilkan dalam card yang informatif:"

```
┌────────────────────────────────────────────┐
│ Nama Reagen                    [Edit][🗑️]  │
├────────────────────────────────────────────┤
│ 🧪 Tipe: Cair                              │
│ 🏷️  Brand: Merck                           │
│ 🔢 Batch: ABC123                           │
│ 📦 Stok: 45 ml (⚠️ RENDAH)                 │
│ 📅 Kadaluarsa: 20 Apr 2026                 │
│ 📊 Pemakaian: 120 ml keluar                │
│                                             │
│        [📋 KELOLA STOK]                    │
└────────────────────────────────────────────┘
```

**D. Sortir & Informasi**
"Sistem menampilkan jumlah reagen yang terfilter vs total:"
- Sortir berdasarkan nama (A-Z)
- Sortir berdasarkan pemakaian tertinggi
- Informasi: "Menampilkan X dari Y reagen"

---

### 2. MANAJEMEN STOK - CORE FEATURE (2-3 menit)

**[Klik tombol "Kelola Stok" pada salah satu reagen]**

"Ini adalah fitur utama untuk mencatat transaksi stok:"

**A. Stock In (Stok Masuk)**
```
Scenario: Reagen baru datang dari supplier

1. Pilih tab "Stok Masuk"
2. Input jumlah: 100 ml
3. Tambahkan notes: "Pengadaan bulan Januari 2026"
4. Klik "Simpan"

Hasil:
✓ Stok otomatis bertambah
✓ Transaksi tercatat di history
✓ Email notifikasi terkirim
✓ stock_in terakumulasi
```

**B. Stock Out (Stok Keluar)**
```
Scenario: Lab menggunakan reagen untuk testing

1. Pilih tab "Stok Keluar"
2. Input jumlah: 25 ml
3. Tambahkan notes: "Uji QC batch #456"
4. Klik "Simpan"

Hasil:
✓ Stok otomatis berkurang
✓ Validasi: tidak bisa melebihi stok tersedia
✓ Transaksi tercatat
✓ stock_out terakumulasi
✓ Email notifikasi terkirim
```

**C. Email Notification**
*[Tunjukkan contoh email]*

"Setiap transaksi, sistem otomatis mengirim email seperti ini:"
```
📦 Notifikasi Perubahan Stok

🧪 Nama Reagen: Asam Sulfat
📋 Jenis Transaksi: Stok Keluar
📊 Jumlah: 25 ml
📉 Stok Sebelumnya: 100 ml
📈 Stok Sekarang: 75 ml
📝 Catatan: Uji QC batch #456
```

---

### 3. SISTEM PERINGATAN OTOMATIS (1-2 menit)

"PharmStock memiliki intelligent warning system:"

**A. Peringatan Kadaluarsa**

```
Sistem mendeteksi dan menampilkan badge HANYA untuk reagen yang bermasalah:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 KADALUARSA (Badge Merah)
   → Tanggal kadaluarsa sudah terlewati
   → Badge: "⚠️ Kadaluarsa"
   → Muncul di pojok kanan card reagen

🟡 AKAN KADALUARSA (Badge Kuning)
   → Kadaluarsa dalam 90 hari (3 bulan)
   → Badge: "⏰ Akan Kadaluarsa"
   → Muncul di pojok kanan card reagen

✅ VALID (Tidak Ada Badge)
   → Lebih dari 90 hari
   → Tidak ada badge ditampilkan
   → Card reagen normal tanpa warning

⚪ TANPA TANGGAL (Tidak Ada Badge)
   → Reagen tanpa tanggal kadaluarsa
   → Tidak ada badge ditampilkan
```

**Cara Kerja:**
"Sistem hanya menampilkan warning badge untuk reagen yang perlu perhatian khusus. Jika reagen masih aman (valid), tidak ada badge yang muncul agar tampilan lebih clean."

**B. Perhitungan Stok Minimum Dinamis**

"Yang membuat sistem ini intelligent adalah perhitungan minimum stok yang dinamis berdasarkan berat sediaan:"

```
┌──────────────────────────────────────────────────┐
│  BERAT SEDIAAN  │  MINIMUM STOK  │  KATEGORI     │
├──────────────────────────────────────────────────┤
│  ≤ 10 g/ml      │       2        │  Specialty    │
│  ≤ 25 g/ml      │       5        │  Small Pack   │
│  ≤ 50 g/ml      │       8        │  Standard     │
│  ≤ 100 g/ml     │      20        │  Medium       │
│  ≤ 250 g/ml     │      40        │  Regular Use  │
│  ≤ 500 g/ml     │      75        │  Large Pack   │
│  > 500 g/ml     │     150        │  Bulk/High    │
└──────────────────────────────────────────────────┘
```

**Contoh:**
- Reagen A: Berat sediaan 100 ml → Minimum stok 20 unit
- Reagen B: Berat sediaan 500 ml → Minimum stok 75 unit

"Jadi sistem tidak menggunakan angka flat, tapi disesuaikan dengan karakteristik masing-masing reagen."

---

### 4. RIWAYAT TRANSAKSI (2 menit)

**[Navigasi ke halaman History]**

"Halaman History adalah audit trail lengkap:"

**A. Filter Options**
```
📅 Tanggal: [01/01/2026] sampai [14/01/2026]
🔍 Nama Reagen: [ketik untuk search]
🏷️  Batch Number: [filter by batch]
🏢 Brand: [filter by brand]

[TERAPKAN FILTER] [RESET]
```

**B. Transaction List**
```
┌───────────────────────────────────────────────────────┐
│ 14 Jan 2026, 10:30                                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ 🧪 Asam Sulfat (Merck - Batch: ABC123)               │
│ ⬇️ STOK KELUAR                                        │
│ 📊 Jumlah: 25 ml                                      │
│ 📉 Perubahan: 100 ml → 75 ml                          │
│ 📝 Catatan: Uji QC batch #456                         │
└───────────────────────────────────────────────────────┘
```

**C. Data Preservation**
"Point penting: Ketika reagen dihapus, history TIDAK hilang!"

```
Reagen dihapus? Tidak masalah!
✓ reagent_name tetap tersimpan
✓ reagent_unit tetap tersimpan
✓ Tampilan: "[Nama Reagen] (dihapus)"
✓ Data historis aman untuk audit
```

**D. Informasi Filter**
- Menampilkan jumlah hasil filter
- Tampilan tabel responsif
- Data tetap tersimpan meski reagen dihapus

---

### 5. CRUD REAGEN - Admin Features (1-2 menit)

"Untuk admin, tersedia fitur manajemen reagen lengkap:"

**A. Tambah Reagen Baru**
*[Demo klik tombol "Tambah Reagen"]*

```
Form Input:
┌────────────────────────────────────┐
│ Nama Reagen: [Natrium Hidroksida] │
│ Jenis: [🔽 Padat]                 │
│ Brand: [Merck]                     │
│ Batch: [NaOH-001]                  │
│ Stok Awal: [50]                    │
│ Berat Sediaan: [100]               │
│ Satuan: [🔽 g]                    │
│ Tanggal Kadaluarsa: [📅]          │
│ Tanggal Kedatangan: [📅]          │
│                                    │
│    [BATAL]  [SIMPAN REAGEN]       │
└────────────────────────────────────┘
```

**B. Edit Reagen**
- Klik icon pensil di card reagen
- Update informasi yang diperlukan
- Simpan perubahan

**C. Hapus Reagen**
- Klik icon tempat sampah
- Konfirmasi dialog
- Soft delete: history preserved

**Validasi:**
"Semua operasi admin di-validate double:"
- ✅ Check di frontend (UI)
- ✅ Check di backend (database)
- ✅ Hanya email admin yang bisa akses

---

### 6. AUTENTIKASI & ROLE MANAGEMENT (1 menit)

**A. Login System**
```
Fleksibel Login:
1. Email + Password
   → user@example.com
   
2. Username + Password
   → johndoe
   
Sistem otomatis detect dan lookup
```

**B. User Roles**

```
┌─────────────────────────────────────────────────┐
│           ADMIN vs USER BIASA                   │
├─────────────────────────────────────────────────┤
│ Fitur              │  Admin  │  User Biasa      │
├─────────────────────────────────────────────────┤
│ View Dashboard     │   ✅    │      ✅          │
│ View History       │   ✅    │      ✅          │
│ Filter & Search    │   ✅    │      ✅          │
│ Tambah Reagen      │   ✅    │      ❌          │
│ Edit Reagen        │   ✅    │      ❌          │
│ Hapus Reagen       │   ✅    │      ❌          │
│ Transaksi Stok     │   ✅    │      ❌          │
└─────────────────────────────────────────────────┘

Admin Emails:
• gmpsmg@gmail.com
• projectfarmasi26@gmail.com
```

**C. Security**
- Protected routes dengan AuthGuard
- Session management otomatis
- Auto-redirect berdasarkan auth status

---

## 🛠 TEKNOLOGI & ARSITEKTUR (3-4 menit)

"PharmStock dibangun dengan teknologi modern dan scalable:"

### Tech Stack

```
┌────────────────────────────────────────────────┐
│              FRONTEND LAYER                    │
├────────────────────────────────────────────────┤
│ • Next.js 16 - React framework terbaru         │
│   (App Router, Server Components)              │
│ • React 19 - UI library modern                 │
│ • TypeScript - Type safety                     │
│ • Tailwind CSS 4 - Styling responsive         │
│ • Lucide React - Icon library                  │
└────────────────────────────────────────────────┘
           ↓ HTTPS Communication ↓
┌────────────────────────────────────────────────┐
│              BACKEND LAYER                     │
├────────────────────────────────────────────────┤
│ • Supabase - Backend-as-a-Service             │
│   - PostgreSQL Database                        │
│   - Authentication (JWT)                       │
│   - Row Level Security                         │
│   - Edge Functions (Deno - Email)              │
└────────────────────────────────────────────────┘
```

### Penjelasan Teknologi:

**1. Next.js 16 (Frontend Framework)**
- React-based framework untuk production
- App Router untuk routing modern
- Server-side rendering (SSR) untuk performance
- Optimized bundle size

**2. TypeScript**
- Type safety mencegah error
- Better developer experience
- Auto-completion di IDE

**3. Tailwind CSS 4**
- Utility-first CSS framework
- Responsive design built-in
- Konsisten styling

**4. Supabase (Backend)**
- Open-source Firebase alternative
- PostgreSQL database (reliable & powerful)
- Built-in authentication
- Real-time capabilities
- Edge Functions untuk serverless logic

### Keunggulan Arsitektur:

```
✅ PERFORMANCE
   • Fast page loads
   • Optimized assets
   • Server-side rendering

✅ SCALABILITY  
   • Cloud-based (Supabase)
   • Auto-scaling database
   • CDN distribution

✅ SECURITY
   • JWT authentication
   • Row Level Security
   • HTTPS encryption
   • Type-safe codebase

✅ MAINTAINABILITY
   • Modular component architecture
   • Clear code structure
   • Well-documented
```

---

## 🔐 KEAMANAN WEBSITE (2-3 menit)

"Keamanan adalah prioritas utama:"

### Multi-Layer Security

```
┌───────────────────────────────────────────────┐
│ Layer 1: AUTHENTICATION                       │
├───────────────────────────────────────────────┤
│ • Supabase Auth (JWT tokens)                  │
│ • Password hashing (bcrypt)                   │
│ • Session management                          │
│ • Auto token refresh                          │
└───────────────────────────────────────────────┘

┌───────────────────────────────────────────────┐
│ Layer 2: AUTHORIZATION                        │
├───────────────────────────────────────────────┤
│ • Role-based access control                   │
│ • Admin whitelist                             │
│ • Double validation (client + server)         │
│ • Protected routes (AuthGuard)                │
└───────────────────────────────────────────────┘

┌───────────────────────────────────────────────┐
│ Layer 3: DATA SECURITY                        │
├───────────────────────────────────────────────┤
│ • Row Level Security (RLS)                    │
│ • Environment variables                       │
│ • Input validation                            │
│ • SQL injection prevention                    │
└───────────────────────────────────────────────┘

┌───────────────────────────────────────────────┐
│ Layer 4: COMMUNICATION                        │
├───────────────────────────────────────────────┤
│ • HTTPS only                                  │
│ • CORS configuration                          │
│ • API key protection                          │
└───────────────────────────────────────────────┘
```

**Compliance:**
- Audit trail lengkap dengan timestamp
- Data integrity dengan foreign key constraints
- Automatic backup di Supabase cloud

---

## 🚀 DEPLOYMENT & AKSES (2 menit)

**Status Deployment:**
```
✅ Development: Complete
✅ Testing: Passed
✅ Ready for production
```

**Deployment Platform:**

```
VERCEL (Recommended)
├─ Platform: Cloud hosting Next.js
├─ Deployment: Git-based (auto-deploy)
├─ Performance: Global CDN
├─ Uptime: 99.9% guaranteed
├─ SSL: Automatic HTTPS
└─ Cost: FREE tier available
```

**Cara Deploy:**
```bash
1. Push code ke GitHub repository
2. Connect Vercel ke repo
3. Set environment variables
4. Deploy → Live dalam 2 menit!
```

**Akses Website:**
- **URL**: https://[project-name].vercel.app
- **Custom domain**: Bisa setup domain sendiri
- **Mobile**: Fully responsive, akses dari HP/tablet
- **Browser support**: Chrome, Firefox, Safari, Edge

**Scalability:**
```
✓ Bisa handle ribuan reagen
✓ Multi-user concurrent access  
✓ Auto-scaling infrastructure
✓ 24/7 availability
```

---

## 📱 RESPONSIVE DESIGN (1 menit)

"Website ini fully responsive untuk semua device:"

**Desktop (> 1024px)**
```
┌──────────────────────────────────────────┐
│  Header: Logo | Nav Menu | User Info    │
├──────────────────────────────────────────┤
│  [Stats Cards - 4 columns]               │
├──────────────────────────────────────────┤
│  [Filter Bar - Full width]               │
├──────────────────────────────────────────┤
│  [Reagent Cards - 3 columns grid]        │
└──────────────────────────────────────────┘
```

**Tablet (768px - 1024px)**
```
┌────────────────────────────────┐
│  Header: Logo | Hamburger      │
├────────────────────────────────┤
│  [Stats Cards - 2 columns]     │
├────────────────────────────────┤
│  [Filter Bar - Stacked]        │
├────────────────────────────────┤
│  [Reagent Cards - 2 columns]   │
└────────────────────────────────┘
```

**Mobile (< 768px)**
```
┌──────────────────┐
│  Logo | Menu ☰   │
├──────────────────┤
│  [Stats - Stack] │
├──────────────────┤
│  [Filter - Stack]│
├──────────────────┤
│  [Cards - Stack] │
└──────────────────┘
```

**Touch-Friendly:**
- Button size minimal 44x44px
- Spacing untuk finger tap
- Swipe gestures support

---

## 📈 FUTURE ENHANCEMENTS (1-2 menit)

**Phase 1: COMPLETED ✅**
```
✓ Core inventory management
✓ Transaction tracking
✓ Alert system (expiry & low stock)
✓ Email notifications
✓ User authentication & authorization
✓ Advanced filter & search
✓ Responsive design (mobile-ready)
```

**Phase 2: PLANNED 🔄 (Q2 2026)**
```
□ Export to Excel feature
□ Bulk import dari Excel
□ Real-time updates (Supabase subscriptions)
□ Push notifications mobile
□ Advanced analytics dashboard
□ Barcode/QR code scanning
□ Print report PDF
```

**Phase 3: FUTURE 🔮 (Q3-Q4 2026)**
```
□ Mobile app native (iOS/Android)
□ Dark mode theme
□ Multi-language support (EN/ID)
□ Integration API untuk ERP
□ AI-powered demand forecasting
□ Grafik visualisasi Recharts
```

---

## 🎬 PENUTUP (1 menit)

### Summary Website:

**PharmStock** adalah website manajemen inventori reagen dengan fitur:

✅ **Dashboard real-time** - Monitoring kondisi stok sekilas  
✅ **Intelligent alerts** - Peringatan kadaluarsa & stok rendah  
✅ **Complete history** - Audit trail lengkap  
✅ **Email notification** - Otomatis setiap transaksi  
✅ **Role-based access** - Admin & User terpisah  
✅ **Modern tech stack** - Next.js 16, React 19, Supabase  
✅ **Fully responsive** - Desktop, tablet, mobile  
✅ **Secure** - Multi-layer security  

**Website ini siap digunakan dan dapat diakses kapan saja, dari mana saja.**

---

## 🙋 Q&A PREPARATION

### Pertanyaan Teknis yang Mungkin Muncul:

**Q: Website ini online atau offline?**
A: Online (cloud-based). Memerlukan koneksi internet untuk akses. Data tersimpan di cloud (Supabase) yang aman dan ter-backup otomatis.

**Q: Apakah data aman?**
A: Ya, sangat aman. Menggunakan:
- Enkripsi HTTPS untuk semua komunikasi
- JWT authentication
- Row Level Security di database
- Password hashing dengan bcrypt
- Supabase enterprise-grade infrastructure

**Q: Berapa lama training untuk menggunakan website ini?**
A: Sangat mudah digunakan:
- User biasa: 15-30 menit
- Admin: 1-2 jam
- Interface intuitif, tidak butuh technical skill khusus

**Q: Bisa akses dari HP?**
A: Ya! Website fully responsive. Bisa dibuka dari:
- Desktop/Laptop
- Tablet
- Smartphone (Android/iOS)
- Semua browser modern (Chrome, Firefox, Safari, Edge)

**Q: Bagaimana jika lupa password?**
A: Sistem Supabase Auth sudah support reset password via email (bisa diaktifkan).

**Q: Berapa user yang bisa akses bersamaan?**
A: Unlimited. Supabase bisa handle banyak concurrent users tanpa masalah.

**Q: Data di-backup?**
A: Ya, Supabase melakukan automatic backup harian. Data sangat aman.

**Q: Bisa custom fitur tambahan?**
A: Ya! Code base sangat modular dan well-documented. Easy to extend untuk kebutuhan spesifik.

**Q: Integrasi dengan sistem lain?**
A: Bisa! Supabase menyediakan REST API dan GraphQL. Bisa integrasi dengan sistem ERP atau aplikasi lain.

**Q: Biaya maintenance website?**
A: Minimal. Dengan Supabase free tier + Vercel free tier, bisa gratis untuk usage normal. Kalau scaling besar, estimasi Rp 500rb - 1 juta/bulan.

**Q: Kalau ada bug atau error?**
A: Code sudah di-test dan TypeScript membantu prevent error. Jika ada issue, code modular memudahkan debugging dan fix.

**Q: Performa website bagaimana?**
A: Sangat cepat!
- Next.js 16 dengan SSR
- Optimized bundle size
- CDN delivery via Vercel
- Load time < 2 detik

**Q: Database bisa menampung berapa ribu data?**
A: PostgreSQL sangat scalable. Bisa handle jutaan records tanpa masalah. Untuk use case laboratorium, lebih dari cukup.

---

## 📞 DOKUMENTASI & DEMO

**Untuk live demo atau melihat dokumentasi lengkap:**

📧 Email: [email anda]  
📱 WhatsApp: [nomor anda]  
🌐 Documentation: README.md (ada di repository)  
💻 Live Demo: [URL website jika sudah deploy]  

**Repository:**
- Code tersimpan di Git repository
- Lengkap dengan dokumentasi
- Setup instructions detail

---

## 🎯 KESIMPULAN

"PharmStock adalah website modern untuk manajemen inventori reagen laboratorium."

**Key Features:**
1. ✅ Dashboard monitoring real-time
2. ✅ Sistem peringatan otomatis (kadaluarsa & stok rendah)
3. ✅ Tracking transaksi lengkap dengan history
4. ✅ Email notification setiap transaksi
5. ✅ Role-based access control
6. ✅ Fully responsive (desktop/mobile)
7. ✅ Secure & reliable

**Tech Stack Modern:**
- Next.js 16 + React 19
- TypeScript untuk code quality
- Supabase untuk backend
- Deployment via Vercel

**Website ini ready untuk digunakan dan mudah di-maintain untuk jangka panjang.**

"Terima kasih atas perhatiannya. Apakah ada pertanyaan?"

---

## 📝 TIPS PRESENTASI

### Do's:
✅ Demo langsung adalah yang paling penting  
✅ Jelaskan setiap fitur dengan contoh konkret  
✅ Tunjukkan UI yang user-friendly  
✅ Highlight teknologi modern yang digunakan  
✅ Siap jawab pertanyaan teknis  
✅ Antusias tapi tetap profesional  

### Don'ts:
❌ Terlalu banyak jargon teknis di awal  
❌ Berbicara terlalu cepat  
❌ Skip demo (ini paling powerful!)  
❌ Fokus pada code (kecuali audience technical)  
❌ Over-promise fitur yang belum ada  

### Presentation Flow:
```
1. Intro singkat → 1 menit
2. Demo Dashboard → 2 menit
3. Demo Manajemen Stok → 3 menit
4. Demo Peringatan & History → 3 menit
5. Demo CRUD & Auth → 3 menit
6. Tech Stack & Security → 4 menit
7. Deployment & Future → 2 menit
8. Q&A → flexible
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 18-20 menit + Q&A
```

### Demo Tips:
```
✓ Prepare dummy data yang realistis
✓ Test semua fitur sebelum presentasi
✓ Siapkan screenshot backup jika ada masalah internet
✓ Highlight responsive design (resize browser window)
✓ Tunjukkan speed (loading cepat)
```

---

**GOOD LUCK! 🎉**

*Script ini fokus pada fitur dan teknologi website. Sesuaikan dengan durasi dan audience anda!*
