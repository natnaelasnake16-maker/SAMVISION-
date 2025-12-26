import React, { useEffect } from 'react';
import { Branch, ViewType } from '../types';
import GlassCard from '../components/GlassCard';

interface BranchPageProps {
  branch: Branch;
  onNavigate: (view: ViewType) => void;
}

const BranchPage: React.FC<BranchPageProps> = ({ branch, onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [branch]);

  // Identify branch image based on name
  let branchImg = "";
  if (branch.name.toLowerCase().includes('bisrate')) branchImg = "/images/banners/bisrate.jpeg";
  else if (branch.name.toLowerCase().includes('meskel')) branchImg = "/images/banners/meskel .jpg";
  else if (branch.name.toLowerCase().includes('bole')) branchImg = "/images/banners/bole.jpeg";
  else if (branch.name.toLowerCase().includes('olympia')) branchImg = "/images/banners/olompia .jpeg";

  const services = branch.type === 'clinic'
    ? [
      { title: 'Diagnostic Screening', desc: 'Advanced computerized eye testing using standard protocols.', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
      { title: 'Cataract / Phaco', desc: 'Specialized surgical procedures for vision restoration.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      { title: 'Pediatric Care', desc: 'Specialized eye care services for children and adolescents.', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
      { title: 'Glaucoma Management', desc: 'Long-term monitoring and pressure control expertise.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2' }
    ]
    : [
      { title: 'Prescription Fitting', desc: 'Expert adjustment and fitting of ZEISS and other lenses.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
      { title: 'Designer Frames', desc: 'A curated collection of international and elite brands.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
      { title: 'ZEISS Vision Center', desc: 'Authorized diagnostic and lens integration center.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
    ];

  return (
    <div className="bg-[#fbfcfd] min-h-screen">
      <div className="h-16 md:h-20" /> {/* Navbar Spacer */}

      {/* 1. IMMERSIVE HERO */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={branchImg || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1600&auto=format&fit=crop'}
            className="w-full h-full object-cover brightness-[0.7] transform scale-105 active:scale-110 transition-transform duration-[2s]"
            alt={branch.name}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8">
          <div className="max-w-3xl space-y-6 animate-fade-up">
            <div className="inline-flex items-center space-x-2 bg-primary/20 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>{branch.type === 'clinic' ? 'Full Diagnostic Clinic' : 'Premium Optical Center'}</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tighter">
              {branch.name}
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
              Serving the {branch.name.split(' ')[0]} community with over 15 years of surgical and optical excellence.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CORE INFO PANEL (FLOAT) */}
      <section className="relative z-20 -mt-16 md:-mt-24 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Location & Contact */}
          <GlassCard className="lg:col-span-2 p-8 md:p-12 border-primary/10 bg-white/80 backdrop-blur-3xl shadow-soft reveal">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16">
              <div className="space-y-8">
                <div className="space-y-3">
                  <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Physical Address</p>
                  <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-tight">{branch.address}</h2>
                  <p className="text-slate-500 font-medium text-sm">Addis Ababa, Ethiopia</p>
                </div>

                <div className="space-y-4">
                  <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Direct Lines</p>
                  <div className="flex flex-col space-y-3">
                    <a href={`tel:${branch.phone}`} className="flex items-center space-x-4 group">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <span className="font-black text-slate-700 tracking-widest text-sm">{branch.phone}</span>
                    </a>
                    {branch.phone2 && (
                      <a href={`tel:${branch.phone2}`} className="flex items-center space-x-4 group">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </div>
                        <span className="font-black text-slate-700 tracking-widest text-sm">{branch.phone2}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Operating Hours</p>
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <p className="text-slate-900 font-black text-sm">{branch.hours.split(':')[0]}</p>
                      <p className="text-primary font-bold text-lg leading-none mt-1">{branch.hours.split(':').slice(1).join(':')}</p>
                      <p className="text-slate-400 font-medium text-[10px] mt-2 italic">*Emergency services available 24/7</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Schedule an Appointment
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Quick Stats / Highlights */}
          <GlassCard className="p-8 md:p-12 border-slate-100 bg-slate-900 text-white reveal" style={{ animationDelay: '0.1s' }}>
            <div className="h-full flex flex-col justify-between space-y-12">
              <div className="space-y-2">
                <p className="text-teal-400 font-black uppercase tracking-[0.3em] text-[10px]">Branch Highlights</p>
                <h3 className="text-2xl font-black tracking-tight">Experience Global Standards Locally.</h3>
              </div>

              <div className="space-y-8">
                {[
                  { label: 'Patient Reach', val: '12K+', color: 'text-teal-400' },
                  { label: 'Specialists', val: branch.type === 'clinic' ? '4 SENIOR' : '2 EXPERT', color: 'text-white' },
                  { label: 'Satisfaction', val: '99.4%', color: 'text-white' }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/10 pb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
                    <p className={`text-xl font-black ${stat.color} tracking-tighter`}>{stat.val}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Patient" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-teal-500 flex items-center justify-center text-[10px] font-black">+1k</div>
                </div>
                <p className="text-[10px] text-white/50 font-medium mt-3">Trusted by thousands in your area.</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* 3. BRANCH SPECIFIC SERVICES */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-4 gap-8 items-center mb-16">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-primary font-black uppercase tracking-[0.5em] text-[10px]">Capabilities</h2>
            <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-none">Services at this Branch.</p>
          </div>
          <div className="lg:col-span-3">
            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">
              Equipped with ZEISS digital diagnostic suites and surgical theaters, this location offers specialized care for complex ocular health.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 reveal">
          {services.map((s, i) => (
            <GlassCard key={i} hoverable className="p-8 border-slate-100 bg-white group">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={s.icon} /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{s.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="pb-24 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 reveal">
          <div className="w-16 h-1 w-full flex justify-center mx-auto space-x-2">
            <div className="w-12 h-0.5 bg-primary/20" />
            <div className="w-4 h-0.5 bg-primary" />
            <div className="w-12 h-0.5 bg-primary/20" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter leading-tight">Elite visual care is <br className="hidden sm:block" />around the corner.</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => onNavigate('booking')} className="w-full sm:w-auto bg-primary text-white px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-[0.3em] shadow-xl">Book Appointment</button>
            <button onClick={() => onNavigate('contact')} className="w-full sm:w-auto glass border-slate-200 text-slate-900 px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-[0.3em]">Contact Center</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BranchPage;
