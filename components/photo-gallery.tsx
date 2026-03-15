"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getPhotos, type Photo } from '@/lib/scrapbook-store'
import { Heart, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [loaded, setLoaded] = useState<Set<string>>(new Set())

  useEffect(() => {
    setPhotos(getPhotos())
  }, [])

  const handleImageLoad = (id: string) => {
    setLoaded(prev => new Set(prev).add(id))
  }

  const openLightbox = (index: number) => setSelectedIndex(index)
  const closeLightbox = () => setSelectedIndex(null)
  
  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }
  
  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < photos.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, photos.length])

  if (photos.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <Heart className="w-16 h-16 text-sage/30 mx-auto mb-4" strokeWidth={1} />
        <h2 className="text-2xl font-script text-foreground mb-2">No memories yet</h2>
        <p className="text-muted-foreground">
          Your love story gallery is waiting to be filled
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="masonry-grid">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={cn(
              "masonry-item cursor-pointer group",
              !loaded.has(photo.id) && "opacity-0",
              loaded.has(photo.id) && "animate-fade-in-scale"
            )}
            style={{ animationDelay: `${(index % 10) * 0.1}s` }}
            onClick={() => openLightbox(index)}
          >
            <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gold/10">
              <Image
                src={photo.src}
                alt={photo.caption || 'Memory'}
                width={400}
                height={photo.aspectRatio === 'portrait' ? 600 : photo.aspectRatio === 'landscape' ? 300 : 400}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                onLoad={() => handleImageLoad(photo.id)}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {photo.caption && (
                    <p className="text-cream text-sm font-medium">{photo.caption}</p>
                  )}
                  {photo.date && (
                    <p className="text-cream/70 text-xs mt-1">{formatDate(photo.date)}</p>
                  )}
                </div>
              </div>
              {/* Heart decoration */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Heart className="w-5 h-5 text-cream fill-cream/50" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && photos[selectedIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-cream/80 hover:text-cream transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {selectedIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-cream/80 hover:text-cream transition-colors z-10"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
          )}

          {selectedIndex < photos.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-cream/80 hover:text-cream transition-colors z-10"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          )}

          <div className="max-w-5xl max-h-[85vh] p-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[selectedIndex].src}
              alt={photos[selectedIndex].caption || 'Memory'}
              width={1200}
              height={800}
              className="max-h-[75vh] w-auto object-contain rounded-lg"
            />
            {(photos[selectedIndex].caption || photos[selectedIndex].date) && (
              <div className="text-center mt-4">
                {photos[selectedIndex].caption && (
                  <p className="text-cream text-lg font-medium">{photos[selectedIndex].caption}</p>
                )}
                {photos[selectedIndex].date && (
                  <p className="text-cream/60 text-sm mt-1">{formatDate(photos[selectedIndex].date)}</p>
                )}
              </div>
            )}
          </div>

          {/* Photo counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-cream/60 text-sm">
            {selectedIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  )
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
}
