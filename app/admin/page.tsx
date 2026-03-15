"use client"

import dynamicLoader from 'next/dynamic'
import { AuthGuard } from '@/components/auth-guard'
import { Navigation } from '@/components/navigation'

export const dynamic = 'force-dynamic'

const AdminDashboard = dynamicLoader(() => import('@/components/admin-dashboard').then(mod => ({ default: mod.AdminDashboard })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
})

export default function AdminPage() {
  return (
    <AuthGuard requireAdmin>
      <Navigation />
      <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-script text-foreground mb-3">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Curate your love story
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
          </header>
          
          <AdminDashboard />
        </div>
      </main>
    </AuthGuard>
  )
}
