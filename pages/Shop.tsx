import React, { useState, useMemo, useEffect } from 'react';
import { ViewType, Product } from '../types';
import { supabase } from '../lib/supabase';
import { BRANCHES } from '../data';

interface ShopProps {
  onNavigate: (view: ViewType) => void;
}

const ProductCard: React.FC<{ product: Product; onClick: () => void }> = ({ product, onClick }) => {
  const isOnSale = !!product.originalPrice;

  return (
    <div className="group cursor-pointer flex flex-col space-y-3 animate-fade-up" onClick={onClick}>
      <div className="relative aspect-square bg-[#fdfdfd] rounded-2xl md:rounded-[2rem] border border-slate-100 overflow-hidden flex flex-col items-center justify-center p-4 md:p-6 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-teal-500/5 group-hover:border-primary/20">
        <div className="absolute top-3 left-3 md:top-5 md:left-5 flex flex-col gap-1.5 z-10">
          {product.homepageFlags?.isNew && (
            <span className="text-[7px] md:text-[8px] font-black px-2 md:px-3 py-0.5 md:py-1 bg-primary text-white rounded-full uppercase tracking-widest shadow-lg">New</span>
          )}
          {isOnSale && (
            <span className="text-[7px] md:text-[8px] font-black px-2 md:px-3 py-0.5 md:py-1 bg-accent text-white rounded-full uppercase tracking-widest shadow-lg">Sale</span>
          )}
        </div>

        {product.image ? (
          <img
            src={product.image}
            className="w-full h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
            alt={product.name || 'Frame'}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-4">
          <button className="bg-slate-900 text-white text-[8px] font-black px-4 py-2.5 rounded-full shadow-2xl uppercase tracking-widest transform translate-y-2 group-hover:translate-y-0 transition-transform">
            View Details
          </button>
        </div>
      </div>

      <div className="px-1 space-y-1">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5 max-w-[70%]">
            <p className="text-[7px] md:text-[8px] font-black text-primary uppercase tracking-widest opacity-80 truncate">{product.brand}</p>
            <h3 className="text-xs md:text-sm font-bold text-slate-900 tracking-tight truncate">{product.name}</h3>
          </div>
          <div className="flex items-center text-slate-400 text-[8px] md:text-[9px] font-bold">
            <svg className="w-2.5 h-2.5 fill-current text-teal-400 mr-1" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
            {product.rating?.toFixed(1) || '5.0'}
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className={`text-sm md:text-base font-black tracking-tighter ${isOnSale ? 'text-accent' : 'text-slate-900'}`}>{product.price.toLocaleString()} <span className="text-[8px] uppercase font-bold tracking-widest">ETB</span></span>
          {product.originalPrice && (
            <span className="text-[10px] text-slate-300 line-through font-bold">{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const Shop: React.FC<ShopProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedProduct]);
  const [activeCategory, setActiveCategory] = useState('All Frames');
  const [activeShape, setActiveShape] = useState('All Shapes');
  const [minPrice, setMinPrice] = useState(500);
  const [maxPrice, setMaxPrice] = useState(25000);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    setHasAttemptedFetch(true);
    try {
      // Optimize: Only fetch fields needed for shop display
      const { data, error: dbError } = await supabase
        .from('frames')
        .select(`
          *,
          frame_branches(*),
          frame_images(*)
        `)
        .eq('status', 'Active')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;

      const mappedProducts: Product[] = (data || [])
        .filter((f: any) => f && f.image) // Filter out frames without images
        .map((f: any) => ({
          id: f.id,
          sku: f.sku || '',
          name: f.name || 'Unnamed Frame',
          brand: f.brand || 'SamVision Elite',
          collection: (f.collection || 'New Arrival') as any,
          price: f.final_price || f.price || 0,
          originalPrice: f.discount_type ? f.price : undefined,
          discountType: f.discount_type === 'Fixed Amount' ? 'Fixed Amount' : (f.discount_type === 'Percentage' ? 'Percentage' : undefined),
          discountValue: f.discount_value || 0,
          image: f.image || '',
          additionalImages: (f.frame_images || []).map((img: any) => img.image),
          category: (f.category || 'frames') as any,
          gender: (f.gender || 'Unisex') as any,
          shape: (f.shape || 'Rectangle') as any,
          material: (f.material || 'Acetate') as any,
          rimType: (f.rim_type || 'Full Rim') as any,
          isZeissCompatible: f.is_zeiss_compatible ?? true,
          lensCompatibility: [], // Not needed for shop display
          colors: f.colors || [],
          status: (f.status || 'Active') as any,
          stockPerBranch: (f.frame_branches || []).reduce((acc: any, b: any) => {
            acc[b.branch_id] = { quantity: b.stock_quantity, lowStockThreshold: b.low_stock_threshold };
            return acc;
          }, {}),
          homepageFlags: f.flags || { isNew: false, isPopular: false, isDiscountPromo: false }
        }));

      setProducts(mappedProducts);
      setError(null); // Clear any previous errors on success
    } catch (err: any) {
      console.error('Error fetching shop products:', err);
      const errorMessage = err.message || err.error_description || 'Failed to load products. Please check your connection.';
      setError(errorMessage);
      // Don't clear products on error - show stale data if available
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('shop_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'frames' }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const categories = ['All Frames', 'Eyeglasses', 'Sunglasses', 'ZEISS Lenses'];
  const shapes = ['All Shapes', 'Round', 'Rectangle', 'Square', 'Cat-Eye', 'Aviator'];

  // Extract unique colors from all products
  const uniqueColors = useMemo(() => {
    const colors = new Set<string>();
    products?.forEach(p => {
      p.colors?.forEach(c => {
        if (c) colors.add(c);
      });
    });
    return Array.from(colors);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let results = [...products];

    // Category Filter
    if (activeCategory === 'Eyeglasses') results = results.filter(p => p.category === 'frames');
    else if (activeCategory === 'Sunglasses') results = results.filter(p => p.category === 'sunglasses');
    else if (activeCategory === 'ZEISS Lenses') results = results.filter(p => p.category === 'lenses');

    // Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
      );
    }

    // Shape Filter
    if (activeShape !== 'All Shapes') {
      results = results.filter(p => p.shape === activeShape);
    }

    // Price Range Filter
    results = results.filter(p => {
      const price = p.price || 0;
      return price >= minPrice && price <= maxPrice;
    });

    // Color Filter
    if (selectedColor) {
      results = results.filter(p => p.colors?.includes(selectedColor));
    }

    return results;
  }, [products, activeCategory, activeShape, minPrice, maxPrice, selectedColor, searchQuery]);

  const clearAllFilters = () => {
    setActiveCategory('All Frames');
    setActiveShape('All Shapes');
    setMinPrice(500);
    setMaxPrice(25000);
    setSelectedColor(null);
    setSearchQuery('');
  };

  return (
    <div className="bg-[#fbfcfd] min-h-screen">
      <div className="h-16 md:h-20" />

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-screen relative">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden sticky top-16 md:top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            <span>Filters</span>
            {(activeCategory !== 'All Frames' || activeShape !== 'All Shapes' || minPrice > 500 || maxPrice < 25000 || selectedColor) && (
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            )}
          </button>
          <div className="flex flex-col items-end">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{filteredProducts.length} Frames</p>
          </div>
        </div>

        {/* Enhanced Sidebar Filter */}
        <aside className={`fixed inset-0 lg:relative lg:inset-auto z-[110] lg:z-0 lg:w-80 flex-shrink-0 lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] overflow-y-auto p-6 md:p-8 lg:border-r border-slate-100 space-y-12 no-scrollbar bg-white lg:bg-transparent transition-transform duration-500 transform ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          {/* Mobile Close Button */}
          <div className="lg:hidden flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
            <h2 className="text-xl font-black text-slate-900 tracking-tighter">FILTERS</h2>
            <button onClick={() => setIsFilterOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Categories</h3>
            <div className="flex flex-row lg:flex-col overflow-x-auto no-scrollbar lg:overflow-x-visible gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 text-left px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Price Range</h3>
              <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">{minPrice.toLocaleString()} - {maxPrice.toLocaleString()} ETB</span>
            </div>
            <div className="space-y-4 px-2">
              {/* Min Price Slider */}
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Minimum</label>
                <input
                  type="range"
                  min="500"
                  max="25000"
                  step="250"
                  value={minPrice}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value);
                    if (newMin <= maxPrice) setMinPrice(newMin);
                  }}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>500 ETB</span>
                  <span className="text-primary font-black">{minPrice.toLocaleString()} ETB</span>
                  <span>25,000 ETB</span>
                </div>
              </div>
              {/* Max Price Slider */}
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Maximum</label>
                <input
                  type="range"
                  min="500"
                  max="25000"
                  step="250"
                  value={maxPrice}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value);
                    if (newMax >= minPrice) setMaxPrice(newMax);
                  }}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>500 ETB</span>
                  <span className="text-primary font-black">{maxPrice.toLocaleString()} ETB</span>
                  <span>25,000 ETB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Frame Shape */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Frame Shape</h3>
            <div className="flex flex-row lg:flex-col overflow-x-auto no-scrollbar lg:overflow-x-visible gap-2">
              {shapes.map((shape) => (
                <button
                  key={shape}
                  onClick={() => setActiveShape(shape)}
                  className={`flex-shrink-0 text-left px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeShape === shape ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Color Palette</h3>
              {selectedColor && (
                <button onClick={() => setSelectedColor(null)} className="text-[9px] font-black text-primary uppercase">Reset</button>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {uniqueColors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color === selectedColor ? null : color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 ${selectedColor === color ? 'border-primary scale-110 shadow-lg' : 'border-transparent hover:scale-110'}`}
                >
                  <div
                    className="w-full h-full rounded-full shadow-inner border border-black/5"
                    style={{ backgroundColor: color }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50 space-y-4">
            <button
              onClick={clearAllFilters}
              className="w-full py-4 glass border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-all rounded-xl text-[9px] font-black uppercase tracking-[0.2em]"
            >
              Clear All Filters
            </button>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="lg:hidden w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow p-6 md:p-8 lg:p-12 space-y-12">
          {loading && products.length === 0 && (
            <div className="flex items-center justify-center py-32">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm font-medium text-slate-500">Loading products...</p>
              </div>
            </div>
          )}

          {error && !loading && products.length === 0 && hasAttemptedFetch && (
            <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-4 animate-fade-up">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <p className="text-xs font-black text-red-500 uppercase tracking-widest leading-none">Shop Data Unavailable</p>
                <p className="text-sm font-bold text-red-900 mt-1">{error}</p>
                <button onClick={() => fetchProducts()} className="mt-3 text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline">Reload Inventory</button>
              </div>
            </div>
          )}

          {/* Top Hero / Promo Strip */}
          <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden aspect-[16/7] md:aspect-[16/4] group shadow-soft">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent z-10 p-8 md:p-16 flex flex-col justify-center">
              <p className="text-primary font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px] mb-3">Limited Collection</p>
              <h2 className="text-white font-black tracking-tighter text-3xl md:text-6xl mb-6 leading-[0.9]">ULTRA-THIN <br />TITANIUM.</h2>
              <button className="bg-white text-slate-900 px-10 py-3.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all w-fit shadow-2xl">Explore Series</button>
            </div>
            <img src="/images/shop/banner.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]" alt="Shop Banner" />
          </div>

          {/* Grid System */}
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-10 gap-8">
              <div className="space-y-4 flex-grow max-w-2xl">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by model name, brand, or SKU..."
                    className="w-full bg-white border-2 border-slate-100 py-4 pl-14 pr-12 rounded-[2rem] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-300 hover:text-slate-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight mr-4">{activeCategory}</h2>
                  {activeShape !== 'All Shapes' && <span className="text-[8px] font-black uppercase bg-slate-100 px-3 py-1.5 rounded-full text-slate-500 border border-slate-200">{activeShape}</span>}
                  {(minPrice > 500 || maxPrice < 25000) && (
                    <span className="text-[8px] font-black uppercase bg-slate-100 px-3 py-1.5 rounded-full text-slate-500 border border-slate-200">
                      {minPrice.toLocaleString()} - {maxPrice.toLocaleString()} ETB
                    </span>
                  )}
                  {selectedColor && <span className="text-[8px] font-black uppercase bg-slate-100 px-3 py-1.5 rounded-full text-slate-500 border border-slate-200 flex items-center gap-1.5"><div className="w-2 h-2 rounded-full border border-black/10" style={{ backgroundColor: selectedColor }} /> Color Filter</span>}
                  {searchQuery && <span className="text-[8px] font-black uppercase bg-primary/10 px-3 py-1.5 rounded-full text-primary border border-primary/10">Search: "{searchQuery}"</span>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{filteredProducts.length} Results Found</p>
                {filteredProducts.length < products.length && (
                  <button onClick={clearAllFilters} className="text-[9px] font-black text-primary uppercase tracking-[0.1em] hover:underline mt-1">Clear All</button>
                )}
              </div>
            </div>

            {/* High Density Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-32 text-center space-y-6">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-900 text-lg font-black tracking-tight">No frames found</p>
                  <p className="text-slate-400 text-sm font-medium">Try adjusting your filters or price range to discover more styles.</p>
                </div>
                <button onClick={clearAllFilters} className="text-primary font-black text-[10px] uppercase tracking-widest hover:underline underline-offset-4">Reset All Filters</button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-12 overflow-y-auto">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl transition-opacity animate-fade-in" onClick={() => setSelectedProduct(null)} />

          <div className="relative w-full max-w-4xl bg-white border border-white/20 shadow-[0_100px_100px_-50px_rgba(0,0,0,0.5)] animate-fade-up rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col md:flex-row max-h-[95vh] md:max-h-[85vh]">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-50 w-8 h-8 md:w-10 md:h-10 rounded-full glass border-slate-200/60 hover:bg-slate-50 flex items-center justify-center transition-all group"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-500 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="md:w-[45%] bg-slate-50/80 relative flex-shrink-0 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent opacity-60" />

              <div
                className="w-full h-full flex items-center overflow-x-auto snap-x snap-mandatory no-scrollbar"
                onScroll={(e) => {
                  const scrollLeft = (e.target as HTMLDivElement).scrollLeft;
                  const width = (e.target as HTMLDivElement).clientWidth;
                  const index = Math.round(scrollLeft / width);
                  setCurrentImageIndex(index);
                }}
              >
                {[selectedProduct.image, ...(selectedProduct.additionalImages || [])].filter(Boolean).map((img, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center p-4 sm:p-6 md:p-12">
                    <img src={img} className="w-full h-40 sm:h-48 md:h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.1)] relative z-10 transition-transform duration-700 hover:scale-105" alt={`${selectedProduct.name} - View ${idx + 1}`} />
                  </div>
                ))}
              </div>

              {/* Pagination Dots */}
              {((selectedProduct.additionalImages?.length || 0) > 0) && (
                <div className="absolute bottom-6 flex space-x-2 z-20">
                  {[selectedProduct.image, ...(selectedProduct.additionalImages || [])].filter(Boolean).map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${currentImageIndex === idx ? 'bg-primary w-4' : 'bg-slate-300'}`}
                    />
                  ))}
                </div>
              )}

              {/* Swipe/Scroll Hint for Mobile */}
              {((selectedProduct.additionalImages?.length || 0) > 0) && (
                <div className="absolute bottom-10 text-[7px] font-black text-slate-300 uppercase tracking-widest md:hidden animate-pulse">
                  Swipe for more angles
                </div>
              )}
            </div>

            <div className="md:w-[55%] p-6 sm:p-8 md:p-12 lg:p-14 space-y-5 md:space-y-10 overflow-y-auto bg-white flex flex-col justify-center">
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[0.4em] opacity-80">{selectedProduct.brand}</p>
                  {selectedProduct.homepageFlags?.isNew && <span className="text-[6.5px] md:text-[7px] font-black px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase tracking-widest border border-primary/10">New Arrival</span>}
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">{selectedProduct.name}</h2>
                <p className="text-[10px] md:text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-sm">Optimized for ZEISS precision lenses. Part of the limited {selectedProduct.collection} series.</p>
              </div>

              <div className="space-y-1 md:space-y-1.5">
                <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Price Points</p>
                <div className="flex items-baseline space-x-3">
                  <span className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter leading-none">{selectedProduct.price.toLocaleString()} <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest ml-1 font-bold">ETB</span></span>
                  {selectedProduct.originalPrice && <span className="text-base md:text-lg text-slate-300 line-through font-bold opacity-70">{selectedProduct.originalPrice.toLocaleString()}</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <div className="p-3 md:p-4 bg-slate-50/80 border border-slate-100 rounded-2xl space-y-0.5">
                  <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest">Material</p>
                  <p className="text-[10px] md:text-xs font-bold text-slate-800 tracking-tight truncate">{selectedProduct.material} • {selectedProduct.rimType}</p>
                </div>
                <div className="p-3 md:p-4 bg-slate-50/80 border border-slate-100 rounded-2xl space-y-0.5">
                  <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest">Lens Optics</p>
                  <p className="text-[10px] md:text-xs font-bold text-slate-800 tracking-tight truncate">ZEISS Compatible</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">In-Store Inventory</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
                  {Object.entries(selectedProduct.stockPerBranch || {})
                    .filter(([, stock]) => (stock as any).quantity > 0)
                    .map(([branchId]) => {
                      const branch = BRANCHES.find(b => b.id === branchId);
                      return branch ? (
                        <div key={branchId} className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-xl border border-slate-100/50">
                          <div className="flex items-center space-x-2">
                            <div className="w-1 h-1 rounded-full bg-teal-400" />
                            <span className="text-[10px] font-bold text-slate-700">{branch.name}</span>
                          </div>
                          <span className="text-[7px] font-black text-primary uppercase tracking-widest">Available</span>
                        </div>
                      ) : null;
                    })}
                  {(!selectedProduct.stockPerBranch || Object.values(selectedProduct.stockPerBranch).every(s => (s as any).quantity === 0)) && (
                    <div className="p-2.5 bg-orange-50/50 border border-orange-100 rounded-xl flex items-center space-x-2 text-orange-600">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <span className="text-[8px] font-bold uppercase tracking-widest">Request Stock Check</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 md:gap-3 pt-2">
                <a
                  href="tel:+251941545454"
                  className="bg-primary text-white py-3 md:py-4 rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-teal-500/10 transition-all transform hover:translate-y-[-2px] active:translate-y-0 flex items-center justify-center space-x-2"
                >
                  <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span>Inquire Now</span>
                </a>
                <button
                  onClick={() => {
                    const message = `Hi SamVision! I'm interested in the ${selectedProduct.brand} ${selectedProduct.name} frame (${selectedProduct.price.toLocaleString()} ETB). Is it currently in stock?`;
                    window.open(`https://wa.me/251941545454?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="bg-slate-900 text-white py-3 md:py-4 rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all transform hover:translate-y-[-2px] active:translate-y-0 flex items-center justify-center space-x-2"
                >
                  <img src="https://www.svgrepo.com/show/475692/whatsapp-color.svg" className="w-3.5 h-3.5 md:w-4 md:h-4" alt="WhatsApp" />
                  <span>WhatsApp Optician</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
