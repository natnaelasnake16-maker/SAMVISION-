import { supabase } from './lib/supabase';

async function checkDatabase() {
    console.log('--- FRAMES ---');
    const { data: frames, error: fError } = await supabase.from('frames').select('*');
    if (fError) console.error(fError);
    else console.log(JSON.stringify(frames, null, 2));

    console.log('\n--- BRANCHES ---');
    const { data: branches, error: bError } = await supabase.from('branches').select('*');
    if (bError) console.error(bError);
    else console.log(JSON.stringify(branches, null, 2));
}

checkDatabase();
