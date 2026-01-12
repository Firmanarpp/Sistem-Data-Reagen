export function formatDate(date: string | null): string {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function getExpiryStatus(expiryDate: string | null): 'expired' | 'expiring' | 'valid' | 'none' {
  if (!expiryDate) return 'none'
  
  const now = new Date()
  const expiry = new Date(expiryDate)
  const threeMonthsLater = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000))
  
  if (expiry < now) return 'expired'
  if (expiry <= threeMonthsLater) return 'expiring'
  return 'valid'
}

export function getStockLevel(stock: number, initialWeight?: number | null, unit?: string, type?: string | null): 'low' | 'high' {
  // Jika tidak ada berat sediaan, gunakan logika lama
  if (!initialWeight) {
    if (stock < 50) return 'low'
    return 'high'
  }

  // Normalisasi nilai berdasarkan satuan
  let normalizedWeight = initialWeight
  
  // Untuk Padat (g/kg), konversi ke gram
  if (unit === 'kg') {
    normalizedWeight = initialWeight * 1000
  }
  // Untuk Cair (ml/L), konversi ke ml
  else if (unit === 'L') {
    normalizedWeight = initialWeight * 1000
  }
  // g dan ml tidak perlu konversi, sudah dalam satuan dasar

  // Tentukan stok minimum berdasarkan 7 kelompok
  let minStock = 2

  if (normalizedWeight <= 10) {
    // Kelompok 1: ≤ 10 (g atau ml) → Stok Minimum 2
    minStock = 2
  } else if (normalizedWeight <= 25) {
    // Kelompok 2: 25 (g atau ml) → Stok Minimum 5
    minStock = 5
  } else if (normalizedWeight <= 50) {
    // Kelompok 3: 50 (g atau ml) → Stok Minimum 8
    minStock = 8
  } else if (normalizedWeight <= 100) {
    // Kelompok 4: 100 (g atau ml) → Stok Minimum 20
    minStock = 20
  } else if (normalizedWeight <= 250) {
    // Kelompok 5: 250 (g atau ml) → Stok Minimum 40
    minStock = 40
  } else if (normalizedWeight <= 500) {
    // Kelompok 6: 500 (g atau ml) → Stok Minimum 75
    minStock = 75
  } else {
    // Kelompok 7: 1000 (g atau ml) → Stok Minimum 150
    minStock = 150
  }

  if (stock < minStock) return 'low'
  return 'high'
}

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function isAdmin(email: string | null | undefined): boolean {
  const adminEmails = ['gmpsmg@gmail.com', 'projectfarmasi26@gmail.com']
  return adminEmails.includes(email || '')
}