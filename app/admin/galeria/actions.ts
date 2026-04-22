'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

/**
 * Guarda el registro de una imagen ya subida a Storage en la tabla gallery.
 */
export async function saveGalleryImage(
  imageUrl: string,
  category: string,
  caption: string
): Promise<{ error?: string }> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from('gallery')
    .insert({ image_url: imageUrl, category, caption })

  if (error) return { error: error.message }

  revalidatePath('/admin/galeria')
  return {}
}

/**
 * Guarda multiples registros de imágenes en la tabla gallery.
 */
export async function saveGalleryImages(
  images: { imageUrl: string; category: string; caption: string }[]
): Promise<{ error?: string }> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const payload = images.map(img => ({
    image_url: img.imageUrl,
    category: img.category,
    caption: img.caption
  }))

  const { error } = await supabase.from('gallery').insert(payload)

  if (error) return { error: error.message }

  revalidatePath('/admin/galeria')
  return {}
}

/**
 * Elimina una imagen de la tabla gallery y también del bucket de Storage.
 */
export async function deleteGalleryImage(
  id: string,
  imageUrl: string
): Promise<{ error?: string }> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Extraer el path relativo dentro del bucket para poder borrarlo
  const marker = '/object/public/gallery-images/'
  const idx = imageUrl.indexOf(marker)
  if (idx !== -1) {
    const filePath = imageUrl.slice(idx + marker.length)
    await supabase.storage.from('gallery-images').remove([filePath])
  }

  const { error } = await supabase.from('gallery').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/galeria')
  return {}
}
