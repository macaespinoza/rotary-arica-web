"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface GalleryImage {
    id: number;
    image_url: string;
    category: string;
    caption: string;
    created_at: string;
}

export default function Gallery() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<{ url: string; caption: string } | null>(null);

    const supabase = createClient();

    useEffect(() => {
        async function fetchImages() {
            try {
                const { data, error } = await supabase
                    .from("gallery")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (error) throw error;
                if (data && data.length > 0) {
                    setImages(data);
                } else {
                    // Fallback to initial images if DB is empty
                    setImages([
                        { id: 1, category: "proyectos", image_url: "/assets/img/gallery/20130516_GT_037.JPG", caption: "Apoyo educativo comunitario", created_at: "" },
                        { id: 2, category: "comunidad", image_url: "/assets/img/gallery/20180526_BR_1637_edit.jpg", caption: "Servicio comunitario con adultos mayores", created_at: "" },
                        { id: 3, category: "comunidad", image_url: "/assets/img/gallery/20180526_BR_1727.jpg", caption: "Voluntariado juvenil Rotary", created_at: "" },
                        { id: 4, category: "proyectos", image_url: "/assets/img/gallery/20150427_MX_103.jpg", caption: "Proyecto de ayuda comunitaria", created_at: "" },
                        { id: 5, category: "eventos", image_url: "/assets/img/gallery/20210812_US_204.jpg", caption: "Evento de integración Rotaria", created_at: "" },
                        { id: 6, category: "proyectos", image_url: "/assets/img/gallery/20211114_US_182.jpg", caption: "Trabajo comunitario Rotary", created_at: "" }
                    ]);
                }
            } catch (err) {
                console.error("Error fetching gallery images:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchImages();
    }, []);

    const filteredImages = filter === "all" ? images : images.filter(img => img.category === filter);

    return (
        <section id="galeria" className="section-padding bg-light-rotary">
            <div className="container">
                <div className="section-header text-center mb-5">
                    <h2 className="section-title">Galería</h2>
                    <div className="title-underline"></div>
                    <p className="section-description mt-3">Momentos que reflejan nuestro compromiso con la comunidad.</p>
                </div>

                <div className="gallery-filters text-center mb-4">
                    <button className={`btn btn-filter ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>Todas</button>
                    <button className={`btn btn-filter ${filter === "eventos" ? "active" : ""}`} onClick={() => setFilter("eventos")}>Eventos</button>
                    <button className={`btn btn-filter ${filter === "proyectos" ? "active" : ""}`} onClick={() => setFilter("proyectos")}>Proyectos</button>
                    <button className={`btn btn-filter ${filter === "comunidad" ? "active" : ""}`} onClick={() => setFilter("comunidad")}>Comunidad</button>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : (
                    <div className="row g-3" id="galleryGrid">
                        {filteredImages.map((img) => (
                            <div key={img.id} className="col-lg-4 col-md-6 gallery-item animate-fade-in">
                                <div className="gallery-card" onClick={() => setSelectedImage({ url: img.image_url, caption: img.caption })}>
                                    <img src={img.image_url} alt={img.caption} loading="lazy" />
                                    <div className="gallery-overlay">
                                        <i className="bi bi-zoom-in"></i>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedImage && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={() => setSelectedImage(null)}>
                    <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content bg-dark border-0">
                            <div className="modal-header border-0 pb-0">
                                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedImage(null)} aria-label="Cerrar"></button>
                            </div>
                            <div className="modal-body text-center p-0">
                                <img src={selectedImage.url} alt={selectedImage.caption} className="img-fluid rounded" style={{ maxHeight: "80vh", objectFit: "contain" }} />
                            </div>
                            <div className="modal-footer border-0 justify-content-center">
                                <p className="text-white mb-0 fs-5">{selectedImage.caption}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
