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
  location: string
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
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/eventos')
  revalidatePath('/')
  return {}
}

/**
 * Elimina un evento por ID.
 */
export async function deleteEvento(id: string): Promise<{ error?: string }> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/eventos')
  revalidatePath('/')
  return {}
}
