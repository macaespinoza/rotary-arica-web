import { cookies } from 'next/headers'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import GaleriaForm from './GaleriaForm'

export default async function GaleriaPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: items, error } = await supabase
    .from('gallery')
    .select('id, image_url, category, caption, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4">
      <div className="mb-4 d-flex justify-content-between align-items-start">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: '#003f7f' }}>
            <i className="bi bi-images me-2"></i>Galería de Fotos
          </h1>
          <p className="text-muted mb-0">
            Sube imágenes al bucket <code>gallery-images</code> y adminístralas aquí.
          </p>
        </div>
        <Link href="/" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2">
          <i className="bi bi-house"></i>
          Volver al Inicio
        </Link>
      </div>
      {error && (
        <div className="alert alert-warning mt-3" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Error cargando imágenes: {error.message}
        </div>
      )}

      <GaleriaForm items={items ?? []} />
    </div>
  )
}
