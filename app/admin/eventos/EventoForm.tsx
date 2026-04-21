'use client'

import { useState, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { createEvento, updateEvento, deleteEvento } from './actions'
import type { EventRow } from './actions'

const EMPTY_FORM = { title: '', date: '', time: '', description: '', location: '' }

export default function EventoForm({ events }: { events: EventRow[] }) {
  const router = useRouter()
  const [formState, createAction, pending] = useActionState(createEvento, null)

  // Estado de edición inline
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  function startEdit(ev: EventRow) {
    setEditingId(ev.id)
    setEditData({
      title: ev.title,
      date: ev.date,
      time: ev.time ?? '',
      description: ev.description ?? '',
      location: ev.location ?? '',
    })
  }

  async function handleUpdate() {
    if (!editingId) return
    setSaving(true)
    const result = await updateEvento(
      editingId,
      editData.title,
      editData.date,
      editData.time,
      editData.description,
      editData.location
    )
    setSaving(false)
    if (result.error) {
      setFeedback({ type: 'error', msg: result.error })
    } else {
      setEditingId(null)
      router.refresh()
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este evento del calendario?')) return
    setDeletingId(id)
    const result = await deleteEvento(id)
    setDeletingId(null)
    if (result.error) setFeedback({ type: 'error', msg: result.error })
    else router.refresh()
  }

  return (
    <>
      {/* ── Formulario de creación ───────────────────── */}
      <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: 14 }}>
        <div
          className="card-header py-3 px-4 fw-bold"
          style={{ background: '#1a7a4a', color: '#fff', borderRadius: '14px 14px 0 0' }}
        >
          <i className="bi bi-calendar-plus me-2"></i>Agregar nuevo evento
        </div>
        <div className="card-body p-4">
          {(formState?.error || feedback) && (
            <div
              className={`alert alert-${feedback?.type === 'success' ? 'success' : 'danger'} d-flex align-items-center gap-2`}
              role="alert"
            >
              <i className={`bi ${feedback?.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
              {formState?.error ?? feedback?.msg}
            </div>
          )}
          <form action={createAction}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="evento-title" className="form-label fw-semibold">
                  Título <span className="text-danger">*</span>
                </label>
                <input
                  id="evento-title"
                  name="title"
                  type="text"
                  className="form-control"
                  placeholder="Reunión Semanal del Club"
                  required
                  disabled={pending}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="evento-date" className="form-label fw-semibold">
                  Fecha <span className="text-danger">*</span>
                </label>
                <input
                  id="evento-date"
                  name="date"
                  type="date"
                  className="form-control"
                  required
                  disabled={pending}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="evento-time" className="form-label fw-semibold">
                  Hora (opcional)
                </label>
                <input
                  id="evento-time"
                  name="time"
                  type="text"
                  className="form-control"
                  placeholder="19:30 - 21:00"
                  disabled={pending}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="evento-description" className="form-label fw-semibold">
                  Descripción (opcional)
                </label>
                <textarea
                  id="evento-description"
                  name="description"
                  className="form-control"
                  rows={2}
                  placeholder="Detalle del evento..."
                  disabled={pending}
                ></textarea>
              </div>
              <div className="col-md-6">
                <label htmlFor="evento-location" className="form-label fw-semibold">
                  Lugar (opcional)
                </label>
                <input
                  id="evento-location"
                  name="location"
                  type="text"
                  className="form-control"
                  placeholder="Sede Rotary Club Arica"
                  disabled={pending}
                />
              </div>
              <div className="col-12">
                <button
                  id="btn-create-evento"
                  type="submit"
                  disabled={pending}
                  className="btn fw-semibold px-4"
                  style={{ background: '#1a7a4a', color: '#fff', borderRadius: 8 }}
                >
                  {pending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle me-2"></i>Agregar evento
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ── Lista de eventos ─────────────────────────── */}
      <h2 className="h5 fw-bold mb-3" style={{ color: '#003f7f' }}>
        <i className="bi bi-calendar-event me-2"></i>Eventos registrados ({events.length})
      </h2>

      {events.length === 0 ? (
        <div className="text-center text-muted py-5 border rounded-3" style={{ background: '#f8f9fa' }}>
          <i className="bi bi-calendar-x" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
          <p className="mt-3">No hay eventos registrados todavía.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {events.map((ev) => {
            const dateObj = new Date(ev.date + 'T00:00:00')
            const dateFormatted = dateObj.toLocaleDateString('es-CL', {
              weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
            })

            return (
              <div key={ev.id} className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <div className="card-body p-3">
                  {editingId === ev.id ? (
                    /* ── Modo edición ── */
                    <div className="row g-2">
                      <div className="col-md-6">
                        <input
                          id={`edit-title-${ev.id}`}
                          className="form-control form-control-sm"
                          value={editData.title}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          placeholder="Título"
                        />
                      </div>
                      <div className="col-md-3">
                        <input
                          id={`edit-date-${ev.id}`}
                          type="date"
                          className="form-control form-control-sm"
                          value={editData.date}
                          onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                        />
                      </div>
                      <div className="col-md-3">
                        <input
                          id={`edit-time-${ev.id}`}
                          className="form-control form-control-sm"
                          value={editData.time}
                          onChange={(e) => setEditData({ ...editData, time: e.target.value })}
                          placeholder="Hora"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          id={`edit-desc-${ev.id}`}
                          className="form-control form-control-sm"
                          value={editData.description}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          placeholder="Descripción"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          id={`edit-loc-${ev.id}`}
                          className="form-control form-control-sm"
                          value={editData.location}
                          onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                          placeholder="Lugar"
                        />
                      </div>
                      <div className="col-12 d-flex gap-2">
                        <button
                          id={`btn-save-evento-${ev.id}`}
                          className="btn btn-sm btn-success"
                          onClick={handleUpdate}
                          disabled={saving}
                        >
                          {saving
                            ? <span className="spinner-border spinner-border-sm"></span>
                            : <><i className="bi bi-check-lg me-1"></i>Guardar</>
                          }
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setEditingId(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Modo vista ── */
                    <div className="d-flex align-items-start gap-3 flex-wrap">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 text-center"
                        style={{ width: 54, height: 54, background: '#e6f7ee' }}
                      >
                        <div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1a7a4a', lineHeight: 1 }}>
                            {dateObj.getDate()}
                          </div>
                          <div style={{ fontSize: '0.6rem', color: '#1a7a4a', textTransform: 'uppercase' }}>
                            {dateObj.toLocaleDateString('es-CL', { month: 'short' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <p className="fw-bold mb-0">{ev.title}</p>
                        <small className="text-muted">{dateFormatted}</small>
                        {ev.time && (
                          <small className="text-muted ms-2">
                            <i className="bi bi-clock me-1"></i>{ev.time}
                          </small>
                        )}
                        {ev.location && (
                          <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.8rem' }}>
                            <i className="bi bi-geo-alt me-1"></i>{ev.location}
                          </p>
                        )}
                        {ev.description && (
                          <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.8rem' }}>
                            {ev.description}
                          </p>
                        )}
                      </div>
                      <div className="d-flex gap-2 flex-shrink-0">
                        <button
                          id={`btn-edit-evento-${ev.id}`}
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => startEdit(ev)}
                        >
                          <i className="bi bi-pencil me-1"></i>Editar
                        </button>
                        <button
                          id={`btn-delete-evento-${ev.id}`}
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(ev.id)}
                          disabled={deletingId === ev.id}
                        >
                          {deletingId === ev.id
                            ? <span className="spinner-border spinner-border-sm"></span>
                            : <><i className="bi bi-trash me-1"></i>Eliminar</>
                          }
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
