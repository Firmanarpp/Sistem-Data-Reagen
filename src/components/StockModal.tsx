'use client'

import { useState } from 'react'
import { supabase, type Reagent } from '@/lib/supabase'
import { isAdmin, formatDate } from '@/lib/utils'
import { X, ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react'

interface StockModalProps {
  reagent: Reagent
  onClose: () => void
  onSuccess: () => void
}

export default function StockModal({ reagent, onClose, onSuccess }: StockModalProps) {
  const [loading, setLoading] = useState(false)
  const [transactionType, setTransactionType] = useState<'in' | 'out'>('out')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')

  async function sendEmailNotification(userEmail: string, details: any) {
    try {
      // Call Supabase Edge Function for email
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-stock-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          to: userEmail,
          reagentName: details.reagentName,
          transactionType: details.transactionType,
          amount: details.amount,
          oldStock: details.oldStock,
          newStock: details.newStock,
          unit: details.unit,
          notes: details.notes
        })
      })
    } catch (error) {
      console.error('Error sending email:', error)
      // Don't throw - email is not critical
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      // Check if user is admin
      if (!isAdmin(user?.email)) {
        alert('Anda tidak memiliki izin untuk mengelola stok.')
        setLoading(false)
        return
      }
      
      const numAmount = parseFloat(amount)
      const oldStock = reagent.stock
      let newStock = oldStock

      if (transactionType === 'out') {
        if (oldStock < numAmount) {
          alert('Stok tidak mencukupi!')
          setLoading(false)
          return
        }
        newStock = oldStock - numAmount
      } else {
        newStock = oldStock + numAmount
      }

      // Update reagent stock
      const { error: updateError } = await supabase
        .from('reagents')
        .update({ 
          stock: newStock,
          stock_in: transactionType === 'in' ? reagent.stock_in + numAmount : reagent.stock_in,
          stock_out: transactionType === 'out' ? reagent.stock_out + numAmount : reagent.stock_out
        })
        .eq('id', reagent.id)

      if (updateError) throw updateError

      // Add transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          reagent_id: reagent.id,
          type: transactionType,
          amount: numAmount,
          old_stock: oldStock,
          new_stock: newStock,
          notes: notes || null
        }])

      if (transactionError) throw transactionError

      // Send email notification
      if (user?.email) {
        await sendEmailNotification(user.email, {
          reagentName: reagent.name,
          transactionType: transactionType === 'in' ? 'Stok Masuk' : 'Stok Keluar',
          amount: numAmount,
          oldStock: oldStock,
          newStock: newStock,
          unit: reagent.unit,
          notes: notes || '-'
        })
      }

      onSuccess()
    } catch (error) {
      console.error('Error updating stock:', error)
      alert('Gagal memperbarui stok. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Kelola Stok</h2>
            <p className="text-xs text-gray-600 mt-0.5">{reagent.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Stok Saat Ini</span>
              <span className="text-xl font-bold text-blue-600">
                {reagent.stock.toFixed(1)} {reagent.unit}
              </span>
            </div>
            {reagent.expiry_date && (
              <div className="text-xs text-gray-600 mt-1.5 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Kadaluarsa: {formatDate(reagent.expiry_date)}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Jenis Transaksi</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTransactionType('in')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border-2 transition-colors text-sm ${
                    transactionType === 'in'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ArrowUpCircle className="h-4 w-4" />
                  Stok Masuk
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('out')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border-2 transition-colors text-sm ${
                    transactionType === 'out'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ArrowDownCircle className="h-4 w-4" />
                  Stok Keluar
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah ({reagent.unit}) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                step="0.1"
                min="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Masukkan jumlah"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (Opsional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Tambahkan catatan untuk transaksi ini..."
              />
            </div>

            {amount && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1.5 font-medium">Pratinjau:</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Stok Saat Ini:</span>
                  <span className="font-semibold">{reagent.stock.toFixed(1)} {reagent.unit}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">{transactionType === 'in' ? 'Menambah:' : 'Mengurangi:'}</span>
                  <span className={`font-semibold ${transactionType === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                    {transactionType === 'in' ? '+' : '-'}{parseFloat(amount || '0').toFixed(1)} {reagent.unit}
                  </span>
                </div>
                <div className="border-t border-gray-300 my-1.5"></div>
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-gray-700">Stok Baru:</span>
                  <span className="text-blue-600">
                    {(transactionType === 'in' 
                      ? reagent.stock + parseFloat(amount || '0')
                      : reagent.stock - parseFloat(amount || '0')
                    ).toFixed(1)} {reagent.unit}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Memproses...' : 'Konfirmasi Transaksi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
