export interface Photo {
  id: string
  src: string
  caption?: string
  date?: string
  aspectRatio: 'portrait' | 'landscape' | 'square'
}

export interface Letter {
  id: string
  title: string
  content: string
  date: string
}

const PHOTOS_KEY = 'scrapbook-photos'
const LETTERS_KEY = 'scrapbook-letters'

// Default demo content
const defaultPhotos: Photo[] = []

const defaultLetters: Letter[] = [
  {
    id: '1',
    title: 'The Day We Met',
    content: `My Dearest,

From the moment our eyes met, I knew my life would never be the same. There was something in your smile that felt like coming home, like finding a missing piece of my soul I never knew was lost.

Every day since then has been a beautiful adventure. You've taught me what it means to truly love and be loved in return.

Forever yours,
Your Love`,
    date: '2024-01-15'
  }
]

export function getPhotos(): Photo[] {
  if (typeof window === 'undefined') return defaultPhotos
  const stored = localStorage.getItem(PHOTOS_KEY)
  if (!stored) {
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(defaultPhotos))
    return defaultPhotos
  }
  return JSON.parse(stored)
}

export function savePhoto(photo: Photo): void {
  const photos = getPhotos()
  if (photos.length >= 100) {
    throw new Error('Maximum 100 photos allowed')
  }
  photos.push(photo)
  localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos))
}

export function deletePhoto(id: string): void {
  const photos = getPhotos().filter(p => p.id !== id)
  localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos))
}

export function getLetters(): Letter[] {
  if (typeof window === 'undefined') return defaultLetters
  const stored = localStorage.getItem(LETTERS_KEY)
  if (!stored) {
    localStorage.setItem(LETTERS_KEY, JSON.stringify(defaultLetters))
    return defaultLetters
  }
  return JSON.parse(stored)
}

export function saveLetter(letter: Letter): void {
  const letters = getLetters()
  letters.push(letter)
  localStorage.setItem(LETTERS_KEY, JSON.stringify(letters))
}

export function updateLetter(letter: Letter): void {
  const letters = getLetters().map(l => l.id === letter.id ? letter : l)
  localStorage.setItem(LETTERS_KEY, JSON.stringify(letters))
}

export function deleteLetter(id: string): void {
  const letters = getLetters().filter(l => l.id !== id)
  localStorage.setItem(LETTERS_KEY, JSON.stringify(letters))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
