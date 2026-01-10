# Setup Notifikasi Email

## Cara Mengaktifkan Notifikasi Email

Aplikasi ini telah dilengkapi dengan fungsi untuk mengirim notifikasi email saat mengelola stok. Untuk mengaktifkannya, Anda perlu membuat Supabase Edge Function.

### Opsi 1: Menggunakan Supabase Edge Functions (Recommended)

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login ke Supabase:
```bash
supabase login
```

3. Link project Anda:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

4. Buat file Edge Function di `supabase/functions/send-stock-notification/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const { to, reagentName, transactionType, amount, oldStock, newStock, unit, notes } = await req.json()

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'PharmStock <noreply@yourdomain.com>',
        to: [to],
        subject: `Notifikasi Stok: ${reagentName}`,
        html: `
          <h2>Perubahan Stok Reagen</h2>
          <p>Transaksi stok telah dilakukan:</p>
          <ul>
            <li><strong>Reagen:</strong> ${reagentName}</li>
            <li><strong>Jenis Transaksi:</strong> ${transactionType}</li>
            <li><strong>Jumlah:</strong> ${amount} ${unit}</li>
            <li><strong>Stok Lama:</strong> ${oldStock} ${unit}</li>
            <li><strong>Stok Baru:</strong> ${newStock} ${unit}</li>
            <li><strong>Catatan:</strong> ${notes}</li>
          </ul>
        `,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

5. Set environment variable untuk Resend API Key:
```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
```

6. Deploy Edge Function:
```bash
supabase functions deploy send-stock-notification
```

### Opsi 2: Menggunakan Service Lain (Alternatif)

Anda juga bisa menggunakan service email lain seperti:
- SendGrid
- Mailgun
- AWS SES
- Nodemailer dengan SMTP

Sesuaikan kode di `StockModal.tsx` function `sendEmailNotification` untuk menggunakan API service pilihan Anda.

### Mendapatkan Resend API Key (Gratis)

1. Daftar di https://resend.com
2. Verifikasi domain Anda (atau gunakan domain testing)
3. Buat API Key di dashboard
4. Copy API Key dan simpan sebagai secret di Supabase

### Testing

Setelah setup selesai:
1. Login ke aplikasi
2. Kelola stok reagen (tambah/kurangi)
3. Cek email Anda untuk menerima notifikasi

### Catatan Penting

- Email notifikasi tidak akan menghentikan proses transaksi jika gagal
- Pastikan email yang digunakan untuk login valid
- Untuk production, gunakan domain terverifikasi
- Rate limit: Resend free tier = 100 email/hari
