import { Filter, RotateCcw } from 'lucide-react'

interface FilterBarProps {
  typeFilter: string
  expiryFilter: string
  stockFilter: string
  onTypeChange: (value: string) => void
  onExpiryChange: (value: string) => void
  onStockChange: (value: string) => void
  onReset: () => void
}

export default function FilterBar({
  typeFilter,
  expiryFilter,
  stockFilter,
  onTypeChange,
  onExpiryChange,
  onStockChange,
  onReset
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      >
        <option value="">Semua Jenis</option>
        <option value="Cair">Cair</option>
        <option value="Padat">Padat</option>
        <option value="Reagen Suhu 2-8°C">Reagen Suhu 2-8°C</option>
      </select>

      <select
        value={expiryFilter}
        onChange={(e) => onExpiryChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      >
        <option value="">Semua Status</option>
        <option value="expired">Kadaluarsa</option>
        <option value="expiring">Akan Kadaluarsa</option>
        <option value="valid">Valid</option>
      </select>

      <select
        value={stockFilter}
        onChange={(e) => onStockChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      >
        <option value="">Semua Level Stok</option>
        <option value="low">Stok Rendah</option>
        <option value="high">Stok Tinggi</option>
      </select>

      <button
        onClick={onReset}
        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </button>
    </div>
  )
}
