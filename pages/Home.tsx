import React, { useEffect, useRef, useState } from 'react';
import { ViewType, Product, Branch } from '../types';
import GlassCard from '../components/GlassCard';
import { BRANCHES, CLINICIANS, PARTNERS, TESTIMONIALS } from '../data';
import { supabase } from '../lib/supabase';

interface HomeProps {
  onNavigate: (view: ViewType) => void;
  onBranchChange: (branch: Branch) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onBranchChange }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const fetchPromoProducts = async () => {
    try {
      // Fetch active frames - filter for promotions on client side
      const { data, error } = await supabase
        .from('frames')
        .select(`*`)
        .eq('status', 'Active')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Filter for promotional items (has discount or isDiscountPromo flag)
      const mapped: Product[] = (data || [])
        .filter((f: any) => {
          if (!f || !f.image) return false;
          // Show items with discounts or promotional flags
          return f.discount_type || (f.flags && f.flags.isDiscountPromo) || false;
        })
        .slice(0, 10) // Limit to 10 items
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
          lensCompatibility: [],
          colors: f.colors || [],
          status: (f.status || 'Active') as any,
          homepageFlags: f.flags || { isNew: false, isPopular: false, isDiscountPromo: false },
          stockPerBranch: {}
        }));

      setProducts(mapped);
    } catch (err: any) {
      console.error('Home Promo Fetch Error:', err.message);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchPromoProducts();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Subscribe to real-time updates
    const channel = supabase
      .channel('home_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'frames' }, () => {
        fetchPromoProducts();
      })
      .subscribe();

    return () => {
      observer.disconnect();
      supabase.removeChannel(channel);
    };
  }, []);

  const treatableConditions = [
    { name: 'Cataract', desc: 'Understanding surgical clouding removal and lens options.', img: 'https://images.unsplash.com/photo-1581595224492-386157845147?q=80&w=400&auto=format&fit=crop' },
    { name: 'Glaucoma', desc: 'Managing intraocular pressure and optic nerve health.', img: 'https://images.unsplash.com/photo-1579154235602-3c35bd6355d8?q=80&w=400&auto=format&fit=crop' },
    { name: 'Retina Conditions', desc: 'Advanced diagnostics for diabetic and age-related health.', img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=400&auto=format&fit=crop' },
    { name: 'Chalazion', desc: 'Expert medical management and minor surgical relief.', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop' },
    { name: 'Red Eye', desc: 'Clinical diagnosis for inflammatory and allergic states.', img: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=400&auto=format&fit=crop' },
    { name: 'Refractive Error', desc: 'Precise measurement for clarity at every distance.', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400&auto=format&fit=crop' }
  ];

  const clinicalServices = [
    { name: 'Cataract Surgery', img: '/images/home/surgery.jpeg' },
    { name: 'Glaucoma Treatment', img: '/images/home/Glacoma.jpeg' },
    { name: 'Retina Services', img: '/images/home/retina.jpeg' },
    { name: 'Pediatric Care', img: '/images/home/pediatric.jpg' },
    { name: 'Diabetic Checkups', img: '/images/home/diabetic.jpg' },
    { name: 'Lens Implantation', img: '/images/home/lens.jpg' },
    { name: 'Optical Boutique', img: '/images/home/optical.jpg' },
    { name: 'Digital Eye Testing', img: '/images/home/testing.jpg' }
  ];

  const saleProducts = products;

  return (
    <div className="bg-white overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] md:h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/home/hero-main.jpeg"
            className="w-full h-full object-cover brightness-[0.6]"
            alt="Clinic Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 py-20 lg:py-0">
          <div className="lg:w-3/5 space-y-6 md:space-y-10 animate-fade-up text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-[1.05] md:leading-[0.9] tracking-tighter text-white">
              Leading Eye <br />
              <span className="text-teal-400">Care Center.</span>
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-xl leading-relaxed font-medium mx-auto lg:mx-0">
              Trusted specialized ophthalmology, German-engineered ZEISS optics, and surgical precision for over 15 years in Addis Ababa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-5 pt-4 justify-center lg:justify-start">
              <button
                onClick={() => onNavigate('booking')}
                className="bg-primary text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.3em] shadow-2xl shadow-teal-500/40 transition-all hover:scale-105"
              >
                Book Appointment
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className="glass border-white/20 text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all hover:bg-white/10"
              >
                Shop Catalogue
              </button>
            </div>
          </div>

          <div className="hidden lg:block lg:w-1/3 animate-fade-up delay-200">
            <div className="p-12 space-y-14 glass border-white/20 text-white rounded-[3rem]">
              <div className="space-y-2">
                <p className="text-6xl font-black text-teal-400 tracking-tighter leading-none">50K+</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Restored Visions</p>
              </div>
              <div className="space-y-2">
                <p className="text-6xl font-black text-white tracking-tighter leading-none">1M+</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Digital Reach</p>
              </div>
              <div className="space-y-2">
                <p className="text-6xl font-black text-white/40 tracking-tighter leading-none">15+</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Years Legacy</p>
              </div>
              <div className="pt-10 border-t border-white/10 flex items-center space-x-4">
                <div className="bg-white text-slate-900 px-3 py-1 rounded-lg font-black italic text-[9px] uppercase tracking-tighter">ZEISS</div>
                <span className="text-[9px] font-black uppercase tracking-widest text-white/50 leading-tight">Exclusive Agency <br />Partner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CLINICAL SERVICES GRID */}
      <section className="section-padding bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12 md:mb-20 space-y-3 md:space-y-4">
            <h2 className="text-primary font-black tracking-[0.5em] text-[9px] md:text-[10px] uppercase">Specialized Care</h2>
            <p className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">Our Eye Care Services.</p>
            <p className="text-slate-500 max-w-2xl mx-auto pt-2 md:pt-4 font-medium text-sm md:text-base">Delivering global standards of ophthalmic care through surgical precision and advanced diagnostics.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {clinicalServices.map((service, idx) => (
              <div
                key={idx}
                className="group relative h-[320px] md:h-[380px] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden cursor-pointer transition-all duration-700 hover:-translate-y-2 reveal"
                style={{ animationDelay: `${idx * 0.15}s` }}
                onClick={() => onNavigate('services')}
              >
                {/* Background Image with Deep Parallax Look */}
                <img
                  src={service.img}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  alt={service.name}
                />

                {/* Sophisticated Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-700" />

                {/* Floating Glass Content Plate */}
                <div className="absolute inset-x-3 bottom-3 md:inset-x-4 md:bottom-4 p-5 md:p-6 glass-clean border-white/20 rounded-[1.8rem] md:rounded-[2.2rem] transition-all duration-700 transform translate-y-2 group-hover:translate-y-0 group-hover:bg-white/20 group-hover:border-white/40">
                  <div className="flex justify-between items-center mb-3 md:mb-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/20 backdrop-blur-md flex items-center justify-center text-primary border border-primary/30 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500">
                      <span className="text-[9px] md:text-xs font-black">{String(idx + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-x-4 group-hover:translate-x-0">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-white font-black text-xl md:text-2xl leading-tight tracking-tight mb-2 group-hover:text-teal-400 transition-colors duration-500">
                    {service.name}
                  </h3>

                  <div className="h-0 group-hover:h-6 overflow-hidden transition-all duration-700 opacity-0 group-hover:opacity-100">
                    <p className="text-white/60 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Explore Specialization</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PARTNERS (fluid scrolling) */}
      <div className="py-16 md:py-24 bg-white border-y border-slate-100/50 overflow-hidden reveal">
        <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
          <p className="text-sm font-bold text-slate-400">Trusted by Ethiopia's Leading Organizations</p>
        </div>

        <div className="animate-infinite-scroll flex items-center space-x-16 md:space-x-32">
          {[
            { name: 'Bank of Abyssinia', img: '/images/logos/BOA.png' },
            { name: 'CBE', img: '/images/logos/CBE.png' },
            { name: 'Dashen Bank', img: '/images/logos/Dashen.png' },
            { name: 'Ethiopian Airlines', img: '/images/logos/Ethiopian airlines .png' },
            { name: 'Buna Bank', img: '/images/logos/buna.png' },
            { name: 'Ethio Telecom', img: '/images/logos/ethiotele.png' },
            { name: 'Safaricom', img: '/images/logos/safaricom.png' },
            // Repeat for infinite effect
            { name: 'Bank of Abyssinia', img: '/images/logos/BOA.png' },
            { name: 'CBE', img: '/images/logos/CBE.png' },
            { name: 'Dashen Bank', img: '/images/logos/Dashen.png' },
            { name: 'Ethiopian Airlines', img: '/images/logos/Ethiopian airlines .png' },
            { name: 'Buna Bank', img: '/images/logos/buna.png' },
            { name: 'Ethio Telecom', img: '/images/logos/ethiotele.png' },
            { name: 'Safaricom', img: '/images/logos/safaricom.png' },
          ].map((partner, idx) => (
            <div key={idx} className="flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer group">
              <div className="h-14 md:h-16 w-32 md:w-48 flex items-center justify-center p-2">
                <img
                  src={partner.img}
                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                  alt={partner.name}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. TREATABLE CONDITIONS SECTION */}
      <section className="section-padding bg-slate-50 reveal overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-20">
            <div className="lg:w-1/2 space-y-8 md:space-y-12">
              <div className="space-y-4 md:space-y-6">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                  Conditions <br className="hidden md:block" /><span className="text-primary">We Expertly Treat.</span>
                </h2>
                <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed">Our clinical specialists provide precise diagnosis and customized treatment pathways for complex ocular conditions.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {treatableConditions.slice(0, 4).map((condition, idx) => (
                  <div
                    key={idx}
                    className="group glass rounded-2xl md:rounded-[2.5rem] p-3 md:p-4 border-white/50 transition-all hover:bg-white hover:shadow-xl cursor-pointer"
                    onClick={() => onNavigate('treatments')}
                  >
                    <div className="aspect-video rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-4 border border-slate-100">
                      <img src={condition.img} className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0" alt={condition.name} />
                    </div>
                    <p className="font-black text-slate-900 text-[10px] md:text-[11px] uppercase tracking-widest mb-1 md:mb-2 border-b border-primary/10 pb-1.5 md:pb-2">{condition.name}</p>
                    <p className="text-[9px] md:text-[10px] text-slate-500 font-medium leading-relaxed">{condition.desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigate('treatments')}
                className="w-full sm:w-auto bg-primary text-white px-8 md:px-10 py-4 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all"
              >
                Explore All Conditions
              </button>
            </div>
            <div className="lg:w-1/2 relative group w-full">
              <div className="rounded-3xl md:rounded-[3.5rem] overflow-hidden shadow-2xl md:shadow-3xl bg-white p-3 md:p-4 transition-transform duration-700">
                <img src="/images/home/hero-main.jpeg" className="w-full h-auto rounded-2xl md:rounded-[2.5rem]" alt="Clinical Care" />
              </div>
              <div className="hidden sm:block absolute -bottom-6 md:-bottom-10 -right-6 md:-right-10 glass p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] shadow-2xl max-w-xs space-y-2 md:space-y-4">
                <p className="text-primary font-black uppercase tracking-widest text-[9px] md:text-[10px]">Quality Standard</p>
                <p className="text-slate-800 font-bold leading-tight italic text-base md:text-lg">"Restoring clear sight through surgical and diagnostic excellence."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SPECIALISTS HIGHLIGHT SECTION */}
      <section className="section-padding bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-20">
            <div className="space-y-3 md:space-y-4">
              <h2 className="text-primary font-black tracking-[0.5em] text-[9px] md:text-[10px] uppercase">Our Medical Faculty</h2>
              <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Meet the Specialists.</p>
            </div>
            <button
              onClick={() => onNavigate('teams')}
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors text-left"
            >
              Meet the Full Team &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {CLINICIANS.slice(0, 4).map((doc, idx) => (
              <div key={doc.id} className="reveal" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div
                  className="group bg-slate-50 rounded-3xl md:rounded-[3rem] p-6 md:p-8 text-center border border-slate-100 transition-all duration-500 hover:bg-white hover:shadow-2xl cursor-pointer"
                  onClick={() => onNavigate('teams')}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mx-auto mb-4 md:mb-6 border-4 border-white shadow-lg group-hover:border-primary/10 transition-colors">
                    <img src={doc.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={doc.name} />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1 text-sm md:text-base">{doc.name}</h4>
                  <p className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest mb-3 md:mb-4">{doc.role}</p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {doc.specialties.slice(0, 2).map(s => (
                      <span key={s} className="text-[8px] font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ON SALE FRAMES CAROUSEL */}
      <section className="section-padding bg-slate-50 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-end justify-between mb-10 md:mb-16">
            <div className="space-y-3 md:space-y-4">
              <h2 className="text-accent font-black tracking-[0.5em] text-[9px] md:text-[10px] uppercase">Exclusive Offers</h2>
              <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">On Sale Frames.</p>
            </div>
            <button onClick={() => onNavigate('shop')} className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">Shop All &rarr;</button>
          </div>

          <div
            className="flex overflow-x-auto no-scrollbar gap-6 md:gap-10 pb-12 md:pb-20 snap-x snap-mandatory px-4 sm:px-0"
            ref={scrollRef}
          >
            {saleProducts.length > 0 ? saleProducts.map((p, idx) => (
              <div
                key={p.id || idx}
                className="snap-start flex-shrink-0 w-[220px] md:w-[260px] group cursor-pointer flex flex-col space-y-4"
                onClick={() => onNavigate('shop')}
              >
                <div className="relative aspect-square bg-[#fdfdfd] rounded-2xl md:rounded-[2.5rem] border border-slate-100 overflow-hidden flex flex-col items-center justify-center p-6 md:p-8 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-teal-500/5 group-hover:border-primary/20">
                  <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col gap-1.5 z-10">
                    <span className="text-[7px] md:text-[8px] font-black px-2.5 md:px-3 py-1 bg-accent text-white rounded-full uppercase tracking-widest shadow-lg">Sale</span>
                  </div>

                  {p.image ? (
                    <img
                      src={p.image}
                      className="w-full h-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                      alt={p.name || 'Frame'}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-4">
                    <button className="bg-slate-900 text-white text-[9px] font-black px-5 py-3 rounded-full shadow-2xl uppercase tracking-widest transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      View Details
                    </button>
                  </div>
                </div>

                <div className="px-1 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5 max-w-[80%]">
                      <p className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-80">{p.brand || 'SamVision Elite'}</p>
                      <h3 className="text-sm md:text-base font-bold text-slate-900 tracking-tight truncate">{p.name}</h3>
                    </div>
                  </div>

                  <div className="flex items-baseline space-x-3">
                    <span className="text-base md:text-lg font-black tracking-tighter text-accent">{p.price.toLocaleString()} <span className="text-[10px] uppercase font-bold tracking-widest">ETB</span></span>
                    {p.originalPrice && (
                      <span className="text-[11px] text-slate-300 line-through font-bold">{p.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="snap-start flex-shrink-0 w-full text-center py-20 bg-white/50 rounded-[3rem] border border-dashed border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic tracking-widest">Awaiting Promotional Stock</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. OUR BRANCHES (ENHANCED LOCATIONS) */}
      <section className="section-padding bg-slate-50 reveal relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-20">
            <div className="space-y-3 md:space-y-4">
              <h2 className="text-primary font-black tracking-[0.5em] text-[10px] uppercase">Network of Care</h2>
              <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">Our Branches</p>
            </div>
            <button
              onClick={() => onNavigate('branch')}
              className="px-6 py-3 glass border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-primary hover:border-primary transition-all rounded-full text-left md:text-center shadow-soft"
            >
              All Branches &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {BRANCHES.map((b, idx) => {
              // Map images based on branch name keywords
              let branchImg = "";
              if (b.name.toLowerCase().includes('bisrate')) branchImg = "/images/banners/bisrate.jpeg";
              else if (b.name.toLowerCase().includes('meskel')) branchImg = "/images/banners/meskel .jpg";
              else if (b.name.toLowerCase().includes('bole')) branchImg = "/images/banners/bole.jpeg";
              else if (b.name.toLowerCase().includes('olympia')) branchImg = "/images/banners/olompia .jpeg";

              return (
                <div key={b.id} className="reveal" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <GlassCard
                    className="group flex flex-col h-full !p-0 overflow-hidden border border-slate-100/50 hover:border-primary/40 transition-all duration-700 bg-white/40 backdrop-blur-xl shadow-2xl relative"
                    hoverable
                  >
                    {/* Visual Header / Image Case */}
                    <div className="h-40 md:h-48 overflow-hidden relative cursor-pointer" onClick={() => { onBranchChange(b); onNavigate('branch'); }}>
                      <img
                        src={branchImg || `https://images.unsplash.com/photo-${b.type === 'clinic' ? '1538108149393-fdfd816959d5' : '1511499767350-a1590fdb7358'}?q=80&w=600&auto=format&fit=crop`}
                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                        alt={b.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      {/* Badge */}
                      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border ${b.type === 'clinic'
                          ? 'bg-primary/20 text-primary border-primary/30'
                          : 'bg-amber-500/20 text-amber-600 border-amber-500/30'
                          }`}>
                          {b.type}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                      <div className="space-y-2 mb-6 cursor-pointer" onClick={() => { onBranchChange(b); onNavigate('branch'); }}>
                        <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-primary transition-colors duration-500">
                          {b.name}
                        </h3>
                        <div className="flex items-start space-x-1.5">
                          <svg className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <p className="text-[10px] md:text-[11px] text-slate-500 font-medium leading-relaxed italic">
                            {b.address.split(',')[0]}
                          </p>
                        </div>
                      </div>

                      {/* Contact & Action */}
                      <div className="mt-auto space-y-4">
                        <div className="flex flex-col space-y-2">
                          <a
                            href={`tel:${b.phone}`}
                            className="flex items-center space-x-3 text-slate-400 hover:text-primary transition-all group/phone w-max"
                          >
                            <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover/phone:bg-primary/10 group-hover/phone:border-primary/20 transition-colors">
                              <svg className="w-3 h-3 group-hover/phone:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                            <span className="text-[9px] md:text-[10px] font-black tracking-[0.2em]">{b.phone}</span>
                          </a>

                          {b.phone2 && (
                            <a
                              href={`tel:${b.phone2}`}
                              className="flex items-center space-x-3 text-slate-400 hover:text-primary transition-all group/phone w-max"
                            >
                              <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover/phone:bg-primary/10 group-hover/phone:border-primary/20 transition-colors">
                                <svg className="w-3 h-3 group-hover/phone:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                              </div>
                              <span className="text-[9px] md:text-[10px] font-black tracking-[0.2em]">{b.phone2}</span>
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => { onBranchChange(b); onNavigate('branch'); }}
                          className="w-full pt-4 border-t border-slate-900/10 flex items-center justify-between group/btn text-slate-400 group-hover:text-primary transition-all duration-500"
                        >
                          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Explore</span>
                          <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500">
                            <svg className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </div>
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. OPTICAL & ZEISS HIGHLIGHT */}
      <section className="section-padding bg-white reveal px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="p-8 md:p-12 lg:p-24 bg-[#005596] text-white rounded-[2rem] md:rounded-[3.5rem] flex flex-col lg:flex-row items-center gap-10 md:gap-16 overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/4 hidden lg:block" />
            <div className="lg:w-1/2 space-y-6 md:space-y-8 relative z-10 text-center lg:text-left">
              <div className="bg-white text-[#005596] px-4 py-1.5 rounded-xl font-black italic text-[10px] md:text-[11px] inline-block uppercase tracking-widest">ZEISS Vision Center</div>
              <h2 className="text-3xl md:text-6xl font-black tracking-tighter leading-[1.1]">The Precision of German Optics.</h2>
              <p className="text-blue-100 font-medium leading-relaxed text-base md:text-lg max-w-md mx-auto lg:mx-0">Access Ethiopia's exclusive inventory of SmartLife lenses and DuraVision technology.</p>
              <button onClick={() => onNavigate('shop')} className="bg-white text-[#005596] px-8 md:px-10 py-3.5 md:py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-50 transition-all">Explore Collection</button>
            </div>
            <div className="lg:w-1/2 relative z-10 w-full">
              <div className="relative rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-700">
                <img src="https://images.unsplash.com/photo-1511499767350-a1590fdb7358?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="ZEISS Technology" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS SECTION */}
      <section className="section-padding bg-slate-50 reveal overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12 md:mb-20 space-y-3 md:space-y-4">
            <h2 className="text-primary font-black tracking-[0.5em] text-[10px] uppercase">Patient Experiences</h2>
            <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">What Our Patients Say.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div key={t.id} className="reveal h-full" style={{ animationDelay: `${idx * 0.1}s` }}>
                <GlassCard className="p-8 md:p-10 border-white h-full space-y-6 flex flex-col justify-between hover:bg-white/90">
                  <div className="space-y-4">
                    <div className="flex text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                      ))}
                    </div>
                    <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed italic">"{t.quote}"</p>
                  </div>
                  <div className="flex items-center space-x-4 pt-4 border-t border-slate-100">
                    <img src={t.image} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white shadow-md" alt={t.name} />
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900 text-xs md:text-sm leading-none">{t.name}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA STRIP */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 reveal">
        <div className="max-w-5xl mx-auto">
          <div className="glass p-8 md:p-14 text-center space-y-6 md:space-y-8 rounded-[2rem] md:rounded-[3rem] relative border border-white/40 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
            <div className="space-y-3 md:space-y-4">
              <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">Your vision is our legacy.</h2>
              <p className="text-slate-500 text-sm md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
                Join 50,000+ patients who experience global standards of ocular health every day.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('booking')}
                className="w-full sm:w-auto bg-primary text-white px-8 md:px-12 py-3.5 md:py-4 rounded-full font-black text-[10px] uppercase tracking-[0.4em] shadow-xl shadow-teal-500/20 transition-all hover:scale-105"
              >
                Book Visit
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className="w-full sm:w-auto glass border-slate-200 text-slate-900 px-8 md:px-12 py-3.5 md:py-4 rounded-full font-black text-[10px] uppercase tracking-[0.4em] transition-all hover:bg-slate-50"
              >
                Shop Frames
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

