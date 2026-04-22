import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  // Verificamos si hay una sesión activa directamente en el servidor
  const { data: { user } } = await supabase.auth.getUser()

  // Si el usuario ya está autenticado (tiene sesión), 
  // lo sacamos inmediatamente de la vista de login hacia el Dashboard
  if (user) {
    redirect('/admin')
  }

  // Si no está autenticado, le mostramos el formulario de login normalmente
  return <>{children}</>
}
