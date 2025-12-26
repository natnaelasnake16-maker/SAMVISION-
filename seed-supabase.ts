import { supabase } from './lib/supabase';
import { PRODUCTS, BRANCHES } from './data';

async function seedDatabase() {
    console.log('🚀 Starting Seeding Process...');

    // 1. Seed Branches
    console.log('--- Seeding Branches ---');
    const branchData = BRANCHES.map(b => ({
        id: b.id, // Using existing IDs from data.ts
        name: b.name,
        address: b.address,
        phone: b.phone,
        location_lat: b.id === '11111111-1111-4111-8111-111111111111' ? 9.0331 : 8.9806, // Example coordinates
        location_lng: b.id === '11111111-1111-4111-8111-111111111111' ? 38.7501 : 38.7578
    }));

    const { error: bError } = await supabase.from('branches').upsert(branchData);
    if (bError) console.error('❌ Branch Error:', bError.message);
    else console.log('✅ Branches Seeded');

    // 2. Seed Frames
    console.log('--- Seeding Frames ---');
    for (const p of PRODUCTS) {
        if (p.category === 'lenses') continue;

        const frameRow = {
            sku: p.sku || `SV-FRM-${p.id.toUpperCase()}`,
            name: p.name,
            brand: p.brand || 'SamVision Elite',
            collection: p.collection || 'New Arrival',
            price: p.originalPrice || p.price,
            final_price: p.price,
            discount_type: p.originalPrice ? 'Fixed Amount' : null,
            discount_value: p.originalPrice ? (p.originalPrice - p.price) : 0,
            gender: p.gender === 'Men' ? 'Men' : p.gender === 'Women' ? 'Women' : 'Unisex',
            shape: p.shape as any,
            material: p.material as any,
            rim_type: p.rimType as any,
            status: 'Active',
            image: p.image,
            category: p.category as any,
            colors: p.colors || [],
            is_zeiss_compatible: p.isZeissCompatible
        };

        const { data: frame, error: fError } = await supabase.from('frames').upsert(frameRow, { onConflict: 'sku' }).select().single();
        if (fError) {
            console.error(`❌ Frame Error [${p.name}]:`, fError.message);
            continue;
        }

        // 3. Seed Stock for this frame
        if (frame && p.stockPerBranch) {
            const stockRows = Object.entries(p.stockPerBranch).map(([branchId, stock]) => ({
                frame_id: frame.id,
                branch_id: branchId,
                stock_quantity: stock.quantity,
                low_stock_threshold: stock.lowStockThreshold
            }));
            const { error: stockError } = await supabase.from('frame_branches').upsert(stockRows);
            if (stockError) console.error(`❌ Stock Error [${p.name}]:`, stockError.message);
        }

        // 4. Seed Lens Compatibility
        if (frame && p.lensCompatibility) {
            const lensRows = p.lensCompatibility.map(type => ({
                frame_id: frame.id,
                lens_type: type
            }));
            const { error: lensError } = await supabase.from('lens_compatibility').upsert(lensRows);
            if (lensError) console.error(`❌ Lens Error [${p.name}]:`, lensError.message);
        }
    }

    console.log('✨ Seeding Completed!');
}

seedDatabase();
