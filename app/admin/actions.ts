'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

// ─── Auth ────────────────────────────────────────────────────────────────────

/**
 * Inicia sesión con email y contraseña.
 * Se usa con useActionState en el LoginForm (client component).
 * Retorna un objeto de error o redirige al admin en caso de éxito.
 */
export async function signIn(
  _prevState: { message: string } | null,
  formData: FormData
): Promise<{ message: string } | null> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { message: 'Credenciales inválidas. Verifica tu email y contraseña.' }
  }

  revalidatePath('/admin', 'layout')
  redirect('/admin')
}

/**
 * Cierra la sesión del administrador.
 */
export async function signOut() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/admin/login')
}
