# PharmStock - Pharmaceutical Inventory Management System

A professional, modern pharmaceutical inventory management system built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Designed for factory stock control in the pharmaceutical industry.

## ✨ Features

- 📊 **Real-time Dashboard** - Monitor total reagents, low stock, expired items, and expiring soon
- 🔍 **Advanced Search & Filtering** - Filter by type, expiry status, and stock levels
- 📦 **Stock Management** - Easy stock in/out transactions with transaction history
- ⚠️ **Smart Alerts** - Visual warnings for expired and expiring reagents
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Professional UI** - Clean, intuitive interface for pharmaceutical operations
- 🚀 **Vercel Ready** - Optimized for free deployment

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase
- Create account at [supabase.com](https://supabase.com)
- Create new project
- Run SQL from `supabase-setup.sql` in SQL Editor

### 3. Configure Environment
Copy `.env.example` to `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**Get these values from**: Supabase Dashboard → Project Settings → API

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

**Reagents**: name, code, type (Cair/Padat), brand, stock, unit, expiry_date, arrival_date

**Transactions**: reagent_id, type (in/out), amount, old_stock, new_stock, notes

## 🌐 Deploy to Vercel

1. **Push to GitHub** (Already done ✅)
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "Add New Project"
   - Select your `Sistem-Data-Reagen` repository
   - Click "Import"

3. **Configure Environment Variables** ⚠️ IMPORTANT
   - Before deploying, add these environment variables in Vercel:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://omordpoktvfysdlcgeim.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   - Get from: `.env.local` file or Supabase Dashboard → Project Settings → API

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-project.vercel.app`

### Troubleshooting Build Errors

If you get "supabaseUrl is required" error:
- Make sure environment variables are set in Vercel dashboard
- Variables must start with `NEXT_PUBLIC_` to be accessible in client

## 📖 Usage

- **Add Reagent**: Click "+ Add Reagent" button
- **Manage Stock**: Click "Manage Stock" on any card
- **Filter**: Use search and filter controls
- **Alerts**: Red = Expired/Low Stock, Yellow = Expiring Soon

## 🔒 Security

⚠️ Default setup uses public access. For production:
- Implement Supabase Auth
- Update RLS policies
- Add rate limiting

## 📄 License

MIT License
