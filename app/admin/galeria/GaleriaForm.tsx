'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { saveGalleryImage, deleteGalleryImage } from './actions'

const CATEGORIAS = [
  'Eventos',
  'Servicio',
  'Reuniones',
  'Comunidad',
  'Directiva',
  'General',
]

type GalleryItem = {
  id: string
  image_url: string
  category: string
  caption: string
  created_at: string
}

export default function GaleriaForm({ items }: { items: GalleryItem[] }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState('General')
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return setFeedback({ type: 'error', msg: 'Selecciona una imagen antes de subir.' })

    setUploading(true)
    setFeedback(null)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw new Error(uploadError.message)

      const { data: urlData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(fileName)

      const result = await saveGalleryImage(urlData.publicUrl, category, caption)
      if (result.error) throw new Error(result.error)

      setFeedback({ type: 'success', msg: '¡Imagen subida correctamente!' })
      setFile(null)
      setPreview(null)
      setCaption('')
      if (fileRef.current) fileRef.current.value = ''
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setFeedback({ type: 'error', msg })
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: string, imageUrl: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta imagen?')) return
    setDeletingId(id)
    const result = await deleteGalleryImage(id, imageUrl)
    setDeletingId(null)
    if (result.error) {
      setFeedback({ type: 'error', msg: result.error })
    } else {
      router.refresh()
    }
  }

  return (
    <>
      {/* ── Formulario de subida ───────────────────────────── */}
      <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: 14 }}>
        <div
          className="card-header py-3 px-4 fw-bold"
          style={{ background: '#003f7f', color: '#fff', borderRadius: '14px 14px 0 0' }}
        >
          <i className="bi bi-cloud-arrow-up me-2"></i>Subir nueva imagen
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

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Zona de imagen */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Imagen</label>
                <div
                  className="border rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    height: 180,
                    background: '#f8f9fa',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderStyle: 'dashed !important',
                  }}
                  onClick={() => fileRef.current?.click()}
                >
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="text-center text-muted">
                      <i className="bi bi-image" style={{ fontSize: '2.5rem' }}></i>
                      <p className="mb-0 mt-1" style={{ fontSize: '0.8rem' }}>
                        Haz clic para seleccionar
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  id="gallery-file-input"
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={handleFileChange}
                />
              </div>

              {/* Campos */}
              <div className="col-md-8 d-flex flex-column gap-3">
                <div>
                  <label htmlFor="gallery-category" className="form-label fw-semibold">
                    Categoría
                  </label>
                  <select
                    id="gallery-category"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="gallery-caption" className="form-label fw-semibold">
                    Pie de foto (opcional)
                  </label>
                  <input
                    id="gallery-caption"
                    type="text"
                    className="form-control"
                    placeholder="Ej: Celebración anual 2026"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={200}
                  />
                </div>
                <button
                  id="btn-upload-gallery"
                  type="submit"
                  disabled={uploading || !file}
                  className="btn mt-auto fw-semibold"
                  style={{
                    background: uploading || !file ? '#6c757d' : '#003f7f',
                    color: '#fff',
                    borderRadius: 8,
                  }}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-arrow-up me-2"></i>Subir imagen
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ── Grilla de imágenes existentes ─────────────────── */}
      <h2 className="h5 fw-bold mb-3" style={{ color: '#003f7f' }}>
        <i className="bi bi-images me-2"></i>Imágenes en la galería ({items.length})
      </h2>

      {items.length === 0 ? (
        <div className="text-center text-muted py-5 border rounded-3" style={{ background: '#f8f9fa' }}>
          <i className="bi bi-image" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
          <p className="mt-3">No hay imágenes en la galería todavía.</p>
        </div>
      ) : (
        <div className="row g-3">
          {items.map((item) => (
            <div key={item.id} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.caption || item.category}
                  style={{ height: 160, objectFit: 'cover', width: '100%' }}
                />
                <div className="card-body p-3">
                  <span className="badge mb-1" style={{ background: '#003f7f' }}>
                    {item.category}
                  </span>
                  {item.caption && (
                    <p className="mb-0 mt-1" style={{ fontSize: '0.8rem', color: '#555' }}>
                      {item.caption}
                    </p>
                  )}
                </div>
                <div className="card-footer bg-white border-top-0 pb-3 px-3">
                  <button
                    id={`btn-delete-gallery-${item.id}`}
                    className="btn btn-sm btn-outline-danger w-100"
                    onClick={() => handleDelete(item.id, item.image_url)}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      <><i className="bi bi-trash me-1"></i>Eliminar</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
