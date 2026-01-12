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

export function getStockLevel(stock: number, initialWeight?: number | null, unit?: string): 'low' | 'high' {
  // Jika tidak ada berat sediaan, gunakan logika lama
  if (!initialWeight) {
    if (stock < 50) return 'low'
    return 'high'
  }

  // Konversi ke gram jika perlu untuk standardisasi
  let weightInGrams = initialWeight
  if (unit === 'kg') {
    weightInGrams = initialWeight * 1000
  } else if (unit === 'L') {
    weightInGrams = initialWeight * 1000 // Asumsi densitas ~1 g/ml
  } else if (unit === 'ml') {
    weightInGrams = initialWeight // Asumsi densitas ~1 g/ml
  }

  // Tentukan stok minimum berdasarkan 7 kelompok
  let minStock = 2

  if (weightInGrams <= 10) {
    // Kelompok 1: ≤ 10 g → Stok Minimum 2 g
    minStock = 2
  } else if (weightInGrams <= 25) {
    // Kelompok 2: 25 g → Stok Minimum 5 g
    minStock = 5
  } else if (weightInGrams <= 50) {
    // Kelompok 3: 50 g → Stok Minimum 8 g
    minStock = 8
  } else if (weightInGrams <= 100) {
    // Kelompok 4: 100 g → Stok Minimum 20 g
    minStock = 20
  } else if (weightInGrams <= 250) {
    // Kelompok 5: 250 g → Stok Minimum 40 g
    minStock = 40
  } else if (weightInGrams <= 500) {
    // Kelompok 6: 500 g → Stok Minimum 75 g
    minStock = 75
  } else {
    // Kelompok 7: 1000 g → Stok Minimum 150 g
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