const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Leer variables de entorno desde config.env.local (o usar strings quemados si se ejecuta local)
// Usar el client con la info base
const SUPABASE_URL = "https://wpqnlyhlnknkxqieajsf.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_x8N5Q-HSXHV8tXUwjY6ncg_z35zDq6M"; // El public key que permite Storage si RLS está abierto, o mejor usar credentials de next

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const FOLDER_PATH = path.join(__dirname, 'papelitos-bulk');

async function main() {
  if (!fs.existsSync(FOLDER_PATH)) {
    console.log(`Creando carpeta ${FOLDER_PATH}...`);
    fs.mkdirSync(FOLDER_PATH);
    console.log("Por favor, coloca los archivos PDF en la carpeta 'scripts/papelitos-bulk' y vuelve a ejecutar este script.");
    return;
  }

  const files = fs.readdirSync(FOLDER_PATH).filter(f => f.toLowerCase().endsWith('.pdf'));

  if (files.length === 0) {
    console.log(`No se encontraron archivos PDF en ${FOLDER_PATH}.`);
    return;
  }

  console.log(`Se encontraron ${files.length} archivos PDF. Iniciando subida...`);

  let successCount = 0;
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(FOLDER_PATH, file);
    const fileData = fs.readFileSync(filePath);
    
    console.log(`[${i + 1}/${files.length}] Procesando: ${file}...`);

    try {
      // 1. Extraer título (remover la extensión, generar algo presentable)
      // Ej: "El Papelito N42 - 2024-03-15.pdf" -> "El Papelito N42 - 2024-03-15"
      let title = file.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ');

      // 2. Extraer fecha (buscar patrón YYYY-MM-DD), si no hay usar hoy
      let datePublished = new Date().toISOString().split('T')[0];
      const dateMatch = file.match(/\d{4}-\d{2}-\d{2}/);
      if (dateMatch) {
        datePublished = dateMatch[0];
      }

      // Nombre de archivo en storage
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;

      // 3. Subir a Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('papelitos-pdf')
        .upload(uniqueName, fileData, {
           contentType: 'application/pdf',
           upsert: false
        });

      if (uploadError) throw new Error(`Error subiendo a Storage: ${uploadError.message}`);

      // 4. Obtener URL publica
      const { data: urlData } = supabase.storage
        .from('papelitos-pdf')
        .getPublicUrl(uniqueName);

      // 5. Guardar en Base de Datos (Requiere que la tabla acepte inserciones anónimas o que cambies a Service Role Key)
      // *Nota: Si tu tabla 'papelitos' tiene RLS estricto, esto podría fallar con la anon_key.
      // En ese caso, debes reemplazar la key de arriba con la Service Role Key para este script local.*
      const { error: dbError } = await supabase
        .from('papelitos')
        .insert({
          title: title,
          date_published: datePublished,
          pdf_url: urlData.publicUrl
        });

      if (dbError) throw new Error(`Error insertando en base de datos: ${dbError.message}`);

      successCount++;
      console.log(`  ✓ Subido correctamente: ${title}`);
    } catch (err) {
      console.error(`  X Error en ${file}: ${err.message}`);
      errors.push({ file, error: err.message });
    }
  }

  console.log(`\n=== RESUMEN ===`);
  console.log(`Subidos con éxito: ${successCount}/${files.length}`);
  
  if (errors.length > 0) {
    console.log(`Errores (${errors.length}):`);
    errors.forEach(e => console.log(` - ${e.file}: ${e.error}`));
    console.log("\nNota: Si falló la inserción en base de datos por RLS, necesitas ejecutar este script con la Service Role Key, o subir los archivos usando el panel de administración donde ya estás autenticado.");
  }
}

main();
