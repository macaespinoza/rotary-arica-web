import { cookies } from 'next/headers'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import PapelitoForm from './PapelitoForm'

export default async function PapelitoPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: items, error } = await supabase
    .from('papelitos')
    .select('id, title, pdf_url, date_published, created_at')
    .order('date_published', { ascending: false })

  return (
    <div className="p-4">
      <div className="mb-4 d-flex justify-content-between align-items-start">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: '#003f7f' }}>
            <i className="bi bi-file-earmark-pdf me-2"></i>El Papelito
          </h1>
          <p className="text-muted mb-0">
            Administra las ediciones del boletín oficial del club. Los PDFs se guardan en el bucket <code>papelitos-pdf</code>.
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
          Error cargando boletines: {error.message}
        </div>
      )}

      <PapelitoForm items={items ?? []} />
    </div>
  )
}
