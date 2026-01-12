'use client'

import { useState } from 'react'
import { supabase, type Reagent } from '@/lib/supabase'
import { formatDate, getExpiryStatus, getStockLevel, cn, isAdmin } from '@/lib/utils'
import { Package, Calendar, AlertCircle, TrendingUp, Edit, Trash2 } from 'lucide-react'
import StockModal from './StockModal'
import EditReagentModal from './EditReagentModal'

interface ReagentCardProps {
  reagent: Reagent
  onUpdate: () => void
  userEmail: string
}

export default function ReagentCard({ reagent, onUpdate, userEmail }: ReagentCardProps) {
  const [showStockModal, setShowStockModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const isUserAdmin = isAdmin(userEmail)

  async function handleDelete() {
    if (!confirm(`Apakah Anda yakin ingin menghapus reagen "${reagent.name}"?`)) return
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!isAdmin(user?.email)) {
      alert('Anda tidak memiliki izin untuk menghapus reagen.')
      return
    }
    
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('reagents')
        .delete()
        .eq('id', reagent.id)
      
      if (error) throw error
      alert('Reagen berhasil dihapus')
      onUpdate()
    } catch (error) {
      console.error('Error deleting reagent:', error)
      alert('Gagal menghapus reagen. Silakan coba lagi.')
    } finally {
      setIsDeleting(false)
    }
  }
  
  const expiryStatus = getExpiryStatus(reagent.expiry_date)
  const stockLevel = getStockLevel(reagent.stock, reagent.initial_weight, reagent.unit)

  const expiryBadgeClass = {
    expired: 'bg-red-100 text-red-800 border-red-200',
    expiring: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    valid: 'bg-green-100 text-green-800 border-green-200',
    none: ''
  }

  const stockBadgeClass = {
    low: 'text-red-600',
    high: 'text-green-600'
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{reagent.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            {isUserAdmin && (
              <>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit reagen"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Hapus reagen"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
            {expiryStatus !== 'none' && expiryStatus !== 'valid' && (
              <span className={cn(
                'px-2 py-1 rounded-md text-xs font-medium border',
                expiryBadgeClass[expiryStatus]
              )}>
                {expiryStatus === 'expired' ? '⚠️ Kadaluarsa' : '⏰ Akan Kadaluarsa'}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {reagent.type && (
            <div className="flex items-center text-sm text-gray-600">
              <Package className="h-4 w-4 mr-2" />
              <span className="font-medium">Jenis:</span>
              <span className="ml-1">{reagent.type}</span>
            </div>
          )}
          {reagent.brand && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">Merek:</span>
              <span className="ml-1">{reagent.brand}</span>
            </div>
          )}
          {reagent.batch_number && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">No. Batch:</span>
              <span className="ml-1">{reagent.batch_number}</span>
            </div>
          )}
          {reagent.arrival_date && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="font-medium">Tgl Masuk:</span>
              <span className="ml-1">{formatDate(reagent.arrival_date)}</span>
            </div>
          )}
          {reagent.expiry_date && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="font-medium">Tgl Kadaluarsa:</span>
              <span className="ml-1">{formatDate(reagent.expiry_date)}</span>
            </div>
          )}
          {reagent.initial_weight && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">Berat Sediaan:</span>
              <span className="ml-1">{reagent.initial_weight} {reagent.unit}</span>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gray-600">Stok Saat Ini</span>
            <div className="text-right">
              <span className={cn(
                'text-2xl font-bold',
                stockBadgeClass[stockLevel]
              )}>
                {reagent.stock.toFixed(1)}
              </span>
              <span className="text-sm text-gray-600 ml-1">{reagent.unit}</span>
            </div>
          </div>
          {stockLevel === 'low' && (
            <div className="flex items-center text-xs text-red-600 mt-2">
              <AlertCircle className="h-3 w-3 mr-1" />
              Stok menipis
            </div>
          )}
        </div>

        {isUserAdmin && (
          <button
            onClick={() => setShowStockModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Kelola Stok
          </button>
        )}
      </div>

      {showStockModal && (
        <StockModal
          reagent={reagent}
          onClose={() => setShowStockModal(false)}
          onSuccess={() => {
            onUpdate()
            setShowStockModal(false)
          }}
        />
      )}

      {showEditModal && (
        <EditReagentModal
          reagent={reagent}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            onUpdate()
            setShowEditModal(false)
          }}
        />
      )}
    </>
  )
}
