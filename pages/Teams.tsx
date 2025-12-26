
import React, { useEffect, useState } from 'react';
import { ViewType, Clinician, Branch } from '../types';
import { CLINICIANS, BRANCHES } from '../data';
import GlassCard from '../components/GlassCard';

interface TeamsProps {
  onNavigate: (view: ViewType) => void;
}

const Teams: React.FC<TeamsProps> = ({ onNavigate }) => {
  const [activeBranch, setActiveBranch] = useState<string>('all');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [activeBranch]);

  const filteredClinicians = activeBranch === 'all'
    ? CLINICIANS
    : CLINICIANS.filter(c => c.branchId === activeBranch);

  return (
    <div className="bg-[#fbfcfd] min-h-screen">
      <div className="h-16 md:h-20" /> {/* Navbar Spacer */}

      {/* Hero */}
      <section className="relative h-[40vh] md:h-[45vh] flex items-center overflow-hidden px-4 md:px-8">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/teams/hero.jpeg"
            className="w-full h-full object-cover brightness-[0.6]"
            alt="Medical Team"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="max-w-2xl space-y-4 md:space-y-6 animate-fade-up text-center md:text-left">
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
              Our <span className="text-teal-400">Specialists.</span>
            </h1>
            <p className="text-base md:text-lg text-white/80 font-medium leading-relaxed max-w-md mx-auto md:mx-0">Meet the world-class ophthalmologists, surgeons, and optometrists dedicated to your vision health.</p>
          </div>
        </div>
      </section>

      {/* Branch Tabs - Refined for mobile scroll */}
      <nav className="sticky top-16 z-30 glass border-y border-slate-100 py-3 md:py-4 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 md:px-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-3 md:space-x-4 min-w-max justify-start md:justify-center">
            <button
              onClick={() => setActiveBranch('all')}
              className={`px-6 md:px-8 py-2 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeBranch === 'all' ? 'bg-primary text-white shadow-lg shadow-glow' : 'text-slate-400 hover:text-primary'
                }`}
            >
              All Locations
            </button>
            {BRANCHES.map(branch => (
              <button
                key={branch.id}
                onClick={() => setActiveBranch(branch.id)}
                className={`px-6 md:px-8 py-2 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeBranch === branch.id ? 'bg-primary text-white shadow-lg shadow-glow' : 'text-slate-400 hover:text-primary'
                  }`}
              >
                {branch.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Team Grid - Responsive spacing */}
      <section className="py-12 md:py-24 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {filteredClinicians.map((doc, idx) => (
            <div
              key={doc.id}
              className="group reveal h-full"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <GlassCard className="p-6 md:p-8 border-white/40 h-full flex flex-col items-center text-center transition-all hover:bg-white/90 hover:shadow-2xl hover:border-primary/20 hover:-translate-y-2">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 md:mb-8 border-4 border-white shadow-xl group-hover:border-primary/10 transition-colors">
                  <img src={doc.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={doc.name} />
                </div>

                <div className="space-y-1.5 md:space-y-2 mb-4 md:mb-6">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">{doc.name}</h3>
                  <p className="text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.2em]">{doc.role}</p>
                  <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
                    {BRANCHES.find(b => b.id === doc.branchId)?.name || 'Multi-location'}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-6 md:mb-8">
                  {doc.specialties.map(spec => (
                    <span key={spec} className="text-[8px] md:text-[9px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 md:py-1.5 rounded-lg border border-slate-100">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="mt-auto w-full pt-4 md:pt-6 border-t border-slate-50">
                  <button
                    onClick={() => onNavigate('booking')}
                    className="w-full bg-slate-900 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-primary"
                  >
                    Book Specialist
                  </button>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        {filteredClinicians.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-2xl md:rounded-[2rem] flex items-center justify-center mx-auto text-slate-300">
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">No specialists found for this branch.</p>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-24 bg-white reveal">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center space-y-8 md:space-y-10">
          <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">Your Health is in <br className="hidden sm:block" />Expert Hands.</h2>
          <p className="text-slate-500 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">Our teams utilize shared diagnostic insights across branches to ensure the most consistent care path for every patient.</p>
          <button
            onClick={() => onNavigate('booking')}
            className="bg-primary text-white px-10 md:px-12 py-4 md:py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl shadow-teal-500/20 hover:scale-105 transition-all"
          >
            Schedule General Visit
          </button>
        </div>
      </section>
    </div>
  );
};

export default Teams;
