"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Heart, Images, Mail, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navigation() {
  const pathname = usePathname()
  const { isAdmin, logout } = useAuth()

  const navItems = [
    { href: '/gallery', label: 'Gallery', icon: Images },
    { href: '/letters', label: 'Love Letters', icon: Mail },
    ...(isAdmin ? [{ href: '/admin', label: 'Admin', icon: Settings }] : []),
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-md border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2 group">
            <Heart className="w-6 h-6 text-sage fill-sage/20 group-hover:fill-sage/40 transition-colors" strokeWidth={1.5} />
            <span className="font-script text-2xl text-foreground hidden sm:block">Copycats</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sage/10 text-sage"
                      : "text-muted-foreground hover:text-foreground hover:bg-gold/10"
                  )}
                  title={item.label}
                >
                  <Icon className="w-4 h-4" />
                </Link>
              )
            })}

            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-destructive/10 transition-all duration-200 ml-2"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
