"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AdminGaleria() {
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState("eventos");
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const supabase = createClient();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (!file) {
            setMessage({ type: "danger", text: "Por favor, selecciona una foto primero." });
            return;
        }

        if (!caption.trim()) {
            setMessage({ type: "danger", text: "Por favor, escribe una breve descripción." });
            return;
        }

        setLoading(true);

        try {
            // 1. Subir la imagen al storage (bucket: gallery-images)
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${category}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("gallery-images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Obtener URL pública
            const { data: { publicUrl } } = supabase.storage
                .from("gallery-images")
                .getPublicUrl(filePath);

            // 3. Guardar en base de datos
            const { error: dbError } = await supabase
                .from("gallery")
                .insert([
                    {
                        image_url: publicUrl,
                        category: category,
                        caption: caption
                    }
                ]);

            if (dbError) throw dbError;

            // Limpiar formulario y mostrar éxito
            setFile(null);
            setCaption("");
            setMessage({ type: "success", text: "¡Foto subida con éxito! Ya se puede ver en la página web." });

            const fileInput = document.getElementById('foto') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

        } catch (error: any) {
            console.error("Error al subir:", error);
            setMessage({ type: "danger", text: `Hubo un error al subir la foto: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5" style={{ maxWidth: "800px" }}>
            <div className="card shadow-lg border-0 rounded-4">
                <div className="card-header bg-primary text-white text-center py-4 rounded-top-4">
                    <h1 className="mb-0 fs-2 fw-bold"><i className="bi bi-images me-3"></i>Gestor de Galería</h1>
                    <p className="mb-0 mt-2 fs-5">Añade nuevas fotos a la página web fácilmente</p>
                </div>
                
                <div className="card-body p-4 p-md-5">
                    {message.text && (
                        <div className={`alert alert-${message.type} fs-5 text-center`} role="alert">
                            {message.type === 'success' && <i className="bi bi-check-circle-fill me-2"></i>}
                            {message.type === 'danger' && <i className="bi bi-exclamation-triangle-fill me-2"></i>}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleUpload}>
                        <div className="mb-4">
                            <label htmlFor="foto" className="form-label fs-4 fw-bold text-dark">
                                1. Selecciona la foto de tu computador o celular
                            </label>
                            <input 
                                className="form-control form-control-lg p-3 fs-5" 
                                type="file" 
                                id="foto" 
                                accept="image/*" 
                                onChange={handleFileChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="categoria" className="form-label fs-4 fw-bold text-dark">
                                2. ¿A qué sección corresponde?
                            </label>
                            <select 
                                id="categoria" 
                                className="form-select form-select-lg p-3 fs-5" 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="eventos">Eventos (Reuniones, Cenas, etc)</option>
                                <option value="proyectos">Proyectos (Iniciativas, Obras)</option>
                                <option value="comunidad">Comunidad (Ayudas, Servicio social)</option>
                            </select>
                        </div>

                        <div className="mb-5">
                            <label htmlFor="descripcion" className="form-label fs-4 fw-bold text-dark">
                                3. Escribe un título o descripción corta
                            </label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg p-3 fs-5" 
                                id="descripcion" 
                                placeholder="Ej: Visita al hogar de ancianos 2026" 
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                maxLength={60}
                                required
                            />
                            <div className="form-text fs-6 mt-2 text-muted">
                                Máximo 60 caracteres. Intenta que sea algo breve y claro.
                            </div>
                        </div>

                        <div className="d-grid gap-2">
                            <button 
                                type="submit" 
                                className="btn btn-primary btn-lg p-3 fs-4 fw-bold"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-3" role="status" aria-hidden="true"></span>
                                        Subiendo foto, por favor espere...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-cloud-arrow-up-fill me-3"></i>
                                        Guardar Foto en la Web
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="card-footer bg-light text-center py-3">
                    <a href="/" className="btn btn-outline-secondary btn-lg">
                        <i className="bi bi-arrow-left me-2"></i>Volver a la página principal
                    </a>
                </div>
            </div>
        </div>
    );
}
