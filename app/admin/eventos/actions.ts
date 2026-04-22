'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export type EventRow = {
  id: string
  title: string
  date: string
  time: string | null
  description: string | null
  location: string | null
  image_url: string | null
  link: string | null
  created_at: string
}

/**
 * Crea un nuevo evento en la tabla events.
 */
export async function createEvento(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const payload = {
    title: formData.get('title') as string,
    date: formData.get('date') as string,
    time: (formData.get('time') as string) || null,
    description: (formData.get('description') as string) || null,
    location: (formData.get('location') as string) || null,
    image_url: (formData.get('image_url') as string) || null,
    link: (formData.get('link') as string) || null,
  }

  if (!payload.title || !payload.date) {
    return { error: 'El título y la fecha son obligatorios.' }
  }

  const { error } = await supabase.from('events').insert(payload)
  if (error) return { error: error.message }

  revalidatePath('/admin/eventos')
  revalidatePath('/')
  return null
}

/**
 * Actualiza un evento existente.
 */
export async function updateEvento(
  id: string,
  title: string,
  date: string,
  time: string,
  description: string,
  location: string,
  image_url: string,
  link: string
): Promise<{ error?: string }> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from('events')
    .update({
      title,
      date,
      time: time || null,
      description: description || null,
      location: location || null,
      image_url: image_url || null,
      link: link || null,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/eventos')
  revalidatePath('/')
  return {}
}

/**
 * Elimina un evento por ID. Opcionalmente borra su imagen asociada.
 */
export async function deleteEvento(id: string, imageUrl?: string | null): Promise<{ error?: string }> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (imageUrl) {
    const marker = '/object/public/event-images/'
    const idx = imageUrl.indexOf(marker)
    if (idx !== -1) {
      const filePath = imageUrl.slice(idx + marker.length)
      await supabase.storage.from('event-images').remove([filePath])
    }
  }

  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/eventos')
  revalidatePath('/')
  return {}
}
