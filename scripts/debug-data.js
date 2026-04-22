const { createClient } = require('@supabase/supabase-js');

// These are typically available in the environment if the user has configured them.
// If not, I'll have to find them in .env.local
const fs = require('fs');
const path = require('path');

let supabaseUrl = '';
let supabaseKey = '';

try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const lines = envFile.split('\n');
    lines.forEach(line => {
        if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
        if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
    });
} catch (e) {
    console.error("Could not read .env.local");
}

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data, error } = await supabase.from('papelitos').select('*');
    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
}

run();
