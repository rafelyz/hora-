"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Heart } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        router.push('/')
      } else if (requireAdmin && !isAdmin) {
        router.push('/gallery')
      }
    }
  }, [isAuthenticated, isAdmin, requireAdmin, router, mounted])

  if (!mounted || !isAuthenticated || (requireAdmin && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Heart className="w-12 h-12 text-sage animate-pulse" />
      </div>
    )
  }

  return <>{children}</>
}
