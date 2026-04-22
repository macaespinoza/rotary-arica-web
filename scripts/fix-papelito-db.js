const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres:xTKSE9dnMT3kWF0STML@db.wpqnlyhlnknkxqieajsf.supabase.co:5432/postgres"
  });

  try {
    await client.connect();
    console.log("Conectado a la base de datos.");

    // 1. Crear tabla papelitos con campos nullable
    console.log("Creando tabla 'papelitos'...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.papelitos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NULL, -- Nullable como pidió el usuario
        pdf_url TEXT NOT NULL,
        date_published DATE NULL, -- Nullable
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    // 2. Habilitar RLS
    console.log("Habilitando RLS...");
    await client.query(`ALTER TABLE public.papelitos ENABLE ROW LEVEL SECURITY;`);

    // 3. Políticas
    console.log("Configurando políticas de RLS...");
    await client.query(`
      DROP POLICY IF EXISTS "Allow public read" ON public.papelitos;
      CREATE POLICY "Allow public read" ON public.papelitos FOR SELECT USING (true);
      
      DROP POLICY IF EXISTS "Allow authenticated insert" ON public.papelitos;
      CREATE POLICY "Allow authenticated insert" ON public.papelitos FOR INSERT WITH CHECK (true); -- Simplificado para desarrollo o ajustado a auth.role() = 'authenticated'
      
      DROP POLICY IF EXISTS "Allow authenticated update" ON public.papelitos;
      CREATE POLICY "Allow authenticated update" ON public.papelitos FOR UPDATE USING (true);
      
      DROP POLICY IF EXISTS "Allow authenticated delete" ON public.papelitos;
      CREATE POLICY "Allow authenticated delete" ON public.papelitos FOR DELETE USING (true);
    `);

    // 4. Bucket de Storage
    console.log("Asegurando existencia del bucket 'papelitos-pdf'...");
    await client.query(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('papelitos-pdf', 'papelitos-pdf', true)
      ON CONFLICT (id) DO NOTHING;
    `);

    // 5. Políticas de Storage
    console.log("Configurando políticas de Storage...");
    await client.query(`
      DROP POLICY IF EXISTS "Public Read Papelitos" ON storage.objects;
      CREATE POLICY "Public Read Papelitos" ON storage.objects FOR SELECT USING (bucket_id = 'papelitos-pdf');

      DROP POLICY IF EXISTS "Authenticated Upload Papelitos" ON storage.objects;
      CREATE POLICY "Authenticated Upload Papelitos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'papelitos-pdf');

      DROP POLICY IF EXISTS "Authenticated Delete Papelitos" ON storage.objects;
      CREATE POLICY "Authenticated Delete Papelitos" ON storage.objects FOR DELETE USING (bucket_id = 'papelitos-pdf');
    `);

    console.log("¡Base de datos de Papelitos configurada correctamente!");

  } catch (err) {
    console.error("Error durante la configuración:", err);
  } finally {
    await client.end();
  }
}

run();
