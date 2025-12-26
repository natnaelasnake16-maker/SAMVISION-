import { supabase } from './lib/supabase';

async function deleteLargeFrames() {
    console.log('Deleting large/test frames...');
    const { error } = await supabase.from('frames').delete().match({ name: '234234' });
    if (error) console.error(error);
    else console.log('✅ Deleted 234234');
}

deleteLargeFrames();
