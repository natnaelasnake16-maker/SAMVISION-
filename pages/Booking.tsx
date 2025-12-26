
import React, { useState } from 'react';
import { ViewType, Branch } from '../types';
import { SERVICES, CLINICIANS, BRANCHES } from '../data';
import GlassCard from '../components/GlassCard';

interface BookingProps {
  selectedBranch: Branch;
  onNavigate: (view: ViewType) => void;
}

const Booking: React.FC<BookingProps> = ({ selectedBranch, onNavigate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceId: '',
    clinicianId: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: ''
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl font-bold">Book Your Appointment</h1>
        <p className="text-gray-500">Secure your session with our experts at {selectedBranch.name}.</p>
        
        {/* Progress Bar */}
        <div className="flex items-center justify-center space-x-4 pt-4">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 mx-2 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <GlassCard className="p-8 shadow-xl">
        {step === 1 && (
          <div className="space-y-8 animate-fade-up">
            <div className="space-y-4">
              <label className="block font-bold text-gray-700">Select Branch</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BRANCHES.map(b => (
                  <button 
                    key={b.id}
                    onClick={() => {}} // Handle branch selection change if needed
                    className={`p-4 rounded-xl border-2 text-left transition-all ${selectedBranch.id === b.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/50'}`}
                  >
                    <p className="font-bold">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.address}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block font-bold text-gray-700">Select Service</label>
              <select 
                className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                value={formData.serviceId}
                onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
              >
                <option value="">Select a service...</option>
                {SERVICES.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </div>

            <button 
              disabled={!formData.serviceId}
              onClick={nextStep}
              className="w-full bg-primary disabled:bg-gray-300 text-white py-4 rounded-xl font-bold text-lg shadow-lg"
            >
              Continue to Schedule
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-up">
             <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block font-bold text-gray-700">Select Date</label>
                  <input 
                    type="date" 
                    className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="block font-bold text-gray-700">Select Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setFormData({...formData, time: t})}
                        className={`py-2 rounded-lg border-2 font-semibold text-sm transition-all ${formData.time === t ? 'border-primary bg-primary text-white' : 'border-gray-100 hover:border-primary/50'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
             </div>

             <div className="space-y-4">
                <label className="block font-bold text-gray-700">Choose Clinician (Optional)</label>
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {CLINICIANS.map(c => (
                    <button 
                      key={c.id}
                      onClick={() => setFormData({...formData, clinicianId: c.id})}
                      className={`flex-shrink-0 w-32 p-3 rounded-2xl border-2 text-center transition-all ${formData.clinicianId === c.id ? 'border-primary bg-primary/5' : 'border-gray-100'}`}
                    >
                      <img src={c.image} className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" alt={c.name} />
                      <p className="text-[10px] font-bold leading-tight">{c.name}</p>
                    </button>
                  ))}
                  <button 
                    onClick={() => setFormData({...formData, clinicianId: 'any'})}
                    className={`flex-shrink-0 w-32 p-3 rounded-2xl border-2 text-center transition-all ${formData.clinicianId === 'any' ? 'border-primary bg-primary/5' : 'border-gray-100'}`}
                  >
                    <div className="w-16 h-16 rounded-full mx-auto mb-2 bg-gray-100 flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <p className="text-[10px] font-bold leading-tight">First Available</p>
                  </button>
                </div>
             </div>

             <div className="flex space-x-4">
                <button onClick={prevStep} className="flex-1 bg-gray-100 py-4 rounded-xl font-bold">Back</button>
                <button 
                  disabled={!formData.date || !formData.time}
                  onClick={nextStep} 
                  className="flex-[2] bg-primary disabled:bg-gray-300 text-white py-4 rounded-xl font-bold"
                >
                  Continue
                </button>
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fade-up">
            <div className="space-y-4">
              <label className="block font-bold text-gray-700">Patient Information</label>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200">
               <h3 className="font-bold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Summary
               </h3>
               <div className="space-y-2 text-sm text-gray-600">
                  <p>Branch: <span className="font-bold text-gray-900">{selectedBranch.name}</span></p>
                  <p>Service: <span className="font-bold text-gray-900">{SERVICES.find(s => s.id === formData.serviceId)?.title}</span></p>
                  <p>Schedule: <span className="font-bold text-gray-900">{formData.date} at {formData.time}</span></p>
               </div>
            </div>

            <button 
              onClick={() => {
                alert("Appointment Request Sent! We'll contact you for confirmation.");
                onNavigate('home');
              }}
              className="w-full bg-primary text-white py-5 rounded-xl font-bold text-xl shadow-xl shadow-teal-500/30"
            >
              Confirm Appointment
            </button>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default Booking;
