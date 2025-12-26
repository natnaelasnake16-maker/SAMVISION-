import { supabase } from './lib/supabase';

async function testFrames() {
    console.log('Fetching Frames with Branches...');
    const { data: frames, error } = await supabase
        .from('frames')
        .select(`
            id, 
            name, 
            frame_branches(branch_id, stock_quantity)
        `)
        .limit(5);

    if (error) {
        console.error('❌ Error:', error.message);
    } else {
        console.log(`✅ Found ${frames.length} frames.`);
        console.log(JSON.stringify(frames, null, 2));
    }
}

testFrames();
