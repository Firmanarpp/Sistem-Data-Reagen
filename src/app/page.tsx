'use client'

import { useState, useEffect } from 'react'
import { supabase, type Reagent } from '@/lib/supabase'
import { Package, AlertTriangle, TrendingUp, Activity, Search, Plus, History, LogOut, Menu, X } from 'lucide-react'
import ReagentCard from '@/components/ReagentCard'
import StatsCard from '@/components/StatsCard'
import FilterBar from '@/components/FilterBar'
import AddReagentModal from '@/components/AddReagentModal'
import { getExpiryStatus, getStockLevel, isAdmin } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [reagents, setReagents] = useState<Reagent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [expiryFilter, setExpiryFilter] = useState('')
  const [stockFilter, setStockFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'usage'>('usage')

  useEffect(() => {
    loadReagents()
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

  async function loadReagents() {
    try {
      const { data, error } = await supabase
        .from('reagents')
        .select('*')
      
      if (error) throw error
      
      // Sort by usage trend (stock_out)
      const sorted = (data || []).sort((a, b) => {
        if (sortBy === 'usage') {
          return b.stock_out - a.stock_out // Higher usage first
        }
        return a.name.localeCompare(b.name)
      })
      
      setReagents(sorted)
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
        !(reagent.brand?.toLowerCase().includes(query)) &&
        !(reagent.batch_number?.toLowerCase().includes(query))
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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  PharmStock
                </h1>
                {userEmail && (
                  <p className="hidden sm:block text-xs text-gray-500">
                    {userEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-3">
              <Link
                href="/history"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors text-sm font-medium"
              >
                <History className="h-4 w-4" />
                <span>Riwayat</span>
              </Link>
              {isAdmin(userEmail) && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Reagen</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2 transition-colors text-sm font-medium"
                title="Keluar"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">Keluar</span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col gap-2">
                {userEmail && (
                  <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg mb-2">
                    {userEmail}
                  </div>
                )}
                <Link
                  href="/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2.5 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium"
                >
                  <History className="h-5 w-5" />
                  <span>Riwayat</span>
                </Link>
                {isAdmin(userEmail) && (
                  <button
                    onClick={() => {
                      setShowAddModal(true)
                      setMobileMenuOpen(false)
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors font-medium text-left"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Tambah Reagen</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 px-3 py-2.5 rounded-lg hover:bg-red-50 flex items-center gap-3 transition-colors font-medium text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Keluar</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Reagen" value={totalReagents} icon={<Package className="h-6 w-6" />} color="blue" />
          <StatsCard title="Stok Menipis" value={lowStockCount} icon={<TrendingUp className="h-6 w-6" />} color="orange" />
          <StatsCard title="Kadaluarsa" value={expiredCount} icon={<AlertTriangle className="h-6 w-6" />} color="red" />
          <StatsCard title="Akan Kadaluarsa" value={expiringCount} icon={<Activity className="h-6 w-6" />} color="yellow" />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, merek, atau no. batch..."
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
              Menampilkan <span className="font-semibold">{filteredReagents.length}</span> dari <span className="font-semibold">{reagents.length}</span> reagen
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Memuat reagen...</p>
          </div>
        ) : filteredReagents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Tidak ada reagen ditemukan</p>
            <p className="text-gray-500 text-sm mt-2">
              {reagents.length === 0 ? 'Tambahkan reagen pertama Anda untuk memulai' : 'Coba sesuaikan filter Anda'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReagents.map((reagent) => (
              <ReagentCard key={reagent.id} reagent={reagent} onUpdate={loadReagents} userEmail={userEmail} />
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
