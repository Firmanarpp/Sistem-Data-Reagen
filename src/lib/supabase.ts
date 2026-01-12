import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Reagent = {
  id: string
  name: string
  type: 'Cair' | 'Padat' | 'Reagen Suhu 2-8°C' | null
  batch_number: string | null
  arrival_date: string | null
  expiry_date: string | null
  brand: string | null
  stock_in: number
  stock_out: number
  stock: number
  initial_weight: number | null
  unit: string
  created_at: string
  updated_at: string
}

export type Transaction = {
  id: string
  reagent_id: string
  type: 'in' | 'out'
  amount: number
  old_stock: number
  new_stock: number
  notes: string | null
  created_at: string
}