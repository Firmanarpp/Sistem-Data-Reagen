'use client'

import { useState, useEffect } from 'react'
import { supabase, type Reagent } from '@/lib/supabase'
import { Package, AlertTriangle, TrendingUp, Activity, Search, Plus } from 'lucide-react'
import ReagentCard from '@/components/ReagentCard'
import StatsCard from '@/components/StatsCard'
import FilterBar from '@/components/FilterBar'
import AddReagentModal from '@/components/AddReagentModal'
import { getExpiryStatus, getStockLevel } from '@/lib/utils'

export default function DashboardPage() {
  const [reagents, setReagents] = useState<Reagent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [expiryFilter, setExpiryFilter] = useState('')
  const [stockFilter, setStockFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    loadReagents()
  }, [])

  async function loadReagents() {
    try {
      const { data, error } = await supabase
        .from('reagents')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) throw error
      setReagents(data || [])
    } catch (error) {
      console.error('Error loading reagents:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReagents = reagents.filter(reagent => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !reagent.name.toLowerCase().includes(query) &&
        !reagent.code.toLowerCase().includes(query) &&
        !(reagent.brand?.toLowerCase().includes(query))
      ) return false
    }

    if (typeFilter && reagent.type !== typeFilter) return false

    if (expiryFilter) {
      const status = getExpiryStatus(reagent.expiry_date)
      if (expiryFilter !== status) return false
    }

    if (stockFilter) {
      const level = getStockLevel(reagent.stock)
      if (stockFilter !== level) return false
    }

    return true
  })

  const totalReagents = reagents.length
  const expiredCount = reagents.filter(r => getExpiryStatus(r.expiry_date) === 'expired').length
  const expiringCount = reagents.filter(r => getExpiryStatus(r.expiry_date) === 'expiring').length
  const lowStockCount = reagents.filter(r => getStockLevel(r.stock) === 'low').length

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="h-7 w-7 text-blue-600" />
                PharmStock
              </h1>
              <p className="text-sm text-gray-600 mt-1">Pharmaceutical Inventory Management System</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Reagent
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Reagents" value={totalReagents} icon={<Package className="h-6 w-6" />} color="blue" />
          <StatsCard title="Low Stock" value={lowStockCount} icon={<TrendingUp className="h-6 w-6" />} color="orange" />
          <StatsCard title="Expired" value={expiredCount} icon={<AlertTriangle className="h-6 w-6" />} color="red" />
          <StatsCard title="Expiring Soon" value={expiringCount} icon={<Activity className="h-6 w-6" />} color="yellow" />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, code, or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <FilterBar
              typeFilter={typeFilter}
              expiryFilter={expiryFilter}
              stockFilter={stockFilter}
              onTypeChange={setTypeFilter}
              onExpiryChange={setExpiryFilter}
              onStockChange={setStockFilter}
              onReset={() => {
                setTypeFilter('')
                setExpiryFilter('')
                setStockFilter('')
              }}
            />
          </div>
          
          {filteredReagents.length !== reagents.length && (
            <div className="mt-4 text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredReagents.length}</span> of <span className="font-semibold">{reagents.length}</span> reagents
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading reagents...</p>
          </div>
        ) : filteredReagents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No reagents found</p>
            <p className="text-gray-500 text-sm mt-2">
              {reagents.length === 0 ? 'Add your first reagent to get started' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReagents.map((reagent) => (
              <ReagentCard key={reagent.id} reagent={reagent} onUpdate={loadReagents} />
            ))}
          </div>
        )}
      </main>

      {showAddModal && (
        <AddReagentModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            loadReagents()
            setShowAddModal(false)
          }}
        />
      )}
    </div>
  )
}
