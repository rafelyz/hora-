"use client"

import { useState, useEffect } from 'react'
import { getLetters, type Letter } from '@/lib/scrapbook-store'
import { Heart, Feather, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LoveLetters() {
  const [letters, setLetters] = useState<Letter[]>([])
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)

  useEffect(() => {
    setLetters(getLetters())
  }, [])

  if (letters.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <Feather className="w-16 h-16 text-sage/30 mx-auto mb-4" strokeWidth={1} />
        <h2 className="text-2xl font-script text-foreground mb-2">No letters yet</h2>
        <p className="text-muted-foreground">
          Your love letters collection awaits its first entry
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {letters.map((letter, index) => (
          <div
            key={letter.id}
            className={cn(
              "animate-fade-in cursor-pointer group",
            )}
            style={{ animationDelay: `${index * 0.15}s` }}
            onClick={() => setSelectedLetter(letter)}
          >
            <div className="parchment-bg rounded-xl p-6 md:p-8 border border-gold/20 hover:border-gold/40 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-sage" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-script text-foreground group-hover:text-sage transition-colors">
                      {letter.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{formatDate(letter.date)}</p>
                  </div>
                </div>
                <Feather className="w-5 h-5 text-gold/50 group-hover:text-gold transition-colors" strokeWidth={1.5} />
              </div>
              
              <p className="text-muted-foreground line-clamp-3 leading-relaxed whitespace-pre-line">
                {letter.content}
              </p>
              
              <div className="mt-4 text-sage text-sm font-medium group-hover:underline underline-offset-4">
                Read more...
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Letter Modal */}
      {selectedLetter && (
        <div 
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedLetter(null)}
        >
          <div 
            className="parchment-bg w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl border border-gold/30 overflow-hidden animate-fade-in-scale"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-gold/20">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-script text-foreground mb-2">
                    {selectedLetter.title}
                  </h2>
                  <p className="text-muted-foreground">{formatDate(selectedLetter.date)}</p>
                </div>
                <button
                  onClick={() => setSelectedLetter(null)}
                  className="p-2 rounded-full hover:bg-sage/10 transition-colors"
                >
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(85vh-140px)]">
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-line text-lg">
                  {selectedLetter.content}
                </p>
              </div>
            </div>

            {/* Footer decoration */}
            <div className="p-4 border-t border-gold/20 flex justify-center">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-sage fill-sage/30" strokeWidth={1.5} />
                <span className="text-sm text-muted-foreground italic">With all my love</span>
                <Heart className="w-4 h-4 text-sage fill-sage/30" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
}
