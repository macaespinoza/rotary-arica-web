import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('papelitos')
    .select('title, date_published, pdf_url')
    .order('date_published', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map to the format expected by public/js/papelito.js
  const mappedData = data.map(item => ({
    titulo: item.title,
    fechaPublicacion: item.date_published,
    archivoPdf: item.pdf_url
  }));

  return NextResponse.json(mappedData);
}
