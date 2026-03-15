"use client"

import { AuthGuard } from '@/components/auth-guard'
import { Navigation } from '@/components/navigation'
import { HomePage } from '@/components/home-page'

export default function Home() {
  return (
    <AuthGuard>
      <Navigation />
      <main className="min-h-screen bg-background pt-16">
        <HomePage />
      </main>
    </AuthGuard>
  )
}
