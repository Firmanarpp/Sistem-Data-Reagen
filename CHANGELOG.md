# Changelog - Pembaruan Aplikasi

## Tanggal: 10 Januari 2026

### ✨ Fitur Baru

#### 1. Tombol Hapus Reagen
- **Lokasi**: Di sebelah tombol Edit pada setiap kartu reagen
- **Fungsi**: Menghapus reagen dari database
- **Keamanan**: Meminta konfirmasi sebelum menghapus
- **Icon**: Trash2 (ikon tempat sampah)

#### 2. Notifikasi Email untuk Manajemen Stok
- **Fungsi**: Mengirim email otomatis ke user yang sedang login saat melakukan transaksi stok
- **Informasi yang dikirim**:
  - Nama reagen
  - Jenis transaksi (Stok Masuk/Keluar)
  - Jumlah perubahan
  - Stok lama dan baru
  - Catatan transaksi
- **Setup**: Lihat file `EMAIL_SETUP.md` untuk panduan lengkap
- **Catatan**: Email tidak akan menghentikan proses transaksi jika gagal

#### 3. Pencarian dengan No. Batch
- **Lokasi**: Search box di halaman utama
- **Fungsi**: Sekarang bisa mencari reagen berdasarkan:
  - Nama reagen
  - Merek
  - Nomor Batch
- **Placeholder**: "Cari berdasarkan nama, merek, atau no. batch..."

#### 4. Pengurutan Berdasarkan Tren Pemakaian
- **Fungsi**: Reagen otomatis diurutkan berdasarkan tren pemakaian (stock_out)
- **Urutan**: Reagen yang paling sering digunakan muncul di atas
- **Implementasi**: Data diurutkan dari nilai stock_out tertinggi

### 🇮🇩 Bahasa Indonesia

Seluruh antarmuka aplikasi telah diubah ke Bahasa Indonesia:

#### Halaman Utama (Dashboard)
- "Total Reagents" → "Total Reagen"
- "Low Stock" → "Stok Menipis"
- "Expired" → "Kadaluarsa"
- "Expiring Soon" → "Akan Kadaluarsa"
- "Search by name or brand..." → "Cari berdasarkan nama, merek, atau no. batch..."
- "Add Reagent" → "Tambah Reagen"
- "History" → "Riwayat"
- "Logout" → "Keluar"
- "Loading reagents..." → "Memuat reagen..."
- "No reagents found" → "Tidak ada reagen ditemukan"

#### Kartu Reagen
- "Type" → "Jenis"
- "Brand" → "Merek"
- "Arrival" → "Tgl Masuk"
- "Expiry" → "Tgl Kadaluarsa"
- "Current Stock" → "Stok Saat Ini"
- "Low stock alert" → "Stok menipis"
- "Manage Stock" → "Kelola Stok"
- "Edit reagent" → "Edit reagen"
- "Expired" → "Kadaluarsa"
- "Expiring" → "Akan Kadaluarsa"

#### Modal Kelola Stok
- "Manage Stock" → "Kelola Stok"
- "Current Stock" → "Stok Saat Ini"
- "Expires" → "Kadaluarsa"
- "Transaction Type" → "Jenis Transaksi"
- "Stock In" → "Stok Masuk"
- "Stock Out" → "Stok Keluar"
- "Amount" → "Jumlah"
- "Notes (Optional)" → "Catatan (Opsional)"
- "Preview" → "Pratinjau"
- "Adding" → "Menambah"
- "Removing" → "Mengurangi"
- "New Stock" → "Stok Baru"
- "Cancel" → "Batal"
- "Confirm Transaction" → "Konfirmasi Transaksi"
- "Processing..." → "Memproses..."
- "Insufficient stock!" → "Stok tidak mencukupi!"
- "Failed to update stock" → "Gagal memperbarui stok"

#### Modal Tambah Reagen
- "Add New Reagent" → "Tambah Reagen Baru"
- "Name" → "Nama"
- "Type" → "Jenis"
- "Brand" → "Merek"
- "Initial Stock" → "Stok Awal"
- "Unit" → "Satuan"
- "Arrival Date" → "Tanggal Masuk"
- "Expiry Date" → "Tanggal Kadaluarsa"
- "Adding..." → "Menambahkan..."
- "Add Reagent" → "Tambah Reagen"
- "Failed to add reagent" → "Gagal menambahkan reagen"

