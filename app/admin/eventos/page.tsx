import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import EventoForm from './EventoForm'

export default async function EventosPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: events, error } = await supabase
    .from('events')
    .select('id, title, date, time, description, location, image_url, link, created_at')
    .order('date', { ascending: true })

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1" style={{ color: '#003f7f' }}>
          <i className="bi bi-calendar-event me-2"></i>Eventos del Calendario
        </h1>
        <p className="text-muted mb-0">
          Administra los eventos que aparecen en el calendario de la página principal.
          Los cambios se reflejan inmediatamente en el sitio web.
        </p>
        {error && (
          <div className="alert alert-warning mt-3" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Error cargando eventos: {error.message}
          </div>
        )}
      </div>

      <EventoForm events={events ?? []} />
    </div>
  )
}
