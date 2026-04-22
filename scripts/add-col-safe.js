const { Client } = require('pg');
const fs = require('fs');

async function run() {
  let connectionString = '';
  try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const match = envFile.match(/DATABASE_URL=["']?(.+?)["']?\s/);
    if (match) connectionString = match[1];
  } catch (e) {}

  if (!connectionString) {
    connectionString = "postgresql://postgres:xTKSE9dnMT3kWF0STML@db.wpqnlyhlnknkxqieajsf.supabase.co:5432/postgres";
  }

  console.log("Using connection string:", connectionString.replace(/:.+?@/, ':****@'));

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log("Conectado.");
    await client.query(`ALTER TABLE public.papelitos ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;`);
    console.log("Columna agregada.");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

run();
