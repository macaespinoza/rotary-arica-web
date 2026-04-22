import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    if (files.length > 100) {
      return NextResponse.json({ error: 'Max 100 files allowed' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    // Validar usuario (admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Buffer conversion
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Process with sharp
      // Max width 1920px (maintains aspect ratio, inside)
      // webp with quality 80 to hit ~300kb (usually enough for webp)
      const processedBuffer = await sharp(buffer)
        .resize(1920, null, { withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      // Generation of a unique filename
      const ext = file.name.split('.').pop() || 'tmp';
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '').slice(0, 50);
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}.webp`;

      const { data, error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, processedBuffer, {
          contentType: 'image/webp',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(fileName);

      uploadedUrls.push(urlData.publicUrl);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error: any) {
    console.error('API /process-images error:', error);
    return NextResponse.json(
      { error: error.message || 'Error processing images' },
      { status: 500 }
    );
  }
}
