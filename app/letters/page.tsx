"use client"

import { AuthGuard } from '@/components/auth-guard'
import { Navigation } from '@/components/navigation'
import { LoveLetters } from '@/components/love-letters'

export default function LettersPage() {
  return (
    <AuthGuard>
      <Navigation />
      <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-script text-foreground mb-3">
              Love Letters
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Words from my heart to yours
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
          </header>
          
          <LoveLetters />
        </div>
      </main>
    </AuthGuard>
  )
}
