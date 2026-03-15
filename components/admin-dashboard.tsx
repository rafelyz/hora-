"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { 
  getPhotos, savePhoto, deletePhoto, 
  getLetters, saveLetter, deleteLetter,
  generateId,
  type Photo, type Letter 
} from '@/lib/scrapbook-store'
import { 
  Plus, Upload, Trash2, Images, Mail, X, 
  Camera, Feather, AlertCircle, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Tab = 'photos' | 'letters'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('photos')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [letters, setLetters] = useState<Letter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Photo form state
  const [showPhotoForm, setShowPhotoForm] = useState(false)
  const [photoCaption, setPhotoCaption] = useState('')
  const [photoDate, setPhotoDate] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Letter form state
  const [showLetterForm, setShowLetterForm] = useState(false)
  const [letterTitle, setLetterTitle] = useState('')
  const [letterContent, setLetterContent] = useState('')
  const [letterDate, setLetterDate] = useState(new Date().toISOString().split('T')[0])
  
  const [error, setError] = useState('')

  // Load data from Supabase on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const [fetchedPhotos, fetchedLetters] = await Promise.all([
        getPhotos(),
        getLetters()
      ])
      setPhotos(fetchedPhotos)
      setLetters(fetchedLetters)
      setIsLoading(false)
    }
    loadData()
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const getAspectRatio = (width: number, height: number): Photo['aspectRatio'] => {
    const ratio = width / height
    if (ratio > 1.2) return 'landscape'
    if (ratio < 0.8) return 'portrait'
    return 'square'
  }

  // Handle Save Photo with Supabase
  const handleSavePhoto = async () => {
    if (!selectedFile || !previewUrl) {
      setError('Please select an image')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const reader = new FileReader()
      reader.readAsDataURL(selectedFile)
      
      reader.onloadend = async () => {
        const base64data = reader.result as string
        const img = new window.Image()
        img.src = base64data
        
        img.onload = async () => {
          const aspectRatio = getAspectRatio(img.width, img.height)
          
          const newPhoto: Photo = {
            id: generateId(),
            src: base64data,
            caption: photoCaption || undefined,
            date: photoDate || undefined,
            aspectRatio
          }
          
          try {
            await savePhoto(newPhoto) // Wait for Supabase
            const updatedPhotos = await getPhotos() // Get fresh list
            setPhotos(updatedPhotos)
            resetPhotoForm()
          } catch (err) {
            setError('Failed to save to Database')
          } finally {
            setIsSaving(false)
          }
        }
      }
    } catch (err) {
      setError('Failed to process image')
      setIsSaving(false)
    }
  }

  const resetPhotoForm = () => {
    setShowPhotoForm(false)
    setSelectedFile(null)
    setPreviewUrl(null)
    setPhotoCaption('')
    setPhotoDate('')
    setError('')
    setIsSaving(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDeletePhoto = async (id: string) => {
    try {
      await deletePhoto(id)
      const updated = await getPhotos()
      setPhotos(updated)
    } catch (err) {
      console.error(err)
    }
  }

  // Handle Save Letter with Supabase
  const handleSaveLetter = async () => {
    if (!letterTitle.trim() || !letterContent.trim()) {
      setError('Please fill in all fields')
      return
    }

    setIsSaving(true)
    try {
      const newLetter: Letter = {
        id: generateId(),
        title: letterTitle,
        content: letterContent,
        date: letterDate
      }

      await saveLetter(newLetter)
      const updated = await getLetters()
      setLetters(updated)
      resetLetterForm()
    } catch (err) {
      setError('Failed to save letter')
    } finally {
      setIsSaving(false)
    }
  }

  const resetLetterForm = () => {
    setShowLetterForm(false)
    setLetterTitle('')
    setLetterContent('')
    setLetterDate(new Date().toISOString().split('T')[0])
    setError('')
    setIsSaving(false)
  }

  const handleDeleteLetter = async (id: string) => {
    try {
      await deleteLetter(id)
      const updated = await getLetters()
      setLetters(updated)
    } catch (err) {
      console.error(err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-sage" />
        <p className="text-muted-foreground font-medium">Connecting to memories...</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('photos')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200",
            activeTab === 'photos'
              ? "bg-sage text-primary-foreground shadow-md"
              : "bg-cream-dark text-muted-foreground hover:bg-gold/20"
          )}
        >
          <Images className="w-5 h-5" />
          Photos ({photos.length}/100)
        </button>
        <button
          onClick={() => setActiveTab('letters')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200",
            activeTab === 'letters'
              ? "bg-sage text-primary-foreground shadow-md"
              : "bg-cream-dark text-muted-foreground hover:bg-gold/20"
          )}
        >
          <Mail className="w-5 h-5" />
          Letters ({letters.length})
        </button>
      </div>

      {/* Photos Tab */}
      {activeTab === 'photos' && (
        <div>
          {!showPhotoForm && photos.length < 100 && (
            <div className="flex justify-center mb-8">
              <Button
                onClick={() => setShowPhotoForm(true)}
                className="bg-sage hover:bg-sage/90 text-primary-foreground gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Photo
              </Button>
            </div>
          )}

          {showPhotoForm && (
            <div className="parchment-bg rounded-xl p-6 md:p-8 mb-8 border border-gold/20 animate-fade-in-scale">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-script text-foreground flex items-center gap-2">
                  <Camera className="w-6 h-6 text-sage" />
                  Add New Memory
                </h3>
                <button onClick={resetPhotoForm} className="p-2 hover:bg-sage/10 rounded-full transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {previewUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-gold/20">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover"
                      />
                      <button
                        onClick={() => {
                          setSelectedFile(null)
                          setPreviewUrl(null)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        className="absolute top-2 right-2 p-2 bg-foreground/50 rounded-full text-cream hover:bg-foreground/70 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-64 border-2 border-dashed border-gold/30 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-sage/50 hover:bg-sage/5 transition-all"
                    >
                      <Upload className="w-10 h-10 text-sage/50" />
                      <span className="text-muted-foreground">Click to upload an image</span>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Caption (optional)
                    </label>
                    <Input
                      value={photoCaption}
                      onChange={(e) => setPhotoCaption(e.target.value)}
                      placeholder="A beautiful moment..."
                      className="bg-cream border-gold/30 focus:border-sage"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Date (optional)
                    </label>
                    <Input
                      type="date"
                      value={photoDate}
                      onChange={(e) => setPhotoDate(e.target.value)}
                      className="bg-cream border-gold/30 focus:border-sage"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSavePhoto}
                      disabled={!selectedFile || isSaving}
                      className="flex-1 bg-sage hover:bg-sage/90 text-primary-foreground"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Photo'}
                    </Button>
                    <Button
                      onClick={resetPhotoForm}
                      variant="outline"
                      className="border-gold/30 hover:bg-gold/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-gold/10">
                  <img
                    src={photo.src}
                    alt={photo.caption || 'Photo'}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="p-3 bg-destructive rounded-full text-destructive-foreground hover:bg-destructive/90 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-foreground/60 p-2">
                      <p className="text-cream text-xs truncate">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No photos yet. Add your first memory!</p>
            </div>
          )}
        </div>
      )}

      {/* Letters Tab */}
      {activeTab === 'letters' && (
        <div>
          {!showLetterForm && (
            <div className="flex justify-center mb-8">
              <Button
                onClick={() => setShowLetterForm(true)}
                className="bg-sage hover:bg-sage/90 text-primary-foreground gap-2"
              >
                <Plus className="w-5 h-5" />
                Write New Letter
              </Button>
            </div>
          )}

          {showLetterForm && (
            <div className="parchment-bg rounded-xl p-6 md:p-8 mb-8 border border-gold/20 animate-fade-in-scale">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-script text-foreground flex items-center gap-2">
                  <Feather className="w-6 h-6 text-sage" />
                  Write a Love Letter
                </h3>
                <button onClick={resetLetterForm} className="p-2 hover:bg-sage/10 rounded-full transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Title
                    </label>
                    <Input
                      value={letterTitle}
                      onChange={(e) => setLetterTitle(e.target.value)}
                      placeholder="To My Dearest..."
                      className="bg-cream border-gold/30 focus:border-sage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Date
                    </label>
                    <Input
                      type="date"
                      value={letterDate}
                      onChange={(e) => setLetterDate(e.target.value)}
                      className="bg-cream border-gold/30 focus:border-sage"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Letter
                  </label>
                  <textarea
                    value={letterContent}
                    onChange={(e) => setLetterContent(e.target.value)}
                    placeholder="My love, from the moment we met..."
                    rows={10}
                    className="w-full rounded-lg border border-gold/30 bg-cream p-4 text-foreground placeholder:text-muted-foreground/50 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20 resize-none"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleSaveLetter}
                    disabled={isSaving}
                    className="flex-1 bg-sage hover:bg-sage/90 text-primary-foreground"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Letter'}
                  </Button>
                  <Button
                    onClick={resetLetterForm}
                    variant="outline"
                    className="border-gold/30 hover:bg-gold/10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {letters.length > 0 ? (
            <div className="space-y-4">
              {letters.map((letter) => (
                <div
                  key={letter.id}
                  className="parchment-bg rounded-xl p-6 border border-gold/20 flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-script text-foreground mb-1">{letter.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{formatDate(letter.date)}</p>
                    <p className="text-muted-foreground line-clamp-2">{letter.content}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteLetter(letter.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Feather className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No letters yet. Write your first love letter!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
}