'use client'

import { useActionState } from 'react'
import { signIn } from '../actions'

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, null)

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: 'linear-gradient(135deg, #003f7f 0%, #002855 50%, #001a3a 100%)',
      }}
    >
      <div className="container" style={{ maxWidth: 420 }}>
        {/* Card de login */}
        <div
          className="card border-0 shadow-lg"
          style={{ borderRadius: 16, overflow: 'hidden' }}
        >
          {/* Header */}
          <div
            className="card-header text-center py-4"
            style={{ background: '#003f7f', borderBottom: '3px solid #FFBE00' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logos/RotaryMoE-R_CMYK-C.png"
              alt="Rotary Club Arica"
              height={64}
              className="mb-3"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <h1 className="h4 text-white mb-1 fw-bold">Panel de Administración</h1>
            <p className="text-white-50 mb-0" style={{ fontSize: '0.85rem' }}>
              Rotary Club Arica
            </p>
          </div>

          {/* Body */}
          <div className="card-body p-4 bg-white">
            {state?.message && (
              <div
                className="alert alert-danger d-flex align-items-center gap-2 mb-4"
                role="alert"
              >
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{state.message}</span>
              </div>
            )}

            <form action={action} noValidate>
              <div className="mb-3">
                <label htmlFor="login-email" className="form-label fw-semibold">
                  <i className="bi bi-envelope me-1"></i> Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  className="form-control form-control-lg"
                  placeholder="admin@rotaryarica.cl"
                  required
                  autoComplete="email"
                  disabled={pending}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="login-password" className="form-label fw-semibold">
                  <i className="bi bi-lock me-1"></i> Contraseña
                </label>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  className="form-control form-control-lg"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  disabled={pending}
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="btn btn-lg w-100 fw-bold"
                style={{
                  background: 'linear-gradient(90deg, #003f7f, #0056b3)',
                  color: '#fff',
                  borderRadius: 8,
                }}
              >
                {pending ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Ingresar al Panel
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="card-footer text-center py-3 bg-light">
            <small className="text-muted">
              <i className="bi bi-shield-lock me-1"></i>
              Acceso restringido — Solo personal autorizado
            </small>
          </div>
        </div>

        <p className="text-center mt-4" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
            <i className="bi bi-arrow-left me-1"></i>Volver al sitio web
          </a>
        </p>
      </div>
    </div>
  )
}
