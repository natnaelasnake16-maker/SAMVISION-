
import React, { useState } from 'react';
import { ViewType } from '../types';
import GlassCard from '../components/GlassCard';

interface ContactProps {
  onNavigate: (view: ViewType) => void;
}

const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#fbfcfd] min-h-screen pt-24 lg:pt-32">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="flex flex-col lg:flex-row gap-20">

          {/* Contact Details */}
          <div className="lg:w-1/2 space-y-12 animate-fade-up">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                Get in <br /><span className="text-primary">Touch.</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md">
                Have an enquiry or need expert advice about your vision? Our medical and optical teams are ready to assist you.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <GlassCard className="p-8 border-slate-100 flex items-center space-x-6 hover:border-primary transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 text-primary flex items-center justify-center text-3xl group-hover:bg-primary group-hover:text-white transition-all">
                  📞
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Hotline</p>
                  <a href="tel:+251941545454" className="text-2xl font-black text-slate-900 tracking-tight hover:text-primary transition-colors block">+251 94154 5454</a>
                </div>
              </GlassCard>

              <GlassCard className="p-8 border-slate-100 flex items-center space-x-6 hover:border-primary transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-accent flex items-center justify-center text-3xl group-hover:bg-accent group-hover:text-white transition-all">
                  📧
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">info@samvisioneyecare.com</p>
                </div>
              </GlassCard>
            </div>

            <div className="p-8 glass border-white rounded-[2rem] space-y-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Global Support</p>
              <p className="text-slate-600 font-medium text-sm">
                We provide consultations for international patients and corporate entities. Expect a response within 24 business hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-1/2 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <GlassCard className="p-10 md:p-14 border-white bg-white/60 shadow-2xl relative overflow-hidden">
              {submitted ? (
                <div className="text-center space-y-6 py-10">
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-4xl mx-auto">✓</div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Request Received</h2>
                  <p className="text-slate-500 font-medium">Thank you for reaching out. One of our clinical coordinators will contact you shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="text-primary font-black uppercase text-xs tracking-widest">Submit Another Inquiry</button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Full Name</label>
                    <input type="text" required className="w-full p-4 bg-white/50 border border-slate-100 rounded-2xl outline-none focus:border-primary transition-all font-medium" placeholder="Abebe Kebede" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input type="email" required className="w-full p-4 bg-white/50 border border-slate-100 rounded-2xl outline-none focus:border-primary transition-all font-medium" placeholder="name@email.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input type="tel" required className="w-full p-4 bg-white/50 border border-slate-100 rounded-2xl outline-none focus:border-primary transition-all font-medium" placeholder="+251 ..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">How can we help?</label>
                    <textarea rows={4} className="w-full p-4 bg-white/50 border border-slate-100 rounded-2xl outline-none focus:border-primary transition-all font-medium resize-none" placeholder="Enquiry details..."></textarea>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">
                      * By submitting this form, you consent to being contacted via phone, messaging, or email regarding your vision care enquiry.
                    </p>
                  </div>

                  <button className="w-full bg-primary text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all">
                    Request a Call Back
                  </button>
                </form>
              )}
            </GlassCard>
          </div>

        </div>
      </div>

      {/* Map Strip / Location Visual */}
      <section className="py-20 bg-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="relative rounded-[3rem] overflow-hidden h-96 shadow-inner">
            <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center space-y-4">
                <p className="text-primary font-black uppercase tracking-[0.5em] text-sm">Addis Ababa, Ethiopia</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter">Visit our Flagship Clinic</p>
              </div>
            </div>
            <img src="/images/contact/banner.jpg" className="w-full h-full object-cover" alt="Map Placeholder" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
