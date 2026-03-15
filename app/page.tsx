"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Heart, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push('/home')
    }
  }, [isAuthenticated, router, mounted])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(password)) {
      router.push('/home')
    } else {
      setError('Incorrect password, my love')
      setPassword('')
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-sage/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-gold/10 blur-3xl animate-float stagger-2" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-sage-light/10 blur-2xl animate-float stagger-3" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-scale">
        <div className="parchment-bg rounded-2xl p-8 md:p-12 shadow-xl border border-gold/20">
          {/* Heart decoration */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Heart className="w-16 h-16 text-sage fill-sage/20 animate-float" strokeWidth={1.5} />
              <Heart className="w-8 h-8 text-gold fill-gold/30 absolute -top-1 -right-3 animate-float stagger-2" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-script text-center text-foreground mb-2">
            Our Love Story
          </h1>
          <p className="text-center text-muted-foreground mb-8 text-lg">
            A private collection of our most precious memories
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage" />
              <Input
                type="password"
                placeholder="Enter our secret..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                className="pl-12 h-14 text-lg bg-cream border-gold/30 focus:border-sage focus:ring-sage/20 placeholder:text-muted-foreground/50"
              />
            </div>

            {error && (
              <p className="text-center text-destructive text-sm animate-fade-in">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-14 text-lg bg-sage hover:bg-sage/90 text-primary-foreground font-medium transition-all duration-300 hover:shadow-lg"
            >
              Enter Our World
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gold/20 text-center">
            <p className="text-sm text-muted-foreground italic">
              {"\"In all the world, there is no heart for me like yours.\""} 
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">- Maya Angelou</p>
          </div>
        </div>
      </div>
    </main>
  )
}
