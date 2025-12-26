import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ViewType, Product, Branch, BranchStock } from '../types';
import GlassCard from '../components/GlassCard';
import { BRANCHES } from '../data';
import { supabase } from '../lib/supabase';

interface AdminProps {
  onNavigate: (view: ViewType) => void;
}

type AdminModule = 'overview' | 'frames' | 'lenses' | 'promotions' | 'inventory' | 'categories' | 'reservations' | 'content' | 'settings';
type ViewMode = 'list' | 'form';

// SVG Assets for image-based selection
const SVG_ASSETS = {
  SHAPES: {
    Round: "https://www.svgrepo.com/show/491959/glasses-round.svg",
    Rectangle: "https://www.svgrepo.com/show/491958/glasses-rectangular.svg",
    Square: "https://www.svgrepo.com/show/491960/glasses-square.svg",
    "Cat-Eye": "https://www.svgrepo.com/show/491956/glasses-cat-eye.svg",
    Aviator: "https://www.svgrepo.com/show/491955/glasses-aviator.svg",
    Oversized: "https://www.svgrepo.com/show/491957/glasses-fashion.svg"
  },
  LENSES: {
    "Single Vision": "https://www.svgrepo.com/show/288476/eye-glasses-glasses.svg",
    Progressive: "https://www.svgrepo.com/show/486242/eye-protection.svg",
    "Blue Light": "https://www.svgrepo.com/show/491322/computer.svg",
    Photochromic: "https://www.svgrepo.com/show/489956/sun.svg"
  }
};

