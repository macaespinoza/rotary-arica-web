import { cookies } from 'next/headers'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function AdminDashboard() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Contadores para cada módulo
  const [{ count: totalFotos }, { count: totalPapelitos }, { count: totalEventos }] =
    await Promise.all([
      supabase.from('gallery').select('*', { count: 'exact', head: true }),
      supabase.from('papelitos').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
    ])

  const stats = [
    {
      href: '/admin/galeria',
      icon: 'bi-images',
      color: '#0056b3',
      bg: '#e7f0ff',
      label: 'Fotos en Galería',
      count: totalFotos ?? 0,
      id: 'stat-galeria',
    },
    {
      href: '/admin/papelito',
      icon: 'bi-file-earmark-pdf',
      color: '#c0392b',
      bg: '#fde8e8',
      label: 'Boletines Papelito',
      count: totalPapelitos ?? 0,
      id: 'stat-papelitos',
    },
    {
      href: '/admin/eventos',
      icon: 'bi-calendar-event',
      color: '#1a7a4a',
      bg: '#e6f7ee',
      label: 'Eventos Registrados',
      count: totalEventos ?? 0,
      id: 'stat-eventos',
    },
  ]

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-5 d-flex justify-content-between align-items-start">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: '#003f7f' }}>
            <i className="bi bi-speedometer2 me-2"></i>Dashboard
          </h1>
          <p className="text-muted mb-0">
            Bienvenido al panel de administración del Rotary Club Arica.
          </p>
        </div>
        <Link href="/" className="btn btn-outline-secondary d-flex align-items-center gap-2">
          <i className="bi bi-house"></i>
          Volver al Inicio
        </Link>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="row g-4 mb-5">
        {stats.map((stat) => (
          <div key={stat.id} className="col-md-4">
            <Link href={stat.href} id={stat.id} style={{ textDecoration: 'none' }}>
              <div
                className="card border-0 h-100"
                style={{
                  borderRadius: 14,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
              >
                <div className="card-body d-flex align-items-center gap-4 p-4">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                    style={{ width: 60, height: 60, background: stat.bg }}
                  >
                    <i
                      className={`bi ${stat.icon}`}
                      style={{ fontSize: '1.8rem', color: stat.color }}
                    ></i>
                  </div>
                  <div>
                    <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>
                      {stat.label}
                    </p>
                    <h2 className="h3 fw-bold mb-0" style={{ color: stat.color }}>
                      {stat.count}
                    </h2>
                  </div>
                </div>
                <div
                  style={{ height: 4, background: stat.color, borderRadius: '0 0 14px 14px' }}
                ></div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Accesos rápidos */}
      <h2 className="h5 fw-bold mb-3" style={{ color: '#003f7f' }}>
        Acciones Rápidas
      </h2>
      <div className="row g-3">
        {[
          { href: '/admin/galeria', icon: 'bi-image-fill', label: 'Subir foto a la Galería', id: 'quick-galeria' },
          { href: '/admin/papelito', icon: 'bi-file-earmark-arrow-up', label: 'Publicar nuevo Papelito', id: 'quick-papelito' },
          { href: '/admin/eventos', icon: 'bi-calendar-plus', label: 'Agregar Evento al Calendario', id: 'quick-evento' },
        ].map((action) => (
          <div key={action.id} className="col-md-4">
            <Link
              href={action.href}
              id={action.id}
              className="btn btn-outline-primary w-100 d-flex align-items-center gap-2 py-3 rounded-3"
              style={{ borderColor: '#003f7f', color: '#003f7f' }}
            >
              <i className={`bi ${action.icon} fs-5`}></i>
              <span>{action.label}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
