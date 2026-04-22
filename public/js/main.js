/* ==========================================================================
   ROTARY CLUB ARICA - JAVASCRIPT PRINCIPAL
   Funcionalidad: Navbar scroll, Galería, Calendario interactivo, Back-to-top
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // =========================================================================
    // 0. COUNTDOWN: Migrated to React Component

    // 1. NAVBAR: Cambio de estilo al hacer scroll
    // =========================================================================
    const navbar = document.getElementById('mainNavbar');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', function () {
        // Navbar scroll effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Scroll suave al hacer click en "Volver arriba"
    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // =========================================================================
    // 2. NAVBAR: Resaltar link activo según sección visible
    // =========================================================================
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('#mainNavbar .nav-link');

    function activateNavLink() {
        let currentSection = '';
        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', activateNavLink);


    // =========================================================================
    // 3. NAVBAR: Cerrar menú móvil al hacer click en un link
    // =========================================================================
    const navbarCollapse = document.getElementById('navbarNav');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (navbarCollapse.classList.contains('show')) {
                var bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });


    // =========================================================================
    // 4. GALERÍA: Filtrado por categoría
    // =========================================================================
    const filterButtons = document.querySelectorAll('.btn-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Activar botón seleccionado
            filterButtons.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(function (item) {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                    item.style.display = '';
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }
            });
        });
    });


    // =========================================================================
    // 5. GALERÍA: Modal con imagen ampliada
    // =========================================================================
    const galleryModal = document.getElementById('galleryModal');
    if (galleryModal) {
        galleryModal.addEventListener('show.bs.modal', function (event) {
            const trigger = event.relatedTarget;
            const imgSrc = trigger.getAttribute('data-img');
            const caption = trigger.getAttribute('data-caption');

            document.getElementById('modalImage').src = imgSrc;
            document.getElementById('modalCaption').textContent = caption;
        });
    }


    // =========================================================================
    // 6. CALENDARIO INTERACTIVO: Migrated to React Component

    // 7. EL PAPELITO CARRUSEL LOGIC: Migrated to Server-Side Rendering in app/page.tsx



    // =========================================================================
    // 8. ANIMACIONES AL HACER SCROLL (Intersection Observer)
    // =========================================================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px 100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Aplicar animación a elementos
    const animatedElements = document.querySelectorAll(
        '.card-rotary, .gallery-card, .section-header'
    );

    animatedElements.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(el);
    });

});
