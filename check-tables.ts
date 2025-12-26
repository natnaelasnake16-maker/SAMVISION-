import { supabase } from './lib/supabase';

async function checkTables() {
    const tables = ['frames', 'branches', 'frame_branches', 'lens_compatibility', 'clinicians'];
    for (const table of tables) {
        const { error } = await supabase.from(table).select('id').limit(1);
        if (error) {
            console.log(`❌ Table '${table}' error: ${error.message}`);
        } else {
            console.log(`✅ Table '${table}' exists.`);
        }
    }
}

checkTables();
