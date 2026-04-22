'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

/**
 * Guarda el registro de un PDF ya subido a Storage en la tabla papelitos.
 */
export async function savePapelito(
  pdfUrl: string,
  title: string | null,
  datePublished: string | null
): Promise<{ error?: string }> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from('papelitos')
    .insert({ pdf_url: pdfUrl, title, date_published: datePublished })

  if (error) return { error: error.message }

  revalidatePath('/admin/papelito')
  return {}
}

/**
 * Actualiza el título y fecha de un boletín existente.
 */
export async function updatePapelito(
  id: string,
  title: string | null,
  datePublished: string | null
): Promise<{ error?: string }> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from('papelitos')
    .update({ title, date_published: datePublished })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/papelito')
  return {}
}

/**
 * Elimina un boletín de la tabla papelitos y su archivo del bucket.
 */
export async function deletePapelito(
  id: string,
  pdfUrl: string
): Promise<{ error?: string }> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const marker = '/object/public/papelitos-pdf/'
  const idx = pdfUrl.indexOf(marker)
  if (idx !== -1) {
    const filePath = pdfUrl.slice(idx + marker.length)
    await supabase.storage.from('papelitos-pdf').remove([filePath])
  }

  const { error } = await supabase.from('papelitos').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/papelito')
  return {}
}
