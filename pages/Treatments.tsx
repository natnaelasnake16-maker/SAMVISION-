
import React, { useEffect } from 'react';
import { ViewType } from '../types';
import GlassCard from '../components/GlassCard';

interface TreatmentsProps {
  onNavigate: (view: ViewType) => void;
}

const CONDITION_CARDS = [
  {
    name: 'Cataract',
    img: '/images/treatments/cataract.jpeg',
    desc: 'Understanding surgical clouding removal and intraocular lens (IOL) replacement options.'
  },
  {
    name: 'Glaucoma',
    img: '/images/treatments/glaucoma.jpeg',
    desc: 'Early detection, medical management, and long-term pressure monitoring for optic nerve health.'
  },
  {
    name: 'Retina Conditions',
    img: '/images/treatments/retina.jpeg',
    desc: 'Advanced care for diabetic retinopathy, macular degeneration, and retinal tears.'
  },
  {
    name: 'Chalazion',
    img: '/images/treatments/chalazion.jpeg',
    desc: 'Clinical evaluation of eyelid cysts and when surgical intervention is necessary for relief.'
  },
  {
    name: 'Red Eye',
    img: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=800&auto=format&fit=crop',
    desc: 'Identifying the underlying causes: from acute infections to environmental allergies.'
  },
  {
    name: 'Other Eye Problems',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop',
    desc: 'Capture and manage less common ocular disorders with SamVision specialized expertise.'
  }
];

const Treatments: React.FC<TreatmentsProps> = ({ onNavigate }) => {
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
  }, []);

  return (
    <div className="bg-[#fbfcfd] min-h-screen">
      <div className="h-16 lg:h-20" /> {/* Navbar Spacer */}

      {/* 1. HERO */}
      <section className="relative h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/treatments/hero.jpeg"
            className="w-full h-full object-cover brightness-[0.7]"
            alt="Eye Treatment"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <div className="max-w-3xl space-y-6 animate-fade-up">
            <h1 className="text-4xl md:text-7xl font-black text-white leading-none tracking-tighter">
              Conditions <span className="text-teal-400">Treated.</span>
            </h1>
            <p className="text-lg text-white/80 font-medium leading-relaxed">
              Maintain clear, healthy vision through every stage of life. Our ophthalmologists manage everything from common concerns to complex surgical needs.
            </p>
          </div>
        </div>
      </section>

      {/* 2. GRID */}
      <section className="py-32 max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {CONDITION_CARDS.map((condition, idx) => (
            <div
              key={idx}
              className="group flex flex-col space-y-6 reveal cursor-pointer"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="relative h-72 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-soft transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-2">
                <img src={condition.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={condition.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
              </div>
              <div className="px-4 space-y-3">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{condition.name}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{condition.desc}</p>
                <button className="text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:underline flex items-center">
                  Read More
                  <svg className="w-3 h-3 ml-2 translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CTA */}
      <section className="py-24 bg-slate-50 reveal text-center">
        <div className="max-w-4xl mx-auto px-8 space-y-10">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">Ready to Seek Professional <br />Evaluation?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => onNavigate('booking')}
              className="bg-primary text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-3xl shadow-teal-500/20 hover:scale-105 transition-all"
            >
              Book a Consultation
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="glass border-slate-200 text-slate-900 px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all"
            >
              Contact the Clinic
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Treatments;
