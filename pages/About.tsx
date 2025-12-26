
import React from 'react';
import { ViewType } from '../types';
import { CLINICIANS } from '../data';
import GlassCard from '../components/GlassCard';

interface AboutProps {
  onNavigate: (view: ViewType) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
  const clinicalServices = [
    'Cataract Surgery (Phacoemulsification)',
    'Glaucoma Diagnosis & Treatment',
    'Retina Services',
    'Pediatric Eye Care',
    'Diabetic Eye Checkups',
    'Lens Implantation',
    'Optical Dispensary',
    'Computerised Eye Testing'
  ];

  const treatableConditions = [
    'Cataract',
    'Glaucoma',
    'Retina Disorders',
    'Chalazion',
    'Red Eye Conditions',
    'Other Eye Problems'
  ];

  const ophthalmologists = CLINICIANS.filter(c => c.role.includes('Ophthalmologist') || c.role.includes('Surgeon') || c.role.includes('Specialist') && !c.role.includes('Optometrist'));
  const optometrists = CLINICIANS.filter(c => c.role === 'Optometrist');

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/about/hero.jpg"
            className="w-full h-full object-cover opacity-30"
            alt="About SamVision"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <div className="max-w-3xl space-y-8 animate-fade-up">
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
              A Legacy of <br /><span className="text-teal-400">Clear Vision.</span>
            </h1>
            <p className="text-xl text-white/60 leading-relaxed font-medium">
              SamVision has been at the forefront of ophthalmic care in Ethiopia for over 15 years, combining humanitarian compassion with surgical precision.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy & Humanitarian Mission */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Humanitarian Medical Excellence.</h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Founded with a mission to eliminate preventable blindness, SamVision operates specialized clinics that serve thousands of patients annually. Our commitment to technology means we were pioneers in introducing Phacoemulsification (cataract surgery without stitches) to our patients.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-4xl font-black text-primary">15+</p>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Years in Ethiopia</p>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-black text-slate-900">50,000+</p>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Restored Visions</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <GlassCard className="p-10 border-slate-100 space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Treatable Ophthalmology Conditions</h3>
                <p className="text-sm text-slate-500 font-medium">Our specialists provide clear diagnosis, honest advice, and customised treatment plans for each condition.</p>
                <div className="flex flex-wrap gap-2 pt-4">
                  {treatableConditions.map((condition, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold">{condition}</span>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIALIZED DOCTORS ROSTER */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8 space-y-24">
          <div className="text-center space-y-4">
            <h2 className="text-primary font-black tracking-[0.5em] text-[10px] uppercase">Professional Roster</h2>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">Our Specialized Doctors.</p>
          </div>

          {/* Ophthalmologists & Specialists */}
          <div className="space-y-12">
            <h3 className="text-2xl font-black text-slate-900 border-b border-slate-200 pb-4">Ophthalmologists & Surgeons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {ophthalmologists.map(doc => (
                <div key={doc.id} className="group flex flex-col items-center text-center p-8 glass border-white rounded-[3rem] transition-all hover:shadow-2xl hover:border-primary/20">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white shadow-xl">
                    <img src={doc.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={doc.name} />
                  </div>
                  <div className="space-y-2 mb-6">
                    <h4 className="text-lg font-bold text-slate-900">{doc.name}</h4>
                    <p className="text-xs font-black text-primary uppercase tracking-widest">{doc.role}</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5 mb-8">
                    {doc.specialties.map(s => (
                      <span key={s} className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{s}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => onNavigate('booking')}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-primary"
                  >
                    Book with Doctor
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Optometrists */}
          <div className="space-y-12">
            <h3 className="text-2xl font-black text-slate-900 border-b border-slate-200 pb-4">Clinical Optometrists</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {optometrists.map(opt => (
                <div key={opt.id} className="flex flex-col items-center text-center p-8 glass border-white rounded-[3rem] group">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-2 border-white shadow-lg">
                    <img src={opt.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={opt.name} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900">{opt.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{opt.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Summary */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Our Clinical Capabilities.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {clinicalServices.map((service, idx) => (
              <div key={idx} className="p-8 glass border-slate-100 rounded-[2rem] space-y-4 hover:shadow-2xl transition-all group">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black group-hover:bg-primary group-hover:text-white transition-colors">
                  {idx + 1}
                </div>
                <p className="font-bold text-slate-800 leading-tight">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Strip */}
      <section className="py-32 px-8">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.5em]">Global Standards</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32">
            <div className="space-y-2">
              <p className="text-3xl font-black text-slate-900 italic">ZEISS</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Exclusive Agency Partner</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-black text-slate-900">ISO 9001</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quality Certified</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
