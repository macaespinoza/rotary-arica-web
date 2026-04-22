'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { savePapelito, updatePapelito, deletePapelito } from './actions'

type Papelito = {
  id: string
  title: string
  pdf_url: string
  date_published: string
  created_at: string
}

export default function PapelitoForm({ items }: { items: Papelito[] }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  // Estado del formulario de subida
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [datePublished, setDatePublished] = useState('')
  const [uploading, setUploading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  // Estado del modo edición
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDate, setEditDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return setFeedback({ type: 'error', msg: 'Selecciona un archivo PDF.' })
    
    // Validación de tamaño (Máximo 50MB)
    const MAX_SIZE_MB = 50;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return setFeedback({ type: 'error', msg: `El archivo es demasiado grande (${(file.size / (1024 * 1024)).toFixed(1)}MB). El límite es ${MAX_SIZE_MB}MB.` })
    }

    if (!title.trim()) return setFeedback({ type: 'error', msg: 'Ingresa el título del boletín.' })
    if (!datePublished) return setFeedback({ type: 'error', msg: 'Selecciona la fecha de publicación.' })

    setUploading(true)
    setFeedback({ type: 'success', msg: 'Subiendo archivo... por favor espera.' })

    try {
      const supabase = createClient()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`

      const { error: uploadError } = await supabase.storage
        .from('papelitos-pdf')
        .upload(fileName, file, { contentType: 'application/pdf', upsert: false })

      if (uploadError) throw new Error(uploadError.message)

      const { data: urlData } = supabase.storage
        .from('papelitos-pdf')
        .getPublicUrl(fileName)

      const result = await savePapelito(
        urlData.publicUrl, 
        title.trim() || file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' '), 
        datePublished || null
      )
      if (result.error) throw new Error(result.error)

      setFeedback({ type: 'success', msg: '¡Papelito publicado correctamente!' })
      setFile(null)
      setTitle('')
      setDatePublished('')
      if (fileRef.current) fileRef.current.value = ''
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setFeedback({ type: 'error', msg })
    } finally {
      setUploading(false)
    }
  }

  function startEdit(item: Papelito) {
    setEditingId(item.id)
    setEditTitle(item.title)
    setEditDate(item.date_published)
  }

  async function handleUpdate(id: string) {
    setSaving(true)
    const result = await updatePapelito(id, editTitle.trim(), editDate)
    setSaving(false)
    if (result.error) {
      setFeedback({ type: 'error', msg: result.error })
    } else {
      setEditingId(null)
      router.refresh()
    }
  }

  async function handleDelete(id: string, pdfUrl: string) {
    if (!confirm('¿Eliminar este boletín? Se borrará el PDF y el registro.')) return
    setDeletingId(id)
    const result = await deletePapelito(id, pdfUrl)
    setDeletingId(null)
    if (result.error) setFeedback({ type: 'error', msg: result.error })
    else router.refresh()
  }

  return (
    <>
      {/* ── Formulario de subida ─────────────────────── */}
      <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: 14 }}>
        <div
          className="card-header py-3 px-4 fw-bold"
          style={{ background: '#c0392b', color: '#fff', borderRadius: '14px 14px 0 0' }}
        >
          <i className="bi bi-file-earmark-arrow-up me-2"></i>Publicar nuevo Papelito
        </div>
        <div className="card-body p-4">
          {feedback && (
            <div
              className={`alert alert-${feedback.type === 'success' ? 'success' : 'danger'} d-flex align-items-center gap-2`}
              role="alert"
            >
              <i className={`bi ${feedback.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
              {feedback.msg}
            </div>
          )}

          <form onSubmit={handleUpload}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="papelito-title" className="form-label fw-semibold">
                  Título del boletín
                </label>
                <input
                  id="papelito-title"
                  type="text"
                  className="form-control"
                  placeholder="Título (opcional)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="papelito-date" className="form-label fw-semibold">
                  Fecha de publicación
                </label>
                <input
                  id="papelito-date"
                  type="date"
                  className="form-control"
                  value={datePublished}
                  onChange={(e) => setDatePublished(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="papelito-file" className="form-label fw-semibold">
                  Archivo PDF
                </label>
                <input
                  ref={fileRef}
                  id="papelito-file"
                  type="file"
                  accept="application/pdf"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <div className="col-12">
                <button
                  id="btn-upload-papelito"
                  type="submit"
                  disabled={uploading}
                  className="btn fw-semibold px-4"
                  style={{
                    background: '#c0392b',
                    color: '#fff',
                    borderRadius: 8,
                  }}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Subiendo PDF...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-arrow-up me-2"></i>Publicar Papelito
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ── Lista de boletines ───────────────────────── */}
      <h2 className="h5 fw-bold mb-3" style={{ color: '#003f7f' }}>
        <i className="bi bi-file-earmark-pdf me-2"></i>
        Boletines publicados ({items.length})
      </h2>

      {items.length === 0 ? (
        <div className="text-center text-muted py-5 border rounded-3" style={{ background: '#f8f9fa' }}>
          <i className="bi bi-file-earmark-pdf" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
          <p className="mt-3">No hay boletines publicados todavía.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="card border-0 shadow-sm"
              style={{ borderRadius: 12 }}
            >
              <div className="card-body d-flex align-items-center gap-3 p-3 flex-wrap">
                {/* Icono PDF */}
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{ width: 50, height: 50, background: '#fde8e8' }}
                >
                  <i className="bi bi-file-earmark-pdf-fill" style={{ color: '#c0392b', fontSize: '1.6rem' }}></i>
                </div>

                {/* Info / modo edición */}
                {editingId === item.id ? (
                  <div className="d-flex gap-2 flex-grow-1 flex-wrap">
                    <input
                      id={`edit-title-${item.id}`}
                      className="form-control"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={{ maxWidth: 320 }}
                    />
                    <input
                      id={`edit-date-${item.id}`}
                      type="date"
                      className="form-control"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      style={{ maxWidth: 180 }}
                    />
                    <button
                      id={`btn-save-${item.id}`}
                      className="btn btn-sm btn-success"
                      onClick={() => handleUpdate(item.id)}
                      disabled={saving}
                    >
                      {saving ? <span className="spinner-border spinner-border-sm"></span> : <><i className="bi bi-check-lg me-1"></i>Guardar</>}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setEditingId(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex-grow-1">
                    <p className="fw-semibold mb-0">{item.title || 'Edición sin título'}</p>
                    <small className="text-muted">
                      <i className="bi bi-calendar2 me-1"></i>
                      {item.date_published 
                        ? new Date(item.date_published + 'T00:00:00').toLocaleDateString('es-CL', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })
                        : 'Sin fecha de publicación'
                      }
                    </small>
                  </div>
                )}

                {/* Acciones */}
                {editingId !== item.id && (
                  <div className="d-flex gap-2 flex-shrink-0">
                    <a
                      href={item.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-secondary"
                      id={`btn-view-${item.id}`}
                    >
                      <i className="bi bi-eye me-1"></i>Ver PDF
                    </a>
                    <button
                      id={`btn-edit-${item.id}`}
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => startEdit(item)}
                    >
                      <i className="bi bi-pencil me-1"></i>Editar
                    </button>
                    <button
                      id={`btn-delete-${item.id}`}
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(item.id, item.pdf_url)}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id
                        ? <span className="spinner-border spinner-border-sm"></span>
                        : <><i className="bi bi-trash me-1"></i>Eliminar</>
                      }
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
