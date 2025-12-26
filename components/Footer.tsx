
import React from 'react';
import { ViewType, Branch } from '../types';
import { BRANCHES } from '../data';

interface FooterProps {
  onNavigate: (view: ViewType) => void;
  onBranchChange: (branch: Branch) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, onBranchChange }) => {
  return (
    <footer className="bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <img src="/images/logos/official-logo.png" className="h-10 md:h-12 w-auto object-contain brightness-0 invert" alt="SamVision Logo" />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Ethiopia's leading provider of clinical ophthalmology and premium eyewear. Redefining vision through technology and surgical excellence.
          </p>
          <div className="flex space-x-4">
            {['fb', 'ig', 'tw', 'li'].map(s => (
              <div key={s} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary cursor-pointer transition-colors">
                <span className="text-[10px] font-bold uppercase">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-gray-200">Quick Links</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            {[
              { label: 'Services', view: 'services' },
              { label: 'Optical Shop', view: 'shop' },
              { label: 'Corporate', view: 'corporate' },
              { label: 'About Us', view: 'about' },
              { label: 'Contact', view: 'contact' },
              { label: 'Admin Portal', view: 'admin' }
            ].map(link => (
              <li key={link.label} className="hover:text-primary cursor-pointer transition-colors" onClick={() => onNavigate(link.view as ViewType)}>{link.label}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-gray-200">Our Branches</h4>
          <ul className="space-y-6">
            {BRANCHES.map(b => (
              <li key={b.id} className="space-y-1 cursor-pointer group" onClick={() => { onBranchChange(b); onNavigate('branch'); }}>
                <p className="text-sm font-bold text-gray-200 group-hover:text-primary transition-colors">{b.name}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{b.address}</p>
                <div className="space-y-0.5">
                  <a href={`tel:${b.phone}`} className="text-xs text-primary font-bold hover:underline block">{b.phone}</a>
                  {b.phone2 && (
                    <a href={`tel:${b.phone2}`} className="text-xs text-primary font-bold hover:underline block">{b.phone2}</a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-bold text-gray-200">Newsletter</h4>
          <p className="text-xs text-gray-400">Get eye health tips and promotion alerts.</p>
          <div className="relative">
            <input
              type="email"
              placeholder="Your email"
              className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <button className="absolute right-1 top-1 bottom-1 bg-primary text-white px-4 rounded-full text-xs font-bold">Join</button>
          </div>
          <div className="flex items-center space-x-2 grayscale opacity-50 pt-4">
            <div className="bg-white px-2 py-1 rounded text-gray-900 font-bold text-[10px]">ZEISS</div>
            <div className="bg-white px-2 py-1 rounded text-gray-900 font-bold text-[10px]">ISO 9001</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
        <p>&copy; 2024 SamVision Optical Workers. All Rights Reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
