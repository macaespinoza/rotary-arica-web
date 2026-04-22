/**
 * El Papelito - Visor de PDFs interactivo con PDF.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // Estado de la aplicación
    const state = {
        metadata: [],
        currentDocUrl: null,
        pdfDoc: null,
        pageNum: 1,
        pageRendering: false,
        pageNumPending: null,
        scale: 1.2,
        canvas: document.getElementById('pdf-render'),
        ctx: document.getElementById('pdf-render').getContext('2d'),
        sidebarOpen: true
    };

    // Referencias del DOM
    const refs = {
        documentList: document.getElementById('documentList'),
        currentTitle: document.getElementById('currentDocumentTitle'),
        pageNumSpan: document.getElementById('pageNum'),
        pageCountSpan: document.getElementById('pageCount'),
        prevBtn: document.getElementById('prevPage'),
        nextBtn: document.getElementById('nextPage'),
        zoomInBtn: document.getElementById('zoomIn'),
        zoomOutBtn: document.getElementById('zoomOut'),
        toggleSidebarBtn: document.getElementById('toggleSidebar'),
        sidebar: document.getElementById('sidebar'),
        loadingIndicator: document.getElementById('loadingIndicator')
    };

    // Inicialización
    async function init() {
        try {
            const response = await fetch('/api/list');
            if (!response.ok) throw new Error("No se pudo cargar la lista de documentos");
            const data = await response.json();
            
            if (!Array.isArray(data)) {
                console.error("Data received is not an array:", data);
                throw new Error("Formato de datos inválido");
            }

            // Ordenar por fecha descendente
            state.metadata = data.sort((a, b) => {
                const dateA = a.fechaPublicacion ? new Date(a.fechaPublicacion) : new Date(0);
                const dateB = b.fechaPublicacion ? new Date(b.fechaPublicacion) : new Date(0);
                return dateB - dateA;
            });
            
            renderSidebarList();

            // Buscar si viene un ID por parámetro
            const urlParams = new URLSearchParams(window.location.search);
            const targetId = urlParams.get('id');
            let docToLoad = state.metadata[0];

            if (targetId) {
                const found = state.metadata.find(d => d.id === targetId || d.titulo === targetId);
                if (found) docToLoad = found;
            }

            // Cargar el documento, si existe
            if(docToLoad) {
                // Si cargamos uno específico, asegúrate de marcarlo como activo en la lista
                loadDocument(docToLoad);
                document.querySelectorAll('.papelito-item').forEach(item => {
                    if (item.textContent.includes(docToLoad.titulo)) {
                        document.querySelectorAll('.papelito-item').forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                    }
                });
            } else if (state.metadata.length === 0) {
                refs.documentList.innerHTML = '<p class="text-muted p-3">No hay documentos disponibles.</p>';
                refs.currentTitle.textContent = "Sin documentos";
            }

        } catch (error) {
            console.error(error);
            refs.documentList.innerHTML = `<div class="alert alert-danger p-3">
                <strong>Error:</strong><br>
                ${error.message || 'No se pudo cargar el catálogo.'}
            </div>`;
        }
        
        setupEventListeners();
    }

    // Renderizar la lista del Sidebar agrupada por Año/Mes
    function renderSidebarList() {
        refs.documentList.innerHTML = '';
        
        let currentGroup = '';

        state.metadata.forEach((doc, index) => {
            const date = new Date(doc.fechaPublicacion);
            // El formato será "Año - Mes", ej: "2026 - Abril"
            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            const groupName = `${date.getFullYear()} - ${monthNames[date.getMonth()]}`;

            if(groupName !== currentGroup) {
                currentGroup = groupName;
                const groupTitle = document.createElement('div');
                groupTitle.className = 'year-group-title';
                groupTitle.textContent = currentGroup;
                refs.documentList.appendChild(groupTitle);
            }

            const item = document.createElement('div');
            item.className = 'papelito-item' + (index === 0 ? ' active' : '');
            item.innerHTML = `
                <strong>${doc.titulo}</strong>
                <div class="small text-muted">${date.toLocaleDateString('es-CL')}</div>
            `;
            
            item.addEventListener('click', () => {
                // Quitar active de todos
                document.querySelectorAll('.papelito-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // En móviles, ocultar sidebar al seleccionar
                if(window.innerWidth <= 768) {
                    toggleSidebar();
                }

                loadDocument(doc);
            });

            refs.documentList.appendChild(item);
        });
    }

    // Cargar un documento PDF
    function loadDocument(doc) {
        state.currentDocUrl = doc.archivoPdf;
        refs.currentTitle.textContent = doc.titulo;
        state.pageNum = 1;
        state.scale = window.innerWidth <= 768 ? 0.8 : 1.2; // Escala responsiva
        
        // Limpiar canvas anterior
        state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
        refs.loadingIndicator.style.display = 'block';
        refs.prevBtn.disabled = true;
        refs.nextBtn.disabled = true;

        pdfjsLib.getDocument(doc.archivoPdf).promise.then(pdfDoc_ => {
            state.pdfDoc = pdfDoc_;
            refs.pageCountSpan.textContent = state.pdfDoc.numPages;
            refs.loadingIndicator.style.display = 'none';
            
            renderPage(state.pageNum);
        }).catch(err => {
            console.error("Error cargando PDF: ", err);
            refs.loadingIndicator.style.display = 'none';
            alert("El archivo PDF no pudo ser cargado. Verifica que exista la ruta: " + doc.archivoPdf);
        });
    }

    // Renderizar página del PDF
    function renderPage(num) {
        state.pageRendering = true;
        state.pdfDoc.getPage(num).then(function(page) {
            const viewport = page.getViewport({scale: state.scale});
            state.canvas.height = viewport.height;
            state.canvas.width = viewport.width;

            const renderContext = {
                canvasContext: state.ctx,
                viewport: viewport
            };
            
            const renderTask = page.render(renderContext);

            renderTask.promise.then(function() {
                state.pageRendering = false;
                if (state.pageNumPending !== null) {
                    renderPage(state.pageNumPending);
                    state.pageNumPending = null;
                }
            });
        });

        // Actualizar UI
        refs.pageNumSpan.textContent = num;
        refs.prevBtn.disabled = num <= 1;
        refs.nextBtn.disabled = num >= state.pdfDoc.numPages;
    }

    // Encadenar descargas de renders
    function queueRenderPage(num) {
        if (state.pageRendering) {
            state.pageNumPending = num;
        } else {
            renderPage(num);
        }
    }

    // Controles
    function onPrevPage() {
        if (state.pageNum <= 1) return;
        state.pageNum--;
        queueRenderPage(state.pageNum);
    }

    function onNextPage() {
        if (state.pageNum >= state.pdfDoc.numPages) return;
        state.pageNum++;
        queueRenderPage(state.pageNum);
    }

    function toggleSidebar() {
        state.sidebarOpen = !state.sidebarOpen;
        if(state.sidebarOpen) {
            refs.sidebar.classList.remove('collapsed');
        } else {
            refs.sidebar.classList.add('collapsed');
        }
    }

    function setupEventListeners() {
        refs.prevBtn.addEventListener('click', onPrevPage);
        refs.nextBtn.addEventListener('click', onNextPage);
        refs.toggleSidebarBtn.addEventListener('click', toggleSidebar);
        
        refs.zoomInBtn.addEventListener('click', () => {
            if(state.scale >= 3) return;
            state.scale += 0.2;
            queueRenderPage(state.pageNum);
        });

        refs.zoomOutBtn.addEventListener('click', () => {
            if(state.scale <= 0.4) return;
            state.scale -= 0.2;
            queueRenderPage(state.pageNum);
        });

        // Ocultar sidebar por defecto en móviles
        if(window.innerWidth <= 768) {
            toggleSidebar();
        }
    }

    // Ejecutar inicialización
    init();
});
