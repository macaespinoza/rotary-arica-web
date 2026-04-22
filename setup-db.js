const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres:xTKSE9dnMT3kWF0STML@db.wpqnlyhlnknkxqieajsf.supabase.co:5432/postgres" // From the project ref and config.env.local
  });

  try {
    await client.connect();
    console.log("Connected successfully to DB!");

    console.log("Adding columns to events table...");
    await client.query(`
      ALTER TABLE events ADD COLUMN IF NOT EXISTS image_url TEXT;
      ALTER TABLE events ADD COLUMN IF NOT EXISTS link TEXT;
    `);
    
    console.log("Creating storage bucket 'event-images'...");
    // Supabase storage bucket insert setup. Requires inserting into storage.buckets.
    await client.query(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('event-images', 'event-images', true)
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log("Database migration successful!");

  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.end();
  }
}

run();
