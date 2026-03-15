import { supabase } from './supabase'

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

// --- PHOTOS FUNCTIONS ---

export async function uploadPhotoFile(file: File, photoId: string): Promise<string> {
  const fileName = `${photoId}-${Date.now()}.${file.name.split('.').pop()}`
  
  const { data, error } = await supabase.storage
    .from('photos')
    .upload(`memories/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error uploading photo file:', error.message)
    throw error
  }

  // Get the public URL
  const { data: publicData } = supabase.storage
    .from('photos')
    .getPublicUrl(`memories/${fileName}`)

  return publicData.publicUrl
}

export async function getPhotos(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching photos:', error.message)
    return []
  }
  return data || []
}

export async function savePhoto(photo: Photo) {
  const { data, error } = await supabase
    .from('photos')
    .insert([photo])

  if (error) {
    console.error('Error saving photo:', error.message)
    throw error
  }
  return data
}

export async function deletePhoto(id: string) {
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting photo:', error.message)
    throw error
  }
}

// --- LETTERS FUNCTIONS ---

export async function getLetters(): Promise<Letter[]> {
  const { data, error } = await supabase
    .from('letters')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching letters:', error.message)
    return []
  }
  return data || []
}

export async function saveLetter(letter: Letter) {
  const { data, error } = await supabase
    .from('letters')
    .insert([letter])

  if (error) {
    console.error('Error saving letter:', error.message)
    throw error
  }
  return data
}

export async function updateLetter(letter: Letter) {
  const { data, error } = await supabase
    .from('letters')
    .update({ title: letter.title, content: letter.content, date: letter.date })
    .eq('id', letter.id)

  if (error) {
    console.error('Error updating letter:', error.message)
    throw error
  }
  return data
}

export async function deleteLetter(id: string) {
  const { error } = await supabase
    .from('letters')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting letter:', error.message)
    throw error
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}