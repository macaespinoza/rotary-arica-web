const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://wpqnlyhlnknkxqieajsf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwcW5seWhsbmtua3hxaWVhanNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTc5NjQsImV4cCI6MjA5MjE5Mzk2NH0.nZWawMWrOeDHVPg5h_TJNJqdYsu8YZdll8RK0ZIrMxU');

async function test() {
  const { data, error } = await supabase.from('ediciones').select('id').limit(1);
  console.log('Ediciones Error:', error);
  console.log('Ediciones Data:', data);
  
  const { data: eData, error: eError } = await supabase.from('events').select('id').limit(1);
  console.log('Events Error:', eError);
  console.log('Events Data:', eData);
}

test();
