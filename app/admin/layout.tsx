import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { signOut } from './actions'

export const metadata: Metadata = {
  title: 'Administración — Rotary Club Arica',
  robots: { index: false, follow: false },
}

/**
 * Helper: verifica si hay una sesión de Supabase válida.
 * Usa getClaims() que valida el JWT localmente.
 * Retorna null si no hay sesión o si hay algún error.
 */
async function getAdminSession() {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data, error } = await supabase.auth.getClaims()
    if (error || !data?.claims) return null
    return data.claims
  } catch {
    return null
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const claims = await getAdminSession()

  // Si no hay sesión, mostrar solo children (el middleware ya redirigió si era necesario)
  // Esto previene el redirect loop en /admin/login que hereda este layout
  if (!claims) {
    return <>{children}</>
  }

  const userEmail = claims.email as string


  return (
    <div className="d-flex min-vh-100" style={{ background: '#f0f2f5' }}>
      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside
        className="d-flex flex-column flex-shrink-0 p-0"
        style={{
          width: 240,
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #003f7f 0%, #002855 100%)',
          boxShadow: '2px 0 16px rgba(0,0,0,0.15)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 100,
        }}
      >
        {/* Logo del sidebar */}
        <div
          className="text-center py-4 px-3"
          style={{ borderBottom: '2px solid rgba(255,190,0,0.4)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logos/RotaryMoE-R_CMYK-C.png"
            alt="Rotary Club Arica"
            height={50}
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <p className="text-white fw-bold mb-0 mt-2" style={{ fontSize: '0.9rem' }}>
            Panel Admin
          </p>
          <p className="mb-0" style={{ color: '#FFBE00', fontSize: '0.75rem' }}>
            Rotary Club Arica
          </p>
        </div>

        {/* Navegación */}
        <nav className="flex-grow-1 py-3">
          <ul className="nav flex-column px-2 gap-1">
            <li className="nav-item">
              <Link href="/admin" className="nav-link d-flex align-items-center gap-2 px-3 py-2 rounded text-white" id="nav-dashboard">
                <i className="bi bi-speedometer2" style={{ fontSize: '1.1rem' }}></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/galeria" className="nav-link d-flex align-items-center gap-2 px-3 py-2 rounded text-white" id="nav-galeria">
                <i className="bi bi-images" style={{ fontSize: '1.1rem' }}></i>
                <span>Galería</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/papelito" className="nav-link d-flex align-items-center gap-2 px-3 py-2 rounded text-white" id="nav-papelito">
                <i className="bi bi-file-earmark-pdf" style={{ fontSize: '1.1rem' }}></i>
                <span>El Papelito</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/eventos" className="nav-link d-flex align-items-center gap-2 px-3 py-2 rounded text-white" id="nav-eventos">
                <i className="bi bi-calendar-event" style={{ fontSize: '1.1rem' }}></i>
                <span>Eventos</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer del sidebar */}
        <div className="px-3 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 34, height: 34, background: 'rgba(255,190,0,0.2)', border: '1px solid #FFBE00' }}>
              <i className="bi bi-person-fill" style={{ color: '#FFBE00', fontSize: '1rem' }}></i>
            </div>
            <div style={{ minWidth: 0 }}>
              <p className="mb-0 text-white fw-semibold" style={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Admin
              </p>
              <p className="mb-0" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userEmail}
              </p>
            </div>
          </div>
          <form action={signOut}>
            <button type="submit" id="btn-signout" className="btn btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8 }}>
              <i className="bi bi-box-arrow-right"></i>
              Cerrar Sesión
            </button>
          </form>
          <div className="text-center mt-3">
            <a href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textDecoration: 'none' }}>
              <i className="bi bi-house me-1"></i>Ver sitio web
            </a>
          </div>
        </div>
      </aside>

      {/* ── Contenido principal ───────────────────────────────── */}
      <main className="flex-grow-1" style={{ marginLeft: 240, minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