#### Modal Edit Reagen
- "Edit Reagent" → "Edit Reagen"
- "Current Stock" → "Stok Saat Ini"
- "Note: Edit stock here only..." → "Catatan: Edit stok di sini hanya untuk memperbaiki kesalahan input awal..."
- "Saving..." → "Menyimpan..."
- "Save Changes" → "Simpan Perubahan"
- "Failed to update reagent" → "Gagal memperbarui reagen"

#### Filter Bar
- "All Types" → "Semua Jenis"
- "All Status" → "Semua Status"
- "Expired" → "Kadaluarsa"
- "Expiring Soon" → "Akan Kadaluarsa"
- "All Stock Levels" → "Semua Level Stok"
- "Low Stock" → "Stok Rendah"
- "Medium Stock" → "Stok Sedang"
- "High Stock" → "Stok Tinggi"

#### Halaman Riwayat
- "Transaction History" → "Riwayat Transaksi"
- "Stock management transaction records" → "Catatan transaksi pengelolaan stok"
- "Start Date" → "Tanggal Mulai"
- "End Date" → "Tanggal Akhir"
- "Date & Time" → "Tanggal & Waktu"
- "Reagent" → "Reagen"
- "Type" → "Jenis"
- "Amount" → "Jumlah"
- "Old Stock" → "Stok Lama"
- "New Stock" → "Stok Baru"
- "Notes" → "Catatan"
- "Loading transactions..." → "Memuat transaksi..."
- "No transactions found" → "Tidak ada transaksi ditemukan"

### 🔧 Perubahan Teknis

#### File yang Dimodifikasi:
1. `src/components/ReagentCard.tsx`
   - Menambahkan import Trash2 icon
   - Menambahkan fungsi handleDelete
   - Menambahkan state isDeleting
   - Menambahkan tombol hapus
   - Mengubah semua teks ke Indonesia

2. `src/components/StockModal.tsx`
   - Menambahkan fungsi sendEmailNotification
   - Mengintegrasikan notifikasi email ke handleSubmit
   - Mengubah semua teks ke Indonesia

3. `src/app/page.tsx`
   - Menambahkan batch_number ke filter pencarian
   - Menambahkan state sortBy
   - Mengubah loadReagents untuk sorting berdasarkan stock_out
   - Mengubah semua teks ke Indonesia

4. `src/components/FilterBar.tsx`
   - Mengubah semua label dan opsi ke Indonesia

5. `src/components/AddReagentModal.tsx`
   - Mengubah semua label dan teks ke Indonesia

6. `src/components/EditReagentModal.tsx`
   - Mengubah semua label dan teks ke Indonesia

7. `src/app/history/page.tsx`
   - Mengubah semua teks ke Indonesia

### 📝 File Baru

1. `EMAIL_SETUP.md` - Panduan setup notifikasi email
2. `CHANGELOG.md` - Dokumen ini

### 🚀 Cara Menggunakan Fitur Baru

#### Menghapus Reagen:
1. Klik icon tempat sampah di sebelah tombol edit
2. Konfirmasi penghapusan
3. Reagen akan dihapus dari database

#### Mencari dengan No. Batch:
1. Ketik nomor batch di search box
2. Hasil akan otomatis difilter

#### Melihat Urutan Tren Pemakaian:
- Reagen otomatis diurutkan dari yang paling sering digunakan

#### Setup Email Notifikasi:
- Ikuti panduan di file `EMAIL_SETUP.md`

### ⚠️ Catatan Penting

1. **Penghapusan Reagen**: Tidak bisa di-undo, pastikan sudah yakin sebelum menghapus
2. **Email Notifikasi**: Membutuhkan setup Edge Function di Supabase
3. **Pencarian**: Pencarian tidak case-sensitive
4. **Sorting**: Sorting berdasarkan total stock_out (pemakaian kumulatif)

### 🐛 Bug Fixes

- Tidak ada bug fixes pada update ini

### 🔜 Rencana Pengembangan Selanjutnya

- Export data ke Excel/PDF
- Dashboard analytics dengan grafik
- Reminder otomatis untuk reagen yang akan kadaluarsa
- Multi-user role management