const sidebarItems: { id: AdminModule; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg> },
  { id: 'frames', label: 'Frames Catalogue', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> },
  { id: 'lenses', label: 'Lenses Management', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
  { id: 'inventory', label: 'Stock & Inventory', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  { id: 'promotions', label: 'Sale & Promotions', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg> },
  { id: 'categories', label: 'Categories', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> },
  { id: 'reservations', label: 'Booking Manager', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  { id: 'content', label: 'Blog & Content', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg> },
  { id: 'settings', label: 'Settings', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
];

const COLOR_OPTIONS = [
  { name: 'Piano Black', hex: '#000000' },
  { name: 'Tortoise Shell', hex: '#8B4513' },
  { name: 'Crystal Clear', hex: '#E5E4E2' },
  { name: 'Gunmetal', hex: '#808080' },
  { name: 'Champagne Gold', hex: '#D4AF37' },
  { name: 'Navy Matte', hex: '#000080' },
  { name: 'Ruby Red', hex: '#DC143C' },
  { name: 'Forest Green', hex: '#228B22' },
];

const SHAPE_OPTIONS = ['Round', 'Rectangle', 'Square', 'Cat-Eye', 'Aviator', 'Oversized'];
const MATERIAL_OPTIONS = ['Acetate', 'Metal', 'Titanium', 'Mixed'];
const RIM_OPTIONS = ['Full Rim', 'Semi Rimless', 'Rimless'];
const COLLECTION_OPTIONS = ['New Arrival', 'Popular', 'Premium', 'Budget', 'Limited Edition'];
const LENS_TYPES = ['Single Vision', 'Progressive', 'Blue Light', 'Photochromic'];

const Admin: React.FC<AdminProps> = ({ onNavigate }) => {
  const [activeModule, setActiveModule] = useState<AdminModule>('overview');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Please select an image under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 800;

          if (width > height && width > maxDim) {
            height = (height * maxDim) / width;
            width = maxDim;
          } else if (height > maxDim) {
            width = (width * maxDim) / height;
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.7);
          setFormData({ ...formData, image: compressed });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    setHasAttemptedFetch(true);
    try {
      const { data, error: dbError } = await supabase
        .from('frames')
        .select(`
          *,
          frame_branches(*),
          lens_compatibility(*)
        `)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;

      const mappedProducts: Product[] = (data || [])
        .filter(f => f && f.id) // Filter out invalid entries
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
          category: (f.category || 'frames') as any,
          gender: (f.gender || 'Unisex') as any,
          shape: (f.shape || 'Rectangle') as any,
          material: (f.material || 'Acetate') as any,
          rimType: (f.rim_type || 'Full Rim') as any,
          isZeissCompatible: f.is_zeiss_compatible ?? true,
          lensCompatibility: (f.lens_compatibility || []).map((l: any) => l?.lens_type).filter((l: string) => l),
          colors: f.colors || [],
          status: (f.status || 'Draft') as any,
          homepageFlags: f.flags || { isNew: false, isPopular: false, isDiscountPromo: false },
          stockPerBranch: (f.frame_branches || []).reduce((acc: any, b: any) => {
            if (b && b.branch_id) {
              acc[b.branch_id] = {
                quantity: b.stock_quantity || 0,
                lowStockThreshold: b.low_stock_threshold || 5,
                status: b.availability || 'Out of stock'
              };
            }
            return acc;
          }, {})
        }));

      setProducts(mappedProducts);
      setError(null); // Clear any previous errors on success
    } catch (err: any) {
      console.error('Error fetching products:', err);
      const errorMessage = err.message || err.error_description || 'Failed to connect to database. Please check your connection.';
      setError(errorMessage);
      // Don't clear products on error - show stale data if available
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setErrors({});
    setViewMode('form');
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setErrors({});
    setFormData({
      sku: '',
      name: '',
      brand: 'SamVision Elite',
      collection: 'New Arrival',
      price: 0,
      category: 'frames',
      gender: 'Unisex',
      shape: 'Rectangle',
      material: 'Acetate',
      rimType: 'Full Rim',
      isZeissCompatible: true,
      lensCompatibility: ['Single Vision'],
      colors: [],
      status: 'Active',
      stockPerBranch: BRANCHES.reduce((acc, b) => {
        acc[b.id] = { quantity: 0, lowStockThreshold: 5, status: 'Out of stock' };
        return acc;
      }, {} as Record<string, BranchStock>),
      homepageFlags: { isNew: true, isPopular: false, isDiscountPromo: false }
    });
    setViewMode('form');
  };

  const handleSave = async (status: 'Active' | 'Draft' | 'Archived') => {
    try {
      setLoading(true);
      setErrors({});

      // Validation
      const validationErrors: Record<string, string> = {};
      if (!formData.sku || formData.sku.trim() === '') {
        validationErrors.sku = 'SKU is required';
      }
      if (!formData.name || formData.name.trim() === '') {
        validationErrors.name = 'Name is required';
      }
      if (!formData.price || formData.price <= 0) {
        validationErrors.price = 'Price must be greater than 0';
      }
      if (!formData.image) {
        validationErrors.image = 'Image is required';
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        alert('Please fill in all required fields');
        return;
      }

      const submission = { ...formData, status } as Product;

      // Calculate final price with proper null handling
      let finalPrice: number;
      if (submission.originalPrice && submission.discountType) {
        if (submission.discountType === 'Percentage') {
          finalPrice = submission.price * (1 - (submission.discountValue || 0) / 100);
        } else {
          finalPrice = Math.max(0, submission.price - (submission.discountValue || 0));
        }
      } else {
        finalPrice = submission.price;
      }

      // Ensure finalPrice is valid
      if (isNaN(finalPrice) || finalPrice <= 0) {
        finalPrice = submission.price;
      }

      const { data: frame, error: frameError } = await supabase
        .from('frames')
        .upsert({
          id: editingProduct?.id,
          sku: submission.sku!.trim(),
          name: submission.name!.trim(),
          brand: submission.brand || 'SamVision Elite',
          collection: submission.collection || 'New Arrival',
          price: submission.price!,
          final_price: finalPrice,
          discount_type: submission.discountType || null,
          discount_value: submission.discountValue || 0,
          gender: submission.gender || null,
          shape: submission.shape || null,
          material: submission.material || null,
          rim_type: submission.rimType || null,
          status: submission.status || 'Draft',
          category: submission.category || 'frames',
          flags: {
            ...(submission.homepageFlags || { isNew: true, isPopular: false, isDiscountPromo: false }),
            isDiscountPromo: !!submission.originalPrice
          },
          image: submission.image || null,
          colors: submission.colors && submission.colors.length > 0 ? submission.colors : null,
          is_zeiss_compatible: submission.isZeissCompatible ?? true
        })
        .select('id')
        .single();

      if (frameError) throw frameError;

      // Run stock and lens operations in parallel for better performance
      const stockPromise = submission.stockPerBranch && Object.keys(submission.stockPerBranch).length > 0
        ? (async () => {
          const stockRows = Object.entries(submission.stockPerBranch!).map(([branchId, stock]) => ({
            frame_id: frame.id,
            branch_id: branchId,
            stock_quantity: stock?.quantity || 0,
            low_stock_threshold: stock?.lowStockThreshold || 5
          }));
          const { error: stockError } = await supabase
            .from('frame_branches')
            .upsert(stockRows, { onConflict: 'frame_id,branch_id' });
          if (stockError) throw stockError;
        })()
        : Promise.resolve();

      const lensPromise = (async () => {
        await supabase.from('lens_compatibility').delete().eq('frame_id', frame.id);
        if (submission.lensCompatibility && submission.lensCompatibility.length > 0) {
          const lensRows = submission.lensCompatibility
            .filter(type => type && type.trim() !== '')
            .map(type => ({
              frame_id: frame.id,
              lens_type: type
            }));

          if (lensRows.length > 0) {
            const { error: lensError } = await supabase.from('lens_compatibility').insert(lensRows);
            if (lensError) throw lensError;
          }
        }
      })();

      // Wait for both operations in parallel
      await Promise.all([stockPromise, lensPromise]);

      // Optimistically update the UI - convert submission to Product format and update state
      const newProduct: Product = {
        id: frame.id,
        sku: submission.sku!,
        name: submission.name!,
        brand: submission.brand || 'SamVision Elite',
        collection: submission.collection || 'New Arrival',
        price: finalPrice,
        originalPrice: submission.originalPrice,
        discountType: submission.discountType,
        discountValue: submission.discountValue,
        image: submission.image || '',
        category: submission.category || 'frames',
        gender: submission.gender || 'Unisex',
        shape: submission.shape || 'Rectangle',
        material: submission.material || 'Acetate',
        rimType: submission.rimType || 'Full Rim',
        isZeissCompatible: submission.isZeissCompatible ?? true,
        lensCompatibility: submission.lensCompatibility || [],
        colors: submission.colors || [],
        status: submission.status || 'Draft',
        homepageFlags: submission.homepageFlags || { isNew: true, isPopular: false, isDiscountPromo: false },
        stockPerBranch: submission.stockPerBranch || {}
      };

      // Update products list optimistically
      if (editingProduct) {
        // Update existing product
        setProducts(prevProducts =>
          prevProducts.map(p => p.id === frame.id ? newProduct : p)
        );
      } else {
        // Add new product at the beginning
        setProducts(prevProducts => [newProduct, ...prevProducts]);
      }

      // Switch to list view immediately
      setViewMode('list');
      setEditingProduct(null);
      setFormData({});
      setLoading(false);

      // Optionally fetch in background to ensure data consistency (non-blocking)
      fetchProducts().catch(err => console.error('Background refresh failed:', err));
    } catch (err: any) {
      console.error('Save error:', err);
      alert("Error saving: " + (err.message || 'Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleClone = async (product: Product) => {
    if (!confirm('Create a clone?')) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.from('frames').insert({
        sku: `${product.sku}-CLONE-${Date.now().toString().slice(-4)}`,
        name: `${product.name} (Copy)`,
        brand: product.brand,
        collection: product.collection,
        price: product.originalPrice || product.price,
        final_price: product.price,
        discount_type: product.discountType === 'Fixed Amount' ? 'Fixed Amount' : (product.discountType === 'Percentage' ? 'Percentage' : null),
        discount_value: product.discountValue || 0,
        gender: product.gender,
        shape: product.shape,
        material: product.material,
        rim_type: product.rimType,
        status: 'Draft',
        category: product.category,
        flags: product.homepageFlags,
        image: product.image,
        colors: product.colors,
        is_zeiss_compatible: product.isZeissCompatible
      }).select('id').single();

      if (error) throw error;

      if (product.lensCompatibility.length > 0) {
        await supabase.from('lens_compatibility').insert(product.lensCompatibility.map(type => ({
          frame_id: data.id,
          lens_type: type
        })));
      }

      await supabase.from('frame_branches').insert(Object.entries(product.stockPerBranch).map(([branchId, stock]) => ({
        frame_id: data.id,
        branch_id: branchId,
        stock_quantity: stock.quantity,
        low_stock_threshold: stock.lowStockThreshold
      })));

      await fetchProducts();
    } catch (err: any) {
      alert("Clone error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to PERMANENTLY delete this frame? This will remove all stock and compatibility data. This action cannot be undone.')) return;
    try {
      setLoading(true);

      // 1. Delete dependent records first (to ensure no FKey constraints block the delete)
      await supabase.from('frame_branches').delete().eq('frame_id', id);
      await supabase.from('lens_compatibility').delete().eq('frame_id', id);

      // 2. Delete the main frame record
      const { error } = await supabase.from('frames').delete().eq('id', id);

      if (error) throw error;

      // Optimistically update the UI
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));

      // Refresh to ensure consistency
      fetchProducts().catch(err => console.error('Background refresh failed:', err));
    } catch (err: any) {
      console.error('Delete error:', err);
      alert("Delete error: " + (err.message || 'Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const renderFrames = () => {
    const filteredFrames = products.filter(p =>
      p.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(adminSearchQuery.toLowerCase())
    );

    return (
      <div className="space-y-10 animate-fade-up">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-100 pb-10 gap-8">
          <div className="flex-grow max-w-2xl space-y-4">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Frames Catalog</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Manage Frame Models, Pricing & Global Attributes</p>
            </div>

            <div className="relative group max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={adminSearchQuery}
                onChange={(e) => setAdminSearchQuery(e.target.value)}
                placeholder="Quick search by name, brand or SKU..."
                className="w-full bg-white/50 border border-slate-200 py-3.5 pl-11 pr-10 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
              />
              {adminSearchQuery && (
                <button
                  onClick={() => setAdminSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-slate-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-slate-800 active:scale-95 transition-all shrink-0 h-fit"
          >
            Add New Style Entry
          </button>
        </div>

        <div className="glass-panel overflow-hidden border-slate-100 bg-white/60 shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Model Details</th>
                <th className="px-6 py-6">Attributes</th>
                <th className="px-6 py-6 font-center text-center">Commercials</th>
                <th className="px-6 py-6 text-center">Global Stock</th>
                <th className="px-6 py-6 text-center">Status</th>
                <th className="px-10 py-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFrames.map(p => (
                <tr key={p.id} className="hover:bg-white/40 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 bg-white rounded-2xl p-2 border border-gray-100 shadow-sm flex items-center justify-center relative">
                        {p.image ? (
                          <img src={p.image} className="max-w-full max-h-full object-contain mix-blend-multiply" alt={p.name || 'Frame'} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 tracking-tight leading-tight">{p.name}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">CODE: {p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-xs text-gray-500 font-medium">
                    {p.material} • {p.shape} • {p.gender}
                  </td>
                  <td className="px-6 py-6 text-sm font-black text-gray-900">
                    {p.price.toLocaleString()} ETB
                  </td>
                  <td className="px-6 py-6 text-center text-sm font-black text-gray-900">
                    {(Object.values(p.stockPerBranch) as BranchStock[]).reduce((acc, s) => acc + (s.quantity || 0), 0)}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${p.status === 'Active' ? 'bg-teal-50 text-teal-600' : 'bg-gray-100 text-gray-400'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => handleEdit(p)} className="p-2 hover:bg-primary hover:text-white rounded-lg transition-all text-slate-400 border border-slate-100" title="Edit Frame"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                      <button onClick={() => handleClone(p)} className="p-2 hover:bg-slate-900 hover:text-white rounded-lg transition-all text-slate-400 border border-slate-100" title="Clone Frame"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-all text-slate-400 border border-slate-100" title="Delete Frame"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderInventory = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-up">
      {BRANCHES.map(branch => {
        const branchStock = products.map(p => ({
          name: p.name,
          qty: p.stockPerBranch[branch.id]?.quantity || 0,
          threshold: p.stockPerBranch[branch.id]?.lowStockThreshold || 5,
          image: p.image
        }));
        const alerts = branchStock.filter(s => s.qty > 0 && s.qty <= s.threshold).length;

        return (
          <GlassCard key={branch.id} className="p-8 border-white bg-white/50 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-tight">{branch.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{branch.address.split(',')[0]}</p>
              </div>
              {alerts > 0 && <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-100">{alerts} Alerts</span>}
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
              {branchStock.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100">
                  <div className="flex items-center space-x-3">
                    {s.image ? (
                      <img src={s.image} className="w-8 h-8 object-contain" alt={s.name || 'Frame'} />
                    ) : (
                      <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <span className="text-[11px] font-bold text-slate-700">{s.name || 'Unnamed Frame'}</span>
                  </div>
                  <span className={`text-xs font-black ${s.qty <= s.threshold ? 'text-red-500' : 'text-slate-900'}`}>{s.qty}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        );
      })}
    </div>
  );

  const renderOverview = () => {
    // Advanced Analytics Calculations
    const activeCount = products.filter(p => p.status === 'Active').length;
    const draftCount = products.filter(p => p.status === 'Draft').length;

    let totalValue = 0;
    let totalStockCount = 0;
    const categoryCounts: Record<string, number> = {};
    const materialCounts: Record<string, number> = {};
    const brandCounts: Record<string, number> = {};
    const lowStockItems: any[] = [];
    const branchVolume: Record<string, number> = {};

    products.forEach(p => {
      const stock = Object.values(p.stockPerBranch) as BranchStock[];
      const pStock = stock.reduce((sum, s) => sum + (s.quantity || 0), 0);
      totalStockCount += pStock;
      totalValue += (p.price * pStock);

      // Branch Distribution
      Object.entries(p.stockPerBranch).forEach(([bid, s]: [string, any]) => {
        branchVolume[bid] = (branchVolume[bid] || 0) + (s.quantity || 0);
      });

      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
      materialCounts[p.material] = (materialCounts[p.material] || 0) + 1;
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;

      stock.forEach((s, i) => {
        if (s.quantity > 0 && s.quantity <= s.lowStockThreshold) {
          lowStockItems.push({ name: p.name, sku: p.sku, branch: BRANCHES[i]?.name || 'Unknown', qty: s.quantity });
        }
      });
    });

    const topBrand = Object.entries(brandCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return (
      <div className="space-y-12 animate-fade-up">
        {/* Superior Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-4">
          <div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight italic">Executive Insight</h2>
            <div className="flex items-center space-x-3 mt-3">
              <span className="w-12 h-[2px] bg-primary"></span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Global Operations Control</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="glass-panel px-6 py-4 bg-white/40 border-white shadow-sm flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inventory Value</p>
                <p className="text-xl font-black text-slate-900 tracking-tighter">{(totalValue / 1000).toFixed(1)}K <span className="text-[10px]">ETB</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Primary KPI Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Active Catalog', value: activeCount, trend: `+${draftCount} pending`, color: 'bg-primary' },
            { label: 'Unit Distribution', value: totalStockCount.toLocaleString(), trend: 'Global Stock', color: 'bg-slate-900' },
            { label: 'Market Leader', value: topBrand, trend: 'Top Brand', color: 'bg-indigo-600' },
            { label: 'Zeiss Match', value: `${Math.round((products.filter(p => p.isZeissCompatible).length / (products.length || 1)) * 100)}%`, trend: 'Certified', color: 'bg-sky-500' }
          ].map((s, i) => (
            <div key={i} className="group relative">
              <div className="absolute inset-0 bg-white/40 blur-xl rounded-[2.5rem] -z-10 group-hover:bg-white/60 transition-all"></div>
              <GlassCard className="p-8 border-white/60 bg-white/40 backdrop-blur-3xl hover:translate-y-[-4px] transition-all duration-500 border-2">
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{s.trend}</span>
                </div>
                <p className="text-4xl font-black text-slate-900 tracking-tighter truncate">{s.value}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">{s.label}</p>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* Analytics Layer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Section: Branch Performance */}
          <div className="lg:col-span-2 glass-panel p-10 bg-white/40 border-white border-2">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.4em]">Branch Performance</h3>
                <p className="text-[10px] text-slate-400 mt-1">Inventory density & distribution per outlet</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-[9px] font-black uppercase text-slate-500">Live Volume</span>
              </div>
            </div>

            <div className="space-y-8">
              {BRANCHES.map(branch => {
                const vol = branchVolume[branch.id] || 0;
                const percentage = Math.round((vol / (totalStockCount || 1)) * 100);
                return (
                  <div key={branch.id} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-400">
                          {branch.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800">{branch.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">{branch.address.split(',')[0]}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">{vol.toLocaleString()} <span className="text-[10px] text-slate-400">Units</span></p>
                        <p className="text-[9px] font-black text-primary mt-0.5">{percentage}% Share</p>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-100/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-teal-400 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Digital Traffic */}
          <div className="glass-panel p-10 bg-slate-900 border-slate-800 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.4em]">Site Traffic</h3>
              <p className="text-[10px] text-white/20 font-medium">Real-time visitor engagement (24h)</p>
            </div>

            <div className="my-10 space-y-8">
              <div className="flex flex-col items-center">
                <p className="text-6xl font-black text-white tracking-tighter leading-none italic">1,420</p>
                <div className="flex items-center space-x-2 mt-4">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Active Visitors Now</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] text-center">User Acquisition Channels</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] font-black text-white">Direct</p>
                    <p className="text-[9px] text-white/30 mt-1">45%</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] font-black text-white">Social</p>
                    <p className="text-[9px] text-white/30 mt-1">32%</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
              Launch Analytics Hub
            </button>
          </div>

        </div>

        {/* Global Catalog Intelligence Strip */}
        <div className="relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-white/5 to-transparent rounded-[2.5rem]"></div>
          <GlassCard className="p-12 border-white/40 bg-white/20 backdrop-blur-2xl rounded-[2.5rem] border-2">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
              <div className="max-w-2xl space-y-6">
                <div className="w-16 h-1 bg-primary"></div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-[1.1]">Strategic Catalog Optimized for <br /><span className="text-primary italic">High-Precision Optics</span></h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Systematic analysis indicates that {materialCounts['Titanium'] || 0} of your style models are classified as 'Premium Titanium', representing the highest growth segment this quarter.</p>
              </div>
              <div className="flex gap-8">
                <div className="text-center group-hover:scale-110 transition-transform cursor-default">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">New Arrivals</p>
                  <p className="text-5xl font-black text-slate-900 leading-none">{products.filter(p => p.homepageFlags.isNew).length}</p>
                </div>
                <div className="w-[1px] h-16 bg-slate-200"></div>
                <div className="text-center group-hover:scale-110 transition-transform cursor-default">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Popular Styles</p>
                  <p className="text-5xl font-black text-slate-900 leading-none">{products.filter(p => p.homepageFlags.isPopular).length}</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  };

  const renderForm = () => (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-up pb-40">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => setViewMode('list')} className="p-3 glass-panel hover:bg-white transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{editingProduct ? 'Edit Style Record' : 'Registry: New Frame'}</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Product Catalog Sync</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-8">

          {/* Section 1: Frame Identity */}
          <div className="glass-panel p-10 space-y-10">
            <div className="flex items-center space-x-3 border-b border-white/20 pb-6">
              <img src="https://www.svgrepo.com/show/486242/eye-protection.svg" className="w-6 h-6 opacity-40" alt="Identity" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Frame Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col space-y-1.5 w-full">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Frame Code / SKU <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.sku || ''}
                  onChange={e => {
                    setFormData({ ...formData, sku: e.target.value });
                    if (errors.sku) setErrors({ ...errors, sku: '' });
                  }}
                  className={`input-glass p-3.5 text-sm font-medium ${errors.sku ? 'border-red-300' : 'border-slate-200'}`}
                  placeholder="SV-FRM-XXXX"
                  required
                />
                {errors.sku && <p className="text-[10px] text-red-500 font-medium">{errors.sku}</p>}
                {!errors.sku && <p className="text-[10px] text-slate-400 font-medium italic">Unique system identifier</p>}
              </div>
              <div className="flex flex-col space-y-1.5 w-full">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Style Model Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={e => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`input-glass p-3.5 text-sm font-medium ${errors.name ? 'border-red-300' : 'border-slate-200'}`}
                  placeholder="e.g. Leah Geometric"
                  required
                />
                {errors.name && <p className="text-[10px] text-red-500 font-medium">{errors.name}</p>}
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Brand / Designer</label>
                  <select
                    value={formData.brand || ''}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="input-glass p-3.5 text-sm font-bold appearance-none bg-white cursor-pointer"
                  >
                    {['SamVision Elite', 'Zeiss Vision', 'Luxury Imports'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Collection Segment</label>
                  <select
                    value={formData.collection || ''}
                    onChange={e => setFormData({ ...formData, collection: e.target.value as any })}
                    className="input-glass p-3.5 text-sm font-bold appearance-none bg-white cursor-pointer"
                  >
                    {COLLECTION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Promotions */}
          <div className={`glass-panel p-10 space-y-10 transition-all ${formData.originalPrice ? 'border-orange-200/50 bg-orange-50/10' : ''}`}>
            <div className="flex items-center justify-between border-b border-white/20 pb-6">
              <div className="flex items-center space-x-3">
                <img src="https://www.svgrepo.com/show/491322/computer.svg" className="w-6 h-6 opacity-40" alt="Pricing" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Pricing & Sales</h3>
              </div>
              <button
                onClick={() => {
                  const isEnabling = !formData.originalPrice;
                  setFormData({
                    ...formData,
                    originalPrice: isEnabling ? formData.price : undefined,
                    discountType: isEnabling ? 'Percentage' : undefined,
                    discountValue: isEnabling ? 0 : 0,
                    homepageFlags: {
                      ...(formData.homepageFlags || { isNew: true, isPopular: false, isDiscountPromo: false }),
                      isDiscountPromo: isEnabling
                    }
                  });
                }}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.originalPrice ? 'bg-accent text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
              >
                {formData.originalPrice ? 'Promotion Active' : 'Enable Sale'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex flex-col space-y-1.5 w-full">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Retail Price (ETB) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={e => {
                      const value = Number(e.target.value);
                      setFormData({ ...formData, price: value >= 0 ? value : 0 });
                      if (errors.price) setErrors({ ...errors, price: '' });
                    }}
                    className={`input-glass p-3.5 text-sm font-medium ${errors.price ? 'border-red-300' : 'border-slate-200'}`}
                    placeholder="4500"
                    required
                  />
                  {errors.price && <p className="text-[10px] text-red-500 font-medium">{errors.price}</p>}
                </div>
              </div>

              {formData.originalPrice !== undefined && (
                <div className="p-8 glass-panel border-accent/20 space-y-6 animate-fade-up">
                  <p className="text-[10px] font-black text-accent uppercase tracking-widest text-center">Discount Strategy</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Type</label>
                      <select
                        value={formData.discountType || ''}
                        onChange={e => setFormData({ ...formData, discountType: e.target.value as any })}
                        className="input-glass p-2.5 text-xs font-bold"
                      >
                        {['Percentage', 'Fixed Amount'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Value</label>
                      <input
                        type="number"
                        value={formData.discountValue || ''}
                        onChange={e => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                        className="input-glass p-2.5 text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Frame Attributes (Visual Selection) */}
          <div className="glass-panel p-10 space-y-10">
            <div className="flex items-center space-x-3 border-b border-white/20 pb-6">
              <img src="https://www.svgrepo.com/show/491959/glasses-round.svg" className="w-6 h-6 opacity-40" alt="Specs" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Frame Specifications</h3>
            </div>

            <div className="space-y-8">
              {/* Shape - Visual Selection */}
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-600 uppercase tracking-widest">Frame Contour / Shape</label>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  {SHAPE_OPTIONS.map(shape => (
                    <button
                      key={shape}
                      onClick={() => setFormData({ ...formData, shape: shape as any })}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${formData.shape === shape ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                      <img src={SVG_ASSETS.SHAPES[shape as keyof typeof SVG_ASSETS.SHAPES]} className={`w-8 h-8 md:w-10 md:h-10 mb-2 transition-opacity ${formData.shape === shape ? 'opacity-100' : 'opacity-30'}`} alt={shape} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">{shape}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Class / Type</label>
                  <select
                    value={formData.category || ''}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="input-glass p-3.5 text-sm font-bold"
                  >
                    {['frames', 'sunglasses'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Material Profile</label>
                  <select
                    value={formData.material || ''}
                    onChange={e => setFormData({ ...formData, material: e.target.value as any })}
                    className="input-glass p-3.5 text-sm font-bold"
                  >
                    {MATERIAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Rim Architecture</label>
                  <select
                    value={formData.rimType || ''}
                    onChange={e => setFormData({ ...formData, rimType: e.target.value as any })}
                    className="input-glass p-3.5 text-sm font-bold"
                  >
                    {RIM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Gender Target</label>
                  <select
                    value={formData.gender || ''}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="input-glass p-3.5 text-sm font-bold"
                  >
                    {['Men', 'Women', 'Unisex', 'Kids'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Colorway Management */}
          <div className="glass-panel p-10 space-y-10">
            <div className="flex items-center space-x-3 border-b border-white/20 pb-6">
              <img src="https://www.svgrepo.com/show/491957/glasses-fashion.svg" className="w-6 h-6 opacity-40" alt="Colors" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Available Colorways</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {COLOR_OPTIONS.map(color => {
                const isActive = (formData.colors || []).includes(color.hex);
                return (
                  <button
                    key={color.hex}
                    onClick={() => {
                      const current = formData.colors || [];
                      const next = isActive ? current.filter(c => c !== color.hex) : [...current, color.hex];
                      setFormData({ ...formData, colors: next });
                    }}
                    className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all ${isActive ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className="w-8 h-8 rounded-lg shadow-inner border border-slate-200 flex-shrink-0" style={{ backgroundColor: color.hex }} />
                    <div className="text-left">
                      <p className="text-[10px] font-black text-slate-800 leading-tight uppercase tracking-widest">{color.name}</p>
                      <p className="text-[8px] font-bold text-slate-400">{color.hex}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 7: Branch Availability & Stock */}
          <div className="glass-panel p-10 space-y-10">
            <div className="flex items-center space-x-3 border-b border-white/20 pb-6">
              <img src="https://www.svgrepo.com/show/486242/eye-protection.svg" className="w-6 h-6 opacity-40" alt="Branches" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Branch Availability</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BRANCHES.map(branch => {
                const stock = (formData.stockPerBranch || {})[branch.id] || { quantity: 0, lowStockThreshold: 5, status: 'Out of stock' };
                return (
                  <div key={branch.id} className="p-6 glass-panel border-slate-100 flex items-center space-x-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0 overflow-hidden">
                      <img src={`https://images.unsplash.com/photo-${branch.type === 'clinic' ? '1538108149393-fdfd816959d5' : '1511499767350-a1590fdb7358'}?q=80&w=100&h=100&auto=format&fit=crop`} className="w-full h-full object-cover" alt={branch.name} />
                    </div>
                    <div className="flex-grow space-y-4">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-slate-900 leading-none uppercase tracking-widest">{branch.name}</p>
                        <p className="text-[8px] text-slate-400 font-bold">{branch.address}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <input
                            type="number"
                            value={stock.quantity}
                            onChange={e => {
                              const qty = Number(e.target.value);
                              const newStock = { ...stock, quantity: qty, status: qty === 0 ? 'Out of stock' : qty <= stock.lowStockThreshold ? 'Limited' : 'In stock' } as BranchStock;
                              setFormData({ ...formData, stockPerBranch: { ...formData.stockPerBranch, [branch.id]: newStock } });
                            }}
                            className="w-full input-glass p-2 text-center text-xs font-black bg-white"
                            placeholder="Qty"
                          />
                          <label className="text-[8px] font-black text-slate-400 uppercase text-center block mt-1">Current Stock</label>
                        </div>
                        <div className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest ${stock.status === 'In stock' ? 'bg-teal-50 text-teal-600' : 'bg-red-50 text-red-600'}`}>
                          {stock.status}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">

          {/* Section 5: Image Management */}
          <div className="glass-panel p-8 space-y-8 sticky top-24">
            <div className="flex items-center space-x-3 border-b border-white/20 pb-4">
              <img src="https://www.svgrepo.com/show/491322/computer.svg" className="w-6 h-6 opacity-40" alt="Media" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Frame Images</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] block mb-4">Primary Catalog Shot <span className="text-red-500">*</span></label>
                {errors.image && <p className="text-[10px] text-red-500 font-medium mb-2">{errors.image}</p>}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div
                  className={`aspect-square rounded-2xl border-4 border-dashed transition-all flex items-center justify-center relative overflow-hidden group cursor-pointer ${formData.image ? 'border-primary bg-white' : errors.image ? 'border-red-300 bg-red-50/50 hover:border-red-400' : 'border-slate-100 bg-slate-50 hover:border-primary/50'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.image ? (
                    <>
                      <img src={formData.image} className="absolute inset-0 w-full h-full object-contain p-6 mix-blend-multiply" alt="Preview" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, image: undefined }); }} className="bg-red-500 text-white p-3 rounded-full shadow-xl">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6 space-y-2">
                      <svg className="w-8 h-8 text-slate-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select From Device</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Additional Perspectives</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    className="aspect-square border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:border-primary hover:text-primary transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Lens Compatibility */}
          <div className="glass-panel p-8 space-y-8">
            <div className="flex items-center space-x-3 border-b border-white/20 pb-4">
              <img src="https://www.svgrepo.com/show/491958/glasses-rectangular.svg" className="w-6 h-6 opacity-40" alt="Lenses" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Lens Compatibility</h3>
            </div>
            <div className="space-y-3">
              {LENS_TYPES.map(type => {
                const isComp = (formData.lensCompatibility || []).includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => {
                      const next = isComp ? (formData.lensCompatibility || []).filter(t => t !== type) : [...(formData.lensCompatibility || []), type];
                      setFormData({ ...formData, lensCompatibility: next });
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isComp ? 'border-primary bg-primary/5' : 'border-slate-50 hover:border-slate-100'}`}
                  >
                    <div className="flex items-center space-x-4">
                      <img src={SVG_ASSETS.LENSES[type as keyof typeof SVG_ASSETS.LENSES]} className={`w-6 h-6 transition-opacity ${isComp ? 'opacity-100' : 'opacity-20'}`} alt={type} />
                      <span className="text-xs font-bold text-slate-700">{type}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isComp ? 'bg-primary border-primary' : 'border-slate-200'}`}>
                      {isComp && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Zeiss_logo.svg/1200px-Zeiss_logo.svg.png" className="h-4 opacity-50 grayscale" alt="Zeiss" />
                <span className="text-[10px] font-black text-slate-500 uppercase">Medical Certified</span>
              </div>
              <div
                onClick={() => setFormData({ ...formData, isZeissCompatible: !formData.isZeissCompatible })}
                className={`w-10 h-6 rounded-full transition-colors cursor-pointer p-0.5 flex ${formData.isZeissCompatible ? 'bg-[#005596] justify-end' : 'bg-slate-200 justify-start'}`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
              </div>
            </div>
          </div>

          {/* Section 8: Visibility Settings */}
          <div className="glass-panel p-8 space-y-6">
            <div className="flex items-center space-x-3 border-b border-white/20 pb-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Visibility Settings</h3>
            </div>

            {[
              { label: 'New Arrival Highlight', key: 'isNew' },
              { label: 'Bestseller Tag', key: 'isPopular' },
              { label: 'Promotion Slider', key: 'isDiscountPromo' }
            ].map(setting => (
              <div key={setting.key} className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">{setting.label}</span>
                <button
                  onClick={() => {
                    const currentFlags = formData.homepageFlags || {};
                    setFormData({
                      ...formData,
                      homepageFlags: { ...currentFlags, [setting.key]: !(currentFlags as any)[setting.key] }
                    });
                  }}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${(formData.homepageFlags as any)?.[setting.key] ? 'bg-primary border-primary text-white' : 'border-slate-300 bg-white'}`}
                >
                  {(formData.homepageFlags as any)?.[setting.key] && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className="flex space-x-4 pt-10 border-t border-slate-200">
        <button onClick={() => handleSave('Active')} className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all">Push to Production</button>
        <button onClick={() => handleSave('Draft')} className="flex-1 glass text-slate-900 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] border border-slate-200 hover:bg-white transition-all">Save Local Draft</button>
      </div>

    </div>
  );

  if (loading && products.length === 0) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#F6F9FA] flex flex-col lg:flex-row relative pt-16 md:pt-20">
      <aside className="lg:w-72 bg-white border-r border-slate-100 flex-shrink-0 flex flex-col h-fit lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 overflow-y-auto z-40">
        <div className="px-10 py-10">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">SAMVISION<span className="text-primary">.</span></h1>
        </div>
        <nav className="flex-grow space-y-1.5 px-4">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveModule(item.id); setViewMode('list'); }}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl transition-all font-bold text-sm ${activeModule === item.id ? 'bg-primary text-white shadow-xl shadow-teal-500/20' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {item.icon}
              <span className="tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-8">
          <button onClick={() => onNavigate('home')} className="w-full py-4 glass border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl">Exit Admin</button>
        </div>
      </aside>

      <main className="flex-grow p-10 overflow-x-hidden">
        {error && !loading && products.length === 0 && hasAttemptedFetch && (
          <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-4 animate-fade-up">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <p className="text-xs font-black text-red-500 uppercase tracking-widest leading-none">Database Connection Error</p>
              <p className="text-sm font-bold text-red-900 mt-1">{error}</p>
              <button onClick={() => fetchProducts()} className="mt-3 text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline">Try Reconnecting</button>
            </div>
          </div>
        )}
        {viewMode === 'form' ? renderForm() : (
          <div className="max-w-7xl mx-auto space-y-12">
            {activeModule === 'frames' ? renderFrames() : activeModule === 'inventory' ? renderInventory() : activeModule === 'overview' ? renderOverview() : (
              <div className="h-[50vh] flex items-center justify-center text-slate-300 font-black uppercase tracking-[0.5em] text-[10px]">Module Development in Progress</div>
            )}
          </div>
        )}
      </main>

      {loading && <div className="fixed bottom-10 right-10 bg-white shadow-2xl border border-slate-100 p-4 rounded-2xl flex items-center space-x-4 z-50 animate-fade-up"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Cloud...</span></div>}
    </div>
  );
};

export default Admin;
