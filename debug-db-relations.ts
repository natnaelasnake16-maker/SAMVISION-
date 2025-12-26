import { supabase } from './lib/supabase';

async function checkDatabase() {
    console.log('--- FRAMES WITH RELATIONS ---');
    const { data, error } = await supabase
        .from('frames')
        .select('*, frame_branches(*), lens_compatibility(*)')
        .eq('status', 'Active');

    if (error) {
        console.error(error);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}

checkDatabase();
