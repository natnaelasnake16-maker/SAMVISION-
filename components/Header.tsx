
import React, { useState, useEffect } from 'react';
import { ViewType, Branch } from '../types';
import { BRANCHES } from '../data';

interface HeaderProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  selectedBranch: Branch;
  onBranchChange: (branch: Branch) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, selectedBranch, onBranchChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBranchHovered, setIsBranchHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; view: ViewType }[] = [
    { label: 'Services', view: 'services' },
    { label: 'Treatments', view: 'treatments' },
    { label: 'Specialists', view: 'teams' },
    { label: 'Optical Shop', view: 'shop' }
  ];

  const selectBranch = (branch: Branch) => {
    onBranchChange(branch);
    onNavigate('branch');
    setIsBranchHovered(false);
  };

  const linkColor = 'text-slate-900/80 hover:text-primary';
  const activeLinkColor = 'text-primary font-black';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out border-b ${isScrolled
        ? 'glass h-16 shadow-lg shadow-slate-900/5 border-slate-200/50'
        : 'bg-white/60 backdrop-blur-md h-16 md:h-20 border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Brand Identity */}
        <div className="flex items-center space-x-6 lg:space-x-12">
          <div
            className="flex items-center space-x-3 md:space-x-4 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="h-10 md:h-12 flex items-center justify-center transition-transform group-hover:scale-105">
              <img src="/images/logos/official-logo.png" className="h-full w-auto object-contain" alt="SamVision Logo" />
            </div>
          </div>

          {/* Main Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-10">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group ${currentView === item.view ? activeLinkColor : linkColor
                  }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${currentView === item.view ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
              </button>
            ))}

            {/* Branch Locations Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsBranchHovered(true)}
              onMouseLeave={() => setIsBranchHovered(false)}
            >
              <button
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${currentView === 'branch' ? activeLinkColor : linkColor
                  }`}
              >
                Locations
                <svg className={`w-3 h-3 transition-transform duration-300 ${isBranchHovered ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
              </button>

              {isBranchHovered && (
                <div className="absolute top-[80%] left-[-20px] pt-4 w-64 xl:w-72 animate-fade-up">
                  <div className="glass rounded-2xl md:rounded-[2rem] shadow-2xl border border-white/40 overflow-hidden py-2">
                    {BRANCHES.map((branch) => (
                      <button
                        key={branch.id}
                        onClick={() => selectBranch(branch)}
                        className={`w-full text-left px-5 py-3.5 hover:bg-white/60 transition-all group flex flex-col ${selectedBranch.id === branch.id ? 'bg-primary/5' : ''
                          }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-xs md:text-sm font-black tracking-tight ${selectedBranch.id === branch.id ? 'text-primary' : 'text-slate-800'}`}>
                            {branch.name}
                          </span>
                          {selectedBranch.id === branch.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </div>
                        <span className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                          {branch.type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Global Actions */}
        <div className="flex items-center space-x-3 md:space-x-4">

          <button
            onClick={() => onNavigate('booking')}
            className="bg-primary text-white px-5 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            Book Visit
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
