'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Calendar, ArrowUpCircle, ArrowDownCircle, Package, Printer } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'

type TransactionWithReagent = {
  id: string
  reagent_id: string | null
  reagent_name: string
  reagent_unit: string
  type: 'in' | 'out'
  amount: number
  old_stock: number
  new_stock: number
  notes: string | null
  user_email: string | null
  created_at: string
  reagent_brand: string | null
  reagent_batch_number: string | null
}

export default function TransactionHistoryPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<TransactionWithReagent[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchBatch, setSearchBatch] = useState('')
  const [searchBrand, setSearchBrand] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    loadTransactions()
    loadUser()
  }, [])

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUserEmail(user?.email || '')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function loadTransactions() {
    try {
      setLoading(true)
      
      // Query transactions (sudah ada reagent_name dan reagent_unit)
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })

      if (transactionsError) throw transactionsError

      // Get reagent data hanya untuk yang masih ada (untuk brand & batch number)
      const reagentIds = [...new Set(transactionsData?.filter(t => t.reagent_id).map(t => t.reagent_id) || [])]
      const { data: reagentsData } = await supabase
        .from('reagents')
        .select('id, brand, batch_number')
        .in('id', reagentIds)

      // Combine data
      const reagentMap = new Map(reagentsData?.map(r => [r.id, r]))
      const combined = transactionsData?.map(t => ({
        ...t,
        // Gunakan data dari reagent jika masih ada, jika tidak gunakan dari transaksi
        reagent_brand: t.reagent_id ? reagentMap.get(t.reagent_id)?.brand || null : null,
        reagent_batch_number: t.reagent_id ? reagentMap.get(t.reagent_id)?.batch_number || null : null
      })) || []

      setTransactions(combined)
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.created_at)
    
    if (startDate) {
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)
      if (transactionDate < start) return false
    }
    
    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      if (transactionDate > end) return false
    }
    
    // Filter by name
    if (searchName && !t.reagent_name.toLowerCase().includes(searchName.toLowerCase())) {
      return false
    }
    
    // Filter by batch number
    if (searchBatch && !t.reagent_batch_number?.toLowerCase().includes(searchBatch.toLowerCase())) {
      return false
    }
    
    // Filter by brand
    if (searchBrand && !t.reagent_brand?.toLowerCase().includes(searchBrand.toLowerCase())) {
      return false
    }
    
    return true
  })

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Laporan Riwayat Transaksi - PharmStock</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 20px;
              color: #1f2937;
              background: white;
            }
            
            .header {
              border-bottom: 3px solid #2563eb;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            
            .header h1 {
              font-size: 24px;
              color: #1f2937;
              margin-bottom: 5px;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .header .subtitle {
              color: #6b7280;
              font-size: 14px;
            }
            
            .info-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-bottom: 20px;
              padding: 12px;
              background: #f9fafb;
              border-radius: 6px;
              font-size: 13px;
            }
            
            .info-item {
              display: flex;
              gap: 8px;
            }
            
            .info-label {
              font-weight: 600;
              color: #374151;
            }
            
            .info-value {
              color: #6b7280;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              font-size: 12px;
            }
            
            thead {
              background: #1f2937;
              color: white;
            }
            
            th {
              padding: 12px 8px;
              text-align: left;
              font-weight: 600;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            th.text-right {
              text-align: right;
            }
            
            tbody tr {
              border-bottom: 1px solid #e5e7eb;
            }
            
            tbody tr:nth-child(even) {
              background: #f9fafb;
            }
            
            tbody tr:hover {
              background: #f3f4f6;
            }
            
            td {
              padding: 10px 8px;
              color: #374151;
            }
            
            td.text-right {
              text-align: right;
            }
            
            .badge {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 600;
            }
            
            .badge-in {
              background: #d1fae5;
              color: #065f46;
            }
            
            .badge-out {
              background: #fee2e2;
              color: #991b1b;
            }
            
            .amount-in {
              color: #059669;
              font-weight: 600;
            }
            
            .amount-out {
              color: #dc2626;
              font-weight: 600;
            }
            
            .footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 2px solid #e5e7eb;
              font-size: 11px;
              color: #6b7280;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .summary {
              margin-top: 10px;
              padding: 12px;
              background: #eff6ff;
              border-left: 4px solid #2563eb;
              font-size: 13px;
            }
            
            .summary-item {
              display: flex;
              justify-content: space-between;
              padding: 4px 0;
            }
            
            .summary-label {
              color: #374151;
            }
            
            .summary-value {
              font-weight: 600;
              color: #1f2937;
            }
            
            @media print {
              body {
                padding: 10px;
              }
              
              @page {
                margin: 15mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>
              📦 Laporan Riwayat Transaksi Stok
            </h1>
            <div class="subtitle">PharmStock - Pharmaceutical Inventory Management System</div>
          </div>
          
          <div class="info-section">
            <div class="info-item">
              <span class="info-label">Tanggal Cetak:</span>
              <span class="info-value">${new Date().toLocaleString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Total Transaksi:</span>
              <span class="info-value">${filteredTransactions.length} transaksi</span>
            </div>
            ${startDate ? `
            <div class="info-item">
              <span class="info-label">Periode:</span>
              <span class="info-value">${startDate} s/d ${endDate || 'Sekarang'}</span>
            </div>
            ` : ''}
            ${userEmail ? `
            <div class="info-item">
              <span class="info-label">Dicetak oleh:</span>
              <span class="info-value">${userEmail}</span>
            </div>
            ` : ''}
          </div>
          
          <table>
            <thead>
              <tr>
                <th style="width: 12%">Tanggal & Waktu</th>
                <th style="width: 20%">Reagen</th>
                <th style="width: 18%">Pengguna</th>
                <th style="width: 10%">Jenis</th>
                <th class="text-right" style="width: 12%">Jumlah</th>
                <th class="text-right" style="width: 10%">Stok Lama</th>
                <th class="text-right" style="width: 10%">Stok Baru</th>
                <th style="width: 8%">Catatan</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions.map(transaction => `
                <tr>
                  <td>${formatDateTime(transaction.created_at)}</td>
                  <td>
                    <strong>${transaction.reagent_name}</strong>
                    ${!transaction.reagent_id ? '<br><small style="color: #9ca3af; font-style: italic;">(dihapus)</small>' : ''}
                  </td>
                  <td style="font-size: 11px;">${transaction.user_email || '-'}</td>
                  <td>
                    <span class="badge ${transaction.type === 'in' ? 'badge-in' : 'badge-out'}">
                      ${transaction.type === 'in' ? '↑ Stok Masuk' : '↓ Stok Keluar'}
                    </span>
                  </td>
                  <td class="text-right ${transaction.type === 'in' ? 'amount-in' : 'amount-out'}">
                    ${transaction.type === 'in' ? '+' : '-'}${transaction.amount.toFixed(1)} ${transaction.reagent_unit}
                  </td>
                  <td class="text-right">${transaction.old_stock.toFixed(1)} ${transaction.reagent_unit}</td>
                  <td class="text-right"><strong>${transaction.new_stock.toFixed(1)} ${transaction.reagent_unit}</strong></td>
                  <td style="font-size: 11px;">${transaction.notes || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="summary">
            <div class="summary-item">
              <span class="summary-label">Total Stok Masuk:</span>
              <span class="summary-value">${filteredTransactions.filter(t => t.type === 'in').length} transaksi</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total Stok Keluar:</span>
              <span class="summary-value">${filteredTransactions.filter(t => t.type === 'out').length} transaksi</span>
            </div>
          </div>
          
          <div class="footer">
            <div>PharmStock © ${new Date().getFullYear()} - Pharmaceutical Inventory Management</div>
            <div>Halaman 1 dari 1</div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-7 w-7 text-blue-600" />
            Riwayat Transaksi
          </h2>
          <p className="text-sm text-gray-600 mt-1">Catatan transaksi pengelolaan stok</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Riwayat</h2>
          
          <div className="space-y-4">
            {/* Date filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Search filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Reagen</label>
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Cari nama..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">No. Batch</label>
                <input
                  type="text"
                  value={searchBatch}
                  onChange={(e) => setSearchBatch(e.target.value)}
                  placeholder="Cari no. batch..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Merk</label>
                <input
                  type="text"
                  value={searchBrand}
                  onChange={(e) => setSearchBrand(e.target.value)}
                  placeholder="Cari merk..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setStartDate('')
                    setEndDate('')
                    setSearchName('')
                    setSearchBatch('')
                    setSearchBrand('')
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reset Semua Filter
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 no-print"
                >
                  <Printer className="h-4 w-4" />
                  Cetak Riwayat
                </button>
              </div>
              
              {filteredTransactions.length !== transactions.length && (
                <div className="text-sm text-gray-600">
                  Menampilkan <span className="font-semibold">{filteredTransactions.length}</span> dari <span className="font-semibold">{transactions.length}</span> transaksi
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Memuat transaksi...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Tidak ada transaksi ditemukan</p>
            <p className="text-gray-500 text-sm mt-2">
              {transactions.length === 0 ? 'Belum ada transaksi stok yang dicatat' : 'Coba sesuaikan filter tanggal Anda'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal & Waktu</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reagen</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengguna</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Lama</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Baru</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(transaction.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.reagent_name}
                        {!transaction.reagent_id && (
                          <span className="ml-2 text-xs text-gray-500 italic">(dihapus)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {transaction.user_email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.type === 'in' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <ArrowUpCircle className="h-3 w-3 mr-1" />
                            Stok Masuk
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <ArrowDownCircle className="h-3 w-3 mr-1" />
                            Stok Keluar
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className={transaction.type === 'in' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {transaction.type === 'in' ? '+' : '-'}{transaction.amount.toFixed(1)} {transaction.reagent_unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                        {transaction.old_stock.toFixed(1)} {transaction.reagent_unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                        {transaction.new_stock.toFixed(1)} {transaction.reagent_unit}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {transaction.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
