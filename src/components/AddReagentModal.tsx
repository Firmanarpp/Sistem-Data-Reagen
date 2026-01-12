'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/utils'
import { X, Plus } from 'lucide-react'

interface AddReagentModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddReagentModal({ onClose, onSuccess }: AddReagentModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'Cair' as 'Cair' | 'Padat' | 'Reagen Suhu 2-8°C',
    brand: '',
    batch_number: '',
    stock: '',
    unit: 'ml',
    expiry_date: '',
    arrival_date: ''
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Check if user is admin
      const { data: { user } } = await supabase.auth.getUser()
      if (!isAdmin(user?.email)) {
        alert('Anda tidak memiliki izin untuk menambahkan reagen.')
        return
      }

      const { error } = await supabase
        .from('reagents')
        .insert([{
          name: formData.name,
          type: formData.type,
          brand: formData.brand || null,
          batch_number: formData.batch_number || null,
          stock: parseFloat(formData.stock),
          stock_in: parseFloat(formData.stock),
          stock_out: 0,
          unit: formData.unit,
          expiry_date: formData.expiry_date || null,
          arrival_date: formData.arrival_date || null
        }])

      if (error) throw error
      onSuccess()
    } catch (error) {
      console.error('Error adding reagent:', error)
      alert('Gagal menambahkan reagen. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Tambah Reagen Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Cair' | 'Padat' | 'Reagen Suhu 2-8°C' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Cair">Cair</option>
                <option value="Padat">Padat</option>
                <option value="Reagen Suhu 2-8°C">Reagen Suhu 2-8°C</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Merek</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. Batch</label>
            <input
              type="text"
              value={formData.batch_number}
              onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="mis. D098301"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stok Awal <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                step="0.1"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ml">ml</option>
                <option value="L">L</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Masuk</label>
            <input
              type="date"
              value={formData.arrival_date}
              onChange={(e) => setFormData({ ...formData, arrival_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kadaluarsa</label>
            <input
              type="date"
              value={formData.expiry_date}
              onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Menambahkan...' : (
                <>
                  <Plus className="h-4 w-4" />
                  Tambah Reagen
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
