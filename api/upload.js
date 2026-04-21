import { createClient } from '@supabase/supabase-js';

// Inicializar cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Permitir PDFs de hasta 10MB
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { titulo, fecha_publicacion, pdfBase64, filename } = req.body;

    if (!titulo || !fecha_publicacion || !pdfBase64 || !filename) {
      return res.status(400).json({ error: 'Faltan datos requeridos (título, fecha, archivo).' });
    }

    // Convertir Base64 a un Buffer de archivo
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
    const fileBuffer = Buffer.from(base64Data, 'base64');
    
    // Generar un nombre de archivo único para evitar colisiones
    const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;

    // 1. Subir archivo a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('papelito-files')
      .upload(uniqueFilename, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      console.error("Error al subir a storage:", uploadError);
      return res.status(500).json({ error: 'Error al subir el archivo al servidor.' });
    }

    // Obtener la URL pública del archivo
    const { data: publicUrlData } = supabase.storage
      .from('papelito-files')
      .getPublicUrl(uploadData.path);
      
    const archivo_pdf = publicUrlData.publicUrl;

    // 2. Insertar metadatos en la tabla ediciones
    const { data: dbData, error: dbError } = await supabase
      .from('ediciones')
      .insert([
        {
          titulo,
          fecha_publicacion,
          archivo_pdf
        }
      ]);

    if (dbError) {
      console.error("Error al insertar en DB:", dbError);
      return res.status(500).json({ error: 'Error al guardar los datos de la edición.' });
    }

    return res.status(200).json({ success: true, message: '¡Archivo guardado con éxito!', archivo_pdf });
    
  } catch (error) {
    console.error("Error inesperado:", error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
