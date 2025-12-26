import { supabase } from './lib/supabase';

async function checkImageSizes() {
    const { data, error } = await supabase.from('frames').select('id, name, sku, image');
    if (error) {
        console.error(error);
        return;
    }

    console.log(`Found ${data.length} frames.`);
    data.forEach(f => {
        const size = f.image ? f.image.length : 0;
        const isBase64 = f.image?.startsWith('data:');
        console.log(`ID: ${f.id} | Name: ${f.name} | SKU: ${f.sku} | Size: ${size} chars | Base64: ${isBase64}`);
    });
}

checkImageSizes();
