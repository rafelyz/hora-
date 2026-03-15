"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  isAdmin: boolean
  login: (password: string) => boolean
  adminLogin: (password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Simple password protection - you can change these passwords
const USER_PASSWORD = "iloveyou"
const ADMIN_PASSWORD = "ourstory2024"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if already authenticated from session
    const authStatus = sessionStorage.getItem('scrapbook-auth')
    const adminStatus = sessionStorage.getItem('scrapbook-admin')
    if (authStatus === 'true') setIsAuthenticated(true)
    if (adminStatus === 'true') setIsAdmin(true)
  }, [])

  const login = (password: string): boolean => {
    if (password === USER_PASSWORD || password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('scrapbook-auth', 'true')
      if (password === ADMIN_PASSWORD) {
        setIsAdmin(true)
        sessionStorage.setItem('scrapbook-admin', 'true')
      }
      return true
    }
    return false
  }

  const adminLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setIsAdmin(true)
      sessionStorage.setItem('scrapbook-auth', 'true')
      sessionStorage.setItem('scrapbook-admin', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setIsAdmin(false)
    sessionStorage.removeItem('scrapbook-auth')
    sessionStorage.removeItem('scrapbook-admin')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
