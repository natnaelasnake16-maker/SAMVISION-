import { supabase } from './lib/supabase';

async function cleanup() {
    console.log('Cleaning up test data...');
    // Delete all frames where SKU starts with 'TEST-'
    const { error } = await supabase.from('frames').delete().like('sku', 'TEST-%');

    if (error) {
        console.error('❌ Error cleaning up:', error.message);
    } else {
        console.log('✅ Cleanup complete.');
    }
}

cleanup();
