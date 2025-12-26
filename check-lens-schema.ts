import { supabase } from './lib/supabase';

async function checkSchema() {
    const { data, error } = await supabase.from('lens_compatibility').select('*').limit(1);
    if (error) console.error(error);
    else {
        console.log('Sample Row from lens_compatibility:');
        console.log(JSON.stringify(data[0], null, 2));
    }
}
checkSchema();
