"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { Heart, Clock, Sparkles } from 'lucide-react'

// Sunflower SVG component
function Sunflower({ style }: { style: React.CSSProperties }) {
  return (
    <svg 
      viewBox="0 0 64 64" 
      className="w-8 h-8 sm:w-10 sm:h-10"
      style={style}
    >
      {/* Petals */}
      {[...Array(12)].map((_, i) => (
        <ellipse
          key={i}
          cx="32"
          cy="12"
          rx="6"
          ry="12"
          fill="#F4C430"
          transform={`rotate(${i * 30} 32 32)`}
        />
      ))}
      {/* Center */}
      <circle cx="32" cy="32" r="12" fill="#8B4513" />
      <circle cx="32" cy="32" r="8" fill="#654321" />
    </svg>
  )
}

// White Daisy SVG component
function Daisy({ style }: { style: React.CSSProperties }) {
  return (
    <svg 
      viewBox="0 0 64 64" 
      className="w-7 h-7 sm:w-9 sm:h-9"
      style={style}
    >
      {/* White petals */}
      {[...Array(10)].map((_, i) => (
        <ellipse
          key={i}
          cx="32"
          cy="10"
          rx="5"
          ry="12"
          fill="#FFFEF0"
          stroke="#E8E8D0"
          strokeWidth="0.5"
          transform={`rotate(${i * 36} 32 32)`}
        />
      ))}
      {/* Yellow center */}
      <circle cx="32" cy="32" r="8" fill="#FFD700" />
      <circle cx="32" cy="32" r="5" fill="#FFC000" />
    </svg>
  )
}

interface FallingFlower {
  id: number
  type: 'sunflower' | 'daisy'
  left: number
  delay: number
  duration: number
  rotation: number
  scale: number
}

