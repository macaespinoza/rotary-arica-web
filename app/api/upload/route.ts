import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { titulo, fecha_publicacion, pdfBase64, filename } = await request.json();

    if (!pdfBase64) {
      return NextResponse.json({ error: "No PDF data provided" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Convert Base64 to Buffer
    const base64Data = pdfBase64.split(',')[1] || pdfBase64;
    const buffer = Buffer.from(base64Data, 'base64');

    // Upload to Storage
    const fileName = `${Date.now()}-${filename || 'document.pdf'}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('papelitos-pdf')
      .upload(fileName, buffer, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get Public URL
    const { data: urlData } = supabase.storage
      .from('papelitos-pdf')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Save to Database
    const { error: dbError } = await supabase
      .from('papelitos')
      .insert({
        title: titulo || filename.replace('.pdf', ''),
        pdf_url: publicUrl,
        date_published: fecha_publicacion || new Date().toISOString().split('T')[0]
      });

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Error interno en el servidor de subida" }, { status: 500 });
  }
}
