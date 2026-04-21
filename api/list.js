import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // 1. Consultar la tabla "ediciones" ordenada por fecha descendente
    const { data, error } = await supabase
      .from('ediciones')
      .select('id, titulo, fecha_publicacion, archivo_pdf')
      .order('fecha_publicacion', { ascending: false });

    if (error) {
      console.error("Error consultando DB:", error);
      return res.status(500).json({ error: 'Error al obtener la lista de ediciones.' });
    }

    // 2. Devolver los resultados en formato JSON
    // El frontend espera { titulo, fechaPublicacion, archivoPdf }
    const formattedData = data.map(item => ({
      id: item.id,
      titulo: item.titulo,
      fechaPublicacion: item.fecha_publicacion,
      archivoPdf: item.archivo_pdf
    }));

    return res.status(200).json(formattedData);

  } catch (error) {
    console.error("Error inesperado:", error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