export function HomePage() {
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [showFlowers, setShowFlowers] = useState(false)
  const [flowers, setFlowers] = useState<FallingFlower[]>([])

  const triggerFlowers = useCallback(() => {
    const newFlowers: FallingFlower[] = []
    for (let i = 0; i < 40; i++) {
      newFlowers.push({
        id: i,
        type: Math.random() > 0.5 ? 'sunflower' : 'daisy',
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 3,
        rotation: Math.random() * 360,
        scale: 0.6 + Math.random() * 0.6
      })
    }
    setFlowers(newFlowers)
    setShowFlowers(true)
    
    // Hide flowers after animation completes
    setTimeout(() => {
      setShowFlowers(false)
    }, 8000)
  }, [])

  // Feb 17, 2026, 9:35 PM Nepal Time (UTC+5:45)
  // Nepal is UTC+5:45, so 9:35 PM NPT = 9:35 PM - 5:45 = 3:50 PM UTC
  const proposalDate = new Date('2026-02-17T15:50:00Z')

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date()
      const diff = Math.abs(now.getTime() - proposalDate.getTime())

      // Calculate total seconds
      const totalSeconds = Math.floor(diff / 1000)
      
      // Calculate each unit properly
      const years = Math.floor(totalSeconds / (365.25 * 24 * 60 * 60))
      const remainingAfterYears = totalSeconds % (365.25 * 24 * 60 * 60)
      
      const months = Math.floor(remainingAfterYears / (30.44 * 24 * 60 * 60))
      const remainingAfterMonths = remainingAfterYears % (30.44 * 24 * 60 * 60)
      
      const days = Math.floor(remainingAfterMonths / (24 * 60 * 60))
      const remainingAfterDays = remainingAfterMonths % (24 * 60 * 60)
      
      const hours = Math.floor(remainingAfterDays / (60 * 60))
      const remainingAfterHours = remainingAfterDays % (60 * 60)
      
      const minutes = Math.floor(remainingAfterHours / 60)
      const seconds = Math.floor(remainingAfterHours % 60)

      setTimeElapsed({
        years,
        months,
        days,
        hours,
        minutes,
        seconds
      })
    }

    calculateTime()
    const interval = setInterval(calculateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Falling flowers overlay */}
      {showFlowers && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {flowers.map((flower) => (
            <div
              key={flower.id}
              className="absolute animate-fall"
              style={{
                left: `${flower.left}%`,
                animationDelay: `${flower.delay}s`,
                animationDuration: `${flower.duration}s`,
                '--rotation': `${flower.rotation}deg`,
                '--scale': flower.scale,
              } as React.CSSProperties}
            >
              {flower.type === 'sunflower' ? (
                <Sunflower style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }} />
              ) : (
                <Daisy style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-sage/10 blur-3xl animate-float" />
        <div className="absolute bottom-40 right-20 w-40 h-40 rounded-full bg-gold/10 blur-3xl animate-float stagger-2" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-sage-light/10 blur-2xl animate-float stagger-3" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative">
        {/* Section 1 - Her Name */}
        <section className="animate-fade-in">
          <div className="bg-card rounded-3xl p-8 sm:p-12 shadow-xl border border-gold/20 relative overflow-hidden">
            {/* Decorative corner elements */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-sage/30 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-sage/30 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-sage/30 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-sage/30 rounded-br-lg" />
            
            <div className="text-center relative">
              <div className="flex justify-center mb-6">
                <Heart className="w-10 h-10 text-sage fill-sage/30 animate-float" strokeWidth={1.5} />
              </div>
              <h1 className="text-5xl sm:text-7xl font-script text-foreground mb-6 text-balance">
                Aarya Pandey
              </h1>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
              <p className="text-xl sm:text-2xl text-muted-foreground font-serif italic mb-3">
                i love you mero mutu.
              </p>
              <p className="text-lg text-sage font-medium">
                thank you for simply existing!
              </p>
              
              {/* Click here button */}
              <button
                onClick={triggerFlowers}
                className="mt-8 px-6 py-3 bg-sage/90 hover:bg-sage text-primary-foreground rounded-full font-serif text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-5 h-5" />
                for you
              </button>
            </div>
          </div>
        </section>

        {/* Section 2 - Time Together */}
        <section className="animate-fade-in stagger-2">
          <div className="parchment-bg rounded-3xl p-8 sm:p-10 shadow-xl border border-gold/20 relative overflow-hidden">
            {/* Decorative top border */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-sage to-transparent" />
            
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-sage" />
              <h2 className="text-2xl sm:text-3xl font-script text-foreground">Time Together</h2>
            </div>
            
            <p className="text-center text-muted-foreground mb-8 font-serif">
              Since I proposed on February 17th, 2026 at 9:35 PM
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
              <TimeUnit value={timeElapsed.years} label="Years" />
              <TimeUnit value={timeElapsed.months} label="Months" />
              <TimeUnit value={timeElapsed.days} label="Days" />
              <TimeUnit value={timeElapsed.hours} label="Hours" />
              <TimeUnit value={timeElapsed.minutes} label="Minutes" />
              <TimeUnit value={timeElapsed.seconds} label="Seconds" />
            </div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/50" />
              <p className="text-sage font-script text-xl">...and counting forever</p>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/50" />
            </div>
          </div>
        </section>

        {/* Section 3 - Scratchable Photo */}
        <section className="animate-fade-in stagger-3">
          <div className="bg-card rounded-3xl p-8 sm:p-10 shadow-xl border border-gold/20 relative overflow-hidden">
            {/* Decorative bottom border */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
            
            <ScratchablePhoto />
          </div>
        </section>
      </div>
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="bg-cream rounded-lg p-3 border border-gold/20 shadow-sm">
        <span className="text-2xl sm:text-3xl font-semibold text-foreground">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs sm:text-sm text-muted-foreground mt-1 block">{label}</span>
    </div>
  )
}

function ScratchablePhoto() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isScratching, setIsScratching] = useState(false)
  const [scratchPercentage, setScratchPercentage] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match container
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Create scratch-off layer with gold texture
    ctx.fillStyle = '#c9b896'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add texture pattern
    ctx.fillStyle = '#b8a785'
    for (let i = 0; i < canvas.width; i += 4) {
      for (let j = 0; j < canvas.height; j += 4) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i, j, 2, 2)
        }
      }
    }

    // Add text hint
    ctx.fillStyle = '#8b7355'
    ctx.font = 'italic 18px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('Scratch to reveal...', canvas.width / 2, canvas.height / 2)
  }, [])

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    let x, y

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 25, 0, Math.PI * 2)
    ctx.fill()

    // Calculate scratch percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let transparent = 0
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++
    }
    const percentage = (transparent / (imageData.data.length / 4)) * 100
    setScratchPercentage(percentage)

    if (percentage > 50 && !isRevealed) {
      setIsRevealed(true)
    }
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl sm:text-3xl font-script text-foreground mb-6">A Special Memory</h2>
      
      <div 
        ref={containerRef}
        className="relative w-full max-w-md mx-auto aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-gold/30"
      >
        {/* Placeholder photo behind scratch layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-sage/20 to-gold/20 flex items-center justify-center">
          <div className="text-center p-6">
            <Heart className="w-16 h-16 text-sage fill-sage/30 mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-xl font-script text-foreground mb-2">Upload your photo in Admin!</p>
            <p className="text-muted-foreground text-sm">This will show your special photo</p>
          </div>
        </div>

        {/* Scratch canvas */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 cursor-pointer transition-opacity duration-500 ${isRevealed ? 'opacity-0 pointer-events-none' : ''}`}
          onMouseDown={() => setIsScratching(true)}
          onMouseUp={() => setIsScratching(false)}
          onMouseLeave={() => setIsScratching(false)}
          onMouseMove={scratch}
          onTouchStart={() => setIsScratching(true)}
          onTouchEnd={() => setIsScratching(false)}
          onTouchMove={scratch}
        />
      </div>

      <p className={`mt-6 text-2xl font-script text-sage transition-opacity duration-500 ${scratchPercentage > 20 ? 'opacity-100' : 'opacity-0'}`}>
        we cuties fr!
      </p>

      {scratchPercentage > 10 && scratchPercentage < 50 && (
        <p className="text-sm text-muted-foreground mt-2 animate-fade-in">
          Keep scratching... {Math.round(scratchPercentage)}% revealed
        </p>
      )}
    </div>
  )
}
