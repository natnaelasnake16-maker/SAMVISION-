
import React from 'react';
import { ViewType } from '../types';
import GlassCard from '../components/GlassCard';

interface CorporateProps {
  onNavigate: (view: ViewType) => void;
}

const Corporate: React.FC<CorporateProps> = ({ onNavigate }) => {
  const partners = [
    'Ethiopian Airlines', 'Commercial Bank of Ethiopia', 'Ethio Telecom', 'Ministry of Health', 'UNESCO', 'UNDP'
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-24">
      {/* Hero */}
      <section className="flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 space-y-8">
           <h1 className="text-5xl font-bold leading-tight">Empowering Teams with <br /><span className="text-primary">Perfect Vision.</span></h1>
           <p className="text-xl text-gray-500">
             SamVision provides comprehensive eye screening packages, corporate eyewear programs, and on-site clinics for Ethiopia's leading organizations.
           </p>
           <div className="flex space-x-4">
              <button className="bg-primary text-white px-8 py-4 rounded-full font-bold shadow-xl">Inquire for Business</button>
              <button className="border-2 border-gray-200 px-8 py-4 rounded-full font-bold hover:bg-gray-50">View Packages</button>
           </div>
        </div>
        <div className="lg:w-1/2">
           <div className="grid grid-cols-2 gap-4">
              <img src="https://picsum.photos/id/1/400/300" className="rounded-2xl" alt="Corporate 1" />
              <img src="https://picsum.photos/id/10/400/300" className="rounded-2xl mt-8" alt="Corporate 2" />
           </div>
        </div>
      </section>

      {/* Trust Grid */}
      <section className="space-y-12">
        <div className="text-center">
           <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-gray-400 mb-4">Trusted by Market Leaders</h2>
           <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
              {partners.map(p => (
                <span key={p} className="text-2xl font-bold tracking-tighter text-gray-800">{p}</span>
              ))}
           </div>
        </div>
      </section>

      {/* Services B2B */}
      <section className="grid md:grid-cols-2 gap-12">
         <GlassCard className="p-10 space-y-6 bg-primary/5 border-none">
            <h3 className="text-2xl font-bold">Employee Wellness Screenings</h3>
            <p className="text-gray-600">On-site or branch-based comprehensive exams for your entire staff. Boost productivity through better vision.</p>
            <ul className="space-y-3">
              {['Customizable Packages', 'Digital Records', 'On-site Optical Shop Setup'].map(i => (
                <li key={i} className="flex items-center space-x-2 text-sm font-semibold">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                   <span>{i}</span>
                </li>
              ))}
            </ul>
         </GlassCard>

         <GlassCard className="p-10 space-y-6 bg-accent/5 border-none">
            <h3 className="text-2xl font-bold">Optical Procurement</h3>
            <p className="text-gray-600">Specialized B2B pricing for bulk eyewear, safety goggles, and ZEISS lens solutions for your organization.</p>
            <ul className="space-y-3">
              {['Wholesale Discounts', 'Direct Invoicing', 'Dedicated Account Manager'].map(i => (
                <li key={i} className="flex items-center space-x-2 text-sm font-semibold">
                   <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                   <span>{i}</span>
                </li>
              ))}
            </ul>
         </GlassCard>
      </section>
      
      {/* ZEISS Agency info */}
      <section className="bg-gray-900 text-white rounded-[3rem] p-12 lg:p-24 overflow-hidden relative">
        <div className="relative z-10 max-w-2xl space-y-8">
           <h2 className="text-4xl font-bold">Exclusive ZEISS Agent for Ethiopia</h2>
           <p className="text-gray-400 text-lg">
             Partner with us to provide your employees with the world's most precise vision technology. Our exclusive partnership with ZEISS ensures your team receives premium ophthalmic lenses designed for the digital workplace.
           </p>
           <button className="bg-white text-gray-900 px-10 py-4 rounded-full font-bold hover:bg-primary hover:text-white transition-colors">Partner with SamVision</button>
        </div>
        <div className="absolute top-0 right-0 h-full w-1/3 bg-blue-600/20 skew-x-12 hidden lg:block" />
      </section>
    </div>
  );
};

export default Corporate;
