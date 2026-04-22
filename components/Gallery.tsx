"use client";

import { useEffect, useState, useCallback } from "react";
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
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

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

    const nextImage = useCallback(() => {
        if (currentIndex !== null && images.length > 0) {
            setCurrentIndex((prev) => (prev! + 1) % images.length);
        }
    }, [currentIndex, images.length]);

    const prevImage = useCallback(() => {
        if (currentIndex !== null && images.length > 0) {
            setCurrentIndex((prev) => (prev! - 1 + images.length) % images.length);
        }
    }, [currentIndex, images.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (currentIndex === null) return;
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "Escape") setCurrentIndex(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, nextImage, prevImage]);

    const visibleImages = images.slice(0, 9);
    const hasMore = images.length > 9;

    return (
        <section id="galeria" className="section-padding bg-light-rotary">
            <div className="container">
                <div className="section-header text-center mb-5">
                    <h2 className="section-title">Galería</h2>
                    <div className="title-underline"></div>
                    <p className="section-description mt-3">Momentos que reflejan nuestro compromiso con la comunidad.</p>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : (
                    <>
                        <div className="row g-3" id="galleryGrid">
                            {visibleImages.map((img, index) => (
                                <div key={img.id} className="col-lg-4 col-md-6 gallery-item animate-fade-in">
                                    <div className="gallery-card" onClick={() => setCurrentIndex(index)}>
                                        <img src={img.image_url} alt={img.caption} loading="lazy" />
                                        <div className="gallery-overlay">
                                            <i className="bi bi-zoom-in"></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {hasMore && (
                            <div className="text-center mt-5">
                                <button 
                                    className="btn btn-rotary-gold" 
                                    onClick={() => setCurrentIndex(9)}
                                >
                                    Ver más fotos <i className="bi bi-plus-circle ms-2"></i>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {currentIndex !== null && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1055 }} onClick={() => setCurrentIndex(null)}>
                    <button 
                        className="lightbox-nav-btn lightbox-prev" 
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        aria-label="Anterior"
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    
                    <button 
                        className="lightbox-nav-btn lightbox-next" 
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        aria-label="Siguiente"
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>

                    <div className="modal-dialog modal-dialog-centered modal-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content bg-transparent border-0">
                            <div className="modal-header border-0 position-absolute end-0 top-0" style={{ zIndex: 1 }}>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setCurrentIndex(null)} aria-label="Cerrar"></button>
                            </div>
                            <div className="modal-body text-center p-0">
                                <img 
                                    src={images[currentIndex].image_url} 
                                    alt={images[currentIndex].caption} 
                                    className="img-fluid rounded shadow-lg" 
                                    style={{ maxHeight: "85vh", objectFit: "contain" }} 
                                />
                            </div>
                            <div className="modal-footer border-0 justify-content-center bg-dark bg-opacity-50 mt-3 rounded-pill mx-auto px-4 py-2" style={{ width: 'fit-content' }}>
                                <p className="text-white mb-0 fs-6">
                                    {images[currentIndex].caption || "Galería Rotary Club Arica"} 
                                    <span className="ms-3 opacity-75">({currentIndex + 1} / {images.length})</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
