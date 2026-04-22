const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres:xTKSE9dnMT3kWF0STML@db.wpqnlyhlnknkxqieajsf.supabase.co:5432/postgres"
  });

  try {
    await client.connect();
    console.log("Conectado a la base de datos.");

    console.log("Agregando columna 'thumbnail_url' a 'papelitos'...");
    await client.query(`
      ALTER TABLE public.papelitos 
      ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
    `);

    console.log("¡Columna agregada correctamente!");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
