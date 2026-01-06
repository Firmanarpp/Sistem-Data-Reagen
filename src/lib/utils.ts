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

export function getStockLevel(stock: number): 'low' | 'medium' | 'high' {
  if (stock < 100) return 'low'
  if (stock <= 1000) return 'medium'
  return 'high'
}

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}