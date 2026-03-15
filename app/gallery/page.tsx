"use client"

import { AuthGuard } from '@/components/auth-guard'
import { Navigation } from '@/components/navigation'
import { PhotoGallery } from '@/components/photo-gallery'

export const dynamic = 'force-dynamic'

export default function GalleryPage() {
  return (
    <AuthGuard>
      <Navigation />
      <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-script text-foreground mb-3">
              Our Memories
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A collection of moments that make my heart smile
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
          </header>
          
          <PhotoGallery />
        </div>
      </main>
    </AuthGuard>
  )
}
