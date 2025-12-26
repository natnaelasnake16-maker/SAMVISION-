import { supabase } from './lib/supabase';

async function resetBasic() {
    console.log('Resetting frames with minimal data...');
    await supabase.from('frames').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const { error } = await supabase.from('frames').insert([
        {
            sku: 'MIN-1',
            name: 'Minimal Frame 1',
            brand: 'Basic',
            price: 1000,
            final_price: 1000,
            status: 'Active',
            category: 'frames',
            gender: 'Unisex',
            image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=200'
        }
    ]);

    if (error) console.error(error);
    else console.log('✅ Basic frame inserted');
}

resetBasic();
