'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Package, History, Plus, LogOut, Menu, X, Home, Settings, User } from 'lucide-react'
import { isAdmin } from '@/lib/utils'

interface NavbarProps {
  userEmail: string
  onLogout: () => void
  onAddReagent?: () => void
}

export default function Navbar({ userEmail, onLogout, onAddReagent }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isAdminUser = isAdmin(userEmail)

  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* First Layer - Brand and User */}
        <div className="flex justify-between items-center h-16 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                PharmStock
              </h1>
              <p className="hidden sm:block text-xs text-gray-500">
                Pharmaceutical Inventory System
              </p>
            </div>
          </div>

          {/* Desktop User Info */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
              <User className="h-4 w-4 text-gray-600" />
              <div className="text-right">
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="text-sm font-medium text-gray-900">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
              title="Keluar"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

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

        {/* Second Layer - Main Navigation */}
        <nav className="hidden md:flex items-center gap-1 h-12">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium ${
              isActive('/')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/history"
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium ${
              isActive('/history')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Riwayat</span>
          </Link>
          {isAdminUser && onAddReagent && (
            <button
              onClick={onAddReagent}
              className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Reagen</span>
            </button>
          )}
        </nav>

        {/* Third Layer - Quick Actions & Status (optional, shown on specific pages) */}
        {pathname === '/' && (
          <div className="hidden md:flex items-center gap-2 py-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>System Online</span>
              </div>
              <span className="text-gray-400">•</span>
              <span>Last updated: {new Date().toLocaleTimeString('id-ID')}</span>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{userEmail}</span>
              </div>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors font-medium ${
                  isActive('/')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/history"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors font-medium ${
                  isActive('/history')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <History className="h-5 w-5" />
                <span>Riwayat</span>
              </Link>
              {isAdminUser && onAddReagent && (
                <button
                  onClick={() => {
                    onAddReagent()
                    setMobileMenuOpen(false)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors font-medium text-left"
                >
                  <Plus className="h-5 w-5" />
                  <span>Tambah Reagen</span>
                </button>
              )}
              <button
                onClick={onLogout}
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
  )
}
