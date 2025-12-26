
import React, { useState, useEffect } from 'react';
import { ViewType } from '../types';
import { CLINICIANS } from '../data';
import GlassCard from '../components/GlassCard';

interface ServicesProps {
  onNavigate: (view: ViewType) => void;
}

const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('All Services');

  const navTabs = ['Diagnostics', 'Medical Management', 'Surgical Procedures', 'Follow-Up Care'];

  const eyeCareServices = [
    {
      title: "Phacoemulsification",
      description: "Advanced cataract removal procedure using ultrasound technology to safely break down and remove the cloudy lens, followed by lens replacement for clear vision.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
    {
      title: "Cataract Surgery",
      description: "Comprehensive surgical treatment for cataracts, restoring vision clarity and improving quality of life through modern, minimally invasive techniques.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    },
    {
      title: "Lens Implantation",
      description: "Precision implantation of intraocular lenses to correct vision following cataract removal or for refractive correction.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
    },
    {
      title: "Diabetic Eye Checkup",
      description: "Specialised eye examinations for diabetic patients to detect, monitor, and manage diabetes-related eye conditions at an early stage.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
    },
    {
      title: "Glaucoma Treatment",
      description: "Diagnosis and management of glaucoma to control eye pressure and prevent optic nerve damage through medical and surgical care.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
    {
      title: "Optical Dispensary",
      description: "A complete optical service providing prescription lenses and eyewear solutions tailored to your vision needs.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    },
    {
      title: "Retina Services",
      description: "Diagnosis and treatment of retinal conditions using advanced imaging and treatment technologies to preserve and improve vision.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" /></svg>
    },
    {
      title: "Computerized Eye Testing",
      description: "Comprehensive digital eye examinations using computerised equipment for accurate assessment of visual health.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.75 17L9 21h6l-.75-4M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    },
    {
      title: "Pediatric Eye Care",
      description: "Specialised eye care services for children, focusing on early detection and treatment of childhood vision problems.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    }
  ];

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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
    setActiveTab(id.replace(/-/g, ' '));
  };

  return (
    <div className="bg-[#fbfcfd]">
      <div className="h-16 md:h-20" /> {/* Navbar Spacer */}

      {/* 1. COMPACT HERO */}
      <section className="relative h-[40vh] md:h-[45vh] flex items-center overflow-hidden px-4 md:px-8">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/services/hero.jpg"
            className="w-full h-full object-cover brightness-[0.7]"
            alt="Clinical Equipment"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="max-w-3xl space-y-4 md:space-y-8 animate-fade-up text-center md:text-left">
            <h1 className="text-3xl md:text-7xl font-black text-white leading-tight md:leading-none tracking-tighter">
              Clinical & Surgical <br /><span className="text-teal-400">Excellence.</span>
            </h1>
            <p className="text-sm md:text-lg text-white/70 leading-relaxed font-medium max-w-md mx-auto md:mx-0">State-of-the-art diagnostic tools and advanced surgical equipment ensuring safe procedures.</p>
          </div>
        </div>
      </section>

      {/* 2. STICKY SUB-NAV */}
      <nav className="sticky top-16 z-40 glass border-y border-slate-100 py-3 md:py-3 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 md:px-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-3 md:space-x-6 min-w-max justify-start md:justify-center">
            {navTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => scrollToSection(tab.replace(/\s+/g, '-'))}
                className={`px-5 md:px-6 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-primary'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 3. DIAGNOSTICS & PEDIATRIC */}
      <section id="Diagnostics" className="py-16 md:py-32 max-w-7xl mx-auto px-4 sm:px-8 reveal">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Comprehensive Eye Exam */}
          <GlassCard className="p-6 md:p-10 border-slate-100 space-y-6 md:space-y-8">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2 md:space-y-4">
                <p className="text-primary font-black tracking-[0.3em] text-[9px] md:text-[10px] uppercase">Clinical Screening</p>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">Comprehensive Eye Examination</h2>
              </div>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary shrink-0">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
            </div>

            <div className="p-5 md:p-6 bg-slate-50 rounded-xl md:rounded-2xl space-y-3 md:space-y-4 border border-slate-100">
              <p className="text-xs md:text-sm font-bold text-slate-700">Lead Surgeon: Dr. Fitsum Bekele Gulilat</p>
              <ul className="space-y-2">
                {['Vision testing & refraction', 'Eye pressure measurement', 'Early disease detection'].map(item => (
                  <li key={item} className="flex items-center text-[11px] md:text-sm text-slate-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>

          {/* Pediatric Eye Care */}
          <GlassCard className="p-6 md:p-10 border-amber-100 bg-amber-50/5 space-y-6 md:space-y-8">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2 md:space-y-4">
                <p className="text-amber-600 font-black tracking-[0.3em] text-[9px] md:text-[10px] uppercase">Childhood Vision</p>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">Pediatric Eye Care</h2>
              </div>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-500/10 rounded-xl md:rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>

            <div className="p-5 md:p-6 bg-white/80 rounded-xl md:rounded-2xl space-y-4 border border-amber-50">
              <p className="text-xs md:text-sm font-bold text-slate-700">Specialist: Dr. Mandefro Sintayehu</p>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {['Pediatric exams', 'Lazy eye', 'Squint', 'Refractive errors'].map(item => (
                  <div key={item} className="text-[10px] md:text-[11px] font-bold text-slate-600 bg-amber-50 px-2 md:px-3 py-2 rounded-lg text-center leading-tight">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* 4. SURGICAL PROCEDURES */}
      <section id="Surgical-Procedures" className="py-16 md:py-32 bg-white relative overflow-hidden reveal px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20 space-y-4">
            <h2 className="text-primary font-black tracking-[0.4em] text-[9px] md:text-[10px] uppercase">Surgical Excellence</h2>
            <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">Surgical Procedures.</p>
            <p className="text-sm md:text-lg text-slate-500 font-medium max-w-2xl mx-auto">Equipped with the latest technology for high-precision ophthalmic surgeries.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Phacoemulsification */}
            <div className="group p-8 md:p-12 glass border-slate-100 rounded-[2.5rem] md:rounded-[3.5rem] relative overflow-hidden transition-all duration-700 hover:shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" /></svg>
              </div>
              <div className="space-y-6 relative z-10">
                <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Phacoemulsification (Phaco)</h3>
                <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">Our signature modern cataract procedure. Using ultrasound technology to dissolve the cloudy lens and replace it with a premium intraocular lens (IOL).</p>
                <div className="pt-4 flex flex-wrap gap-2">
                  {['Micro-Incision', 'No Stitches', 'Rapid Recovery', 'Outpatient'].map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Other Surgeries */}
            <div className="grid gap-6">
              {[
                { title: "ECC/E Surgery", desc: "Expert extraction techniques for mature and complex cataract cases requiring specialized care.", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.158-2.046-.46-2.984z" /></svg> },
                { title: "Glaucoma Procedures", desc: "Surgical interventions including trabeculectomy to manage advanced intraocular pressure.", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
                { title: "Minor Surgeries", desc: "Clinical procedures for pterygium removal, chalazion treatment, and lump excisions.", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.121 14.121L19 19m-7-7l7 7m-7-7l-2.879 2.879M12 12L9.121 9.121m0 0L5 5m4.121 4.121L5 19m14-14L5 19" /></svg> }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-start space-x-6 hover:bg-white transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-slate-900 tracking-tight">{item.title}</h4>
                    <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOLLOW-UP CARE */}
      <section id="Follow-Up-Care" className="py-16 md:py-32 bg-[#f8fafc] reveal px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 md:space-y-12">
              <div className="space-y-4">
                <h2 className="text-teal-500 font-black tracking-[0.4em] text-[10px] uppercase">Aftercare Protocol</h2>
                <p className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">Continuous <br />Patient Care.</p>
                <p className="text-sm md:text-lg text-slate-500 font-medium leading-relaxed max-w-md">Our commitment to your vision doesn't end in the OT. We provide rigorous post-operative monitoring to ensure optimal results.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { label: "Post-Op Reviews", val: "Scheduled weekly checkups to monitor healing progress." },
                  { label: "Vision Refinement", val: "Final lens adjustments for perfect visual clarity." },
                  { label: "Medication Management", val: "Strict eye drop and medication schedules." },
                  { label: "Emergency Support", val: "24/7 dedicated lines for surgical patients." }
                ].map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed">{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-[4rem] rotate-3" />
              <div className="relative glass border-white overflow-hidden rounded-[3.5rem] p-10 md:p-16 space-y-10">
                <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Recovery Milestones</p>
                <div className="space-y-8 relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-primary/20" />
                  {[
                    { day: "Day 1", desc: "Initial pressure check and vision assessment." },
                    { day: "Day 7", desc: "Corneal healing review and safety verification." },
                    { day: "Month 1", desc: "Full visual capacity assessment and outcome report." }
                  ].map((m, i) => (
                    <div key={i} className="flex space-x-6 relative z-10">
                      <div className="w-6 h-6 rounded-full bg-primary border-4 border-white shadow-lg shrink-0 mt-1" />
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{m.day}</p>
                        <p className="text-sm font-bold text-slate-800 tracking-tight">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-slate-100 flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                    <img src="/images/doctors/dr-fitsum.jpg" className="w-full h-full object-cover" alt="Dr. Fitsum" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supervising Specialist</p>
                    <p className="text-xs font-bold text-slate-900">Dr. Fitsum Bekele Gulilat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EYE CARE SERVICES WE OFFER - REDUCED GAP */}
      <section id="Services-Offered" className="py-16 md:py-32 bg-white relative overflow-hidden reveal px-4 sm:px-8">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-20 space-y-3">
            <h2 className="text-primary font-black tracking-[0.4em] text-[10px] uppercase">Our Capabilities</h2>
            <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">Eye Care Services We Offer</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {eyeCareServices.map((service, index) => (
              <GlassCard
                key={index}
                hoverable
                className="p-8 border-primary/20 flex flex-col h-full bg-white/40 backdrop-blur-2xl group hover:border-primary/40 hover:shadow-glow transition-all duration-500"
              >
                <div className="mb-6 w-14 h-14 bg-primary/10 border border-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-sm shadow-primary/5">
                  {service.icon}
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-4 tracking-tight group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed flex-grow">
                  {service.description}
                </p>
                <div className="mt-6 flex items-center text-[10px] font-black uppercase tracking-widest text-primary/0 group-hover:text-primary transition-all duration-500 transform translate-x-[-10px] group-hover:translate-x-0">
                  <span>Learn More</span>
                  <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA RESPONSIVE */}
      <section className="py-20 md:py-32 bg-white px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter leading-tight">Quality clinical care starts with <br className="hidden sm:block" />a single consultation.</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => onNavigate('booking')} className="w-full sm:w-auto bg-primary text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl">Book Now</button>
            <button onClick={() => onNavigate('contact')} className="w-full sm:w-auto glass border-slate-200 text-slate-900 px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">Enquire</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
