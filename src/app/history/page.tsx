'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Calendar, ArrowUpCircle, ArrowDownCircle, Package } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

type TransactionWithReagent = {
  id: string
  reagent_id: string
  type: 'in' | 'out'
  amount: number
  old_stock: number
  new_stock: number
  notes: string | null
  created_at: string
  reagent_name: string
  reagent_unit: string
  reagent_brand: string | null
  reagent_batch_number: string | null
}

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<TransactionWithReagent[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchBatch, setSearchBatch] = useState('')
  const [searchBrand, setSearchBrand] = useState('')

  useEffect(() => {
    loadTransactions()
  }, [])

  async function loadTransactions() {
    try {
      setLoading(true)
      
      // Query transactions with reagent data
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })

      if (transactionsError) throw transactionsError

      // Get reagent data for each transaction
      const reagentIds = [...new Set(transactionsData?.map(t => t.reagent_id) || [])]
      const { data: reagentsData, error: reagentsError } = await supabase
        .from('reagents')
        .select('id, name, unit, brand, batch_number')
        .in('id', reagentIds)

      if (reagentsError) throw reagentsError

      // Combine data
      const reagentMap = new Map(reagentsData?.map(r => [r.id, r]))
      const combined = transactionsData?.map(t => ({
        ...t,
        reagent_name: reagentMap.get(t.reagent_id)?.name || 'Unknown',
        reagent_unit: reagentMap.get(t.reagent_id)?.unit || '',
        reagent_brand: reagentMap.get(t.reagent_id)?.brand || null,
        reagent_batch_number: reagentMap.get(t.reagent_id)?.batch_number || null
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="h-7 w-7 text-blue-600" />
                Riwayat Transaksi
              </h1>
              <p className="text-sm text-gray-600 mt-1">Catatan transaksi pengelolaan stok</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
