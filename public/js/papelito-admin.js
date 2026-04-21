document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const btnSubmit = document.getElementById('btnSubmit');
    const alertSuccess = document.getElementById('alertSuccess');
    const alertError = document.getElementById('alertError');
    const errorMessage = document.getElementById('errorMessage');

    // Muestra un mensaje de éxito
    const showSuccess = () => {
        alertSuccess.style.display = 'block';
        alertError.style.display = 'none';
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i class="bi bi-cloud-arrow-up-fill me-3 fs-1"></i> Publicar Documento';
        form.reset();
    };

    // Muestra un mensaje de error
    const showError = (msg) => {
        alertSuccess.style.display = 'none';
        alertError.style.display = 'block';
        errorMessage.textContent = msg;
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i class="bi bi-cloud-arrow-up-fill me-3 fs-1"></i> Intentar Nuevamente';
    };

    // Función auxiliar para convertir archivo file a Base64
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Limpiar alertas
        alertSuccess.style.display = 'none';
        alertError.style.display = 'none';

        // Estado de carga visual
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span class="spinner-border text-dark me-3" role="status" aria-hidden="true" style="width: 2rem; height: 2rem;"></span> Guardando, por favor espere...';

        const titulo = document.getElementById('formTitulo').value;
        const fecha_publicacion = document.getElementById('formFecha').value;
        const pdfFile = document.getElementById('formPdf').files[0];

        if (!pdfFile) {
            showError("No ha seleccionado ningún archivo. Por favor, intente de nuevo.");
            return;
        }

        if (pdfFile.size > 10 * 1024 * 1024) { // 10MB limit
            showError("El archivo es demasiado grande. El máximo permitido es 10MB.");
            return;
        }

        try {
            // Transformar PDF a base64
            const pdfBase64 = await toBase64(pdfFile);

            const payload = {
                titulo: titulo,
                fecha_publicacion: fecha_publicacion,
                pdfBase64: pdfBase64,
                filename: pdfFile.name
            };

            // Enviar al Endpoint Serverless
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                showSuccess();
            } else {
                showError("Hubo un problema guardando el documento: " + (result.error || "Desconocido."));
            }

        } catch (err) {
            console.error(err);
            showError("Ocurrió un error inesperado al subir el archivo. Revise su conexión a Internet.");
        }
    });
});
