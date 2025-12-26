import { supabase } from './lib/supabase';

async function testRLS() {
    console.log('Testing RLS on frame_branches...');

    // 1. Get a frame
    const { data: frames } = await supabase.from('frames').select('id').limit(1);
    if (!frames || frames.length === 0) {
        console.error('No frames found to test with.');
        return;
    }
    const frameId = frames[0].id;

    // 2. Get a branch
    const { data: branches } = await supabase.from('branches').select('id').limit(1);
    if (!branches || branches.length === 0) {
        console.error('No branches found to test with.');
        return;
    }
    const branchId = branches[0].id;

    console.log(`Using Frame: ${frameId}, Branch: ${branchId}`);

    // 3. Try to insert into lens_compatibility
    const { error } = await supabase.from('lens_compatibility').upsert({
        frame_id: frameId,
        lens_type: 'Single Vision'
    });

    if (error) {
        console.error('❌ RLS/DB Error:', error.message);
        console.error('Code:', error.code);
    } else {
        console.log('✅ Successfully wrote to frame_branches');
    }
}

testRLS();
