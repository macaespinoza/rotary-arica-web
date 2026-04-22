import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Fuerza a que no se use caché para esta ruta de API
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase config missing in API route");
      return NextResponse.json({ error: "Configuración de Supabase no encontrada" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('papelitos')
      .select('id, title, date_published, pdf_url')
      .order('date_published', { ascending: false });

    if (error) {
      console.error("Supabase error in API route:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json([]);
    }

    // Mapear al formato que espera el frontend antiguo (public/js/papelito.js)
    const mappedData = data.map(item => ({
      id: item.id,
      titulo: item.title || 'Boletín Sin Título',
      fechaPublicacion: item.date_published || new Date().toISOString().split('T')[0],
      archivoPdf: item.pdf_url
    }));

    return NextResponse.json(mappedData);
  } catch (err) {
    console.error("Unexpected error in API route:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
