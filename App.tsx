import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Services from './pages/Services';
import Treatments from './pages/Treatments';
import Teams from './pages/Teams';
import Booking from './pages/Booking';
import Corporate from './pages/Corporate';
import BranchPage from './pages/BranchPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { ViewType, Branch } from './types';
import { BRANCHES } from './data';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedBranch, setSelectedBranch] = useState<Branch>(BRANCHES[0]);

  useEffect(() => {
    // Initial path check for /admin separation
    if (window.location.pathname === '/admin') {
      setCurrentView('admin');
    }

    const handlePopState = () => {
      if (window.location.pathname === '/admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.scrollTo(0, 0);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentView]);

  const handleNavigate = (view: ViewType) => {
    if (view === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (currentView === 'admin') {
      window.history.pushState({}, '', '/');
    }
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home onNavigate={handleNavigate} onBranchChange={setSelectedBranch} />;
      case 'shop': return <Shop onNavigate={handleNavigate} />;
      case 'services': return <Services onNavigate={handleNavigate} />;
      case 'treatments': return <Treatments onNavigate={handleNavigate} />;
      case 'teams': return <Teams onNavigate={handleNavigate} />;
      case 'booking': return <Booking selectedBranch={selectedBranch} onNavigate={handleNavigate} />;
      case 'corporate': return <Corporate onNavigate={handleNavigate} />;
      case 'about': return <About onNavigate={handleNavigate} />;
      case 'contact': return <Contact onNavigate={handleNavigate} />;
      case 'branch': return <BranchPage branch={selectedBranch} onNavigate={handleNavigate} />;
      case 'admin': return <Admin onNavigate={handleNavigate} />;
      default: return <Home onNavigate={handleNavigate} onBranchChange={setSelectedBranch} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
      />
      <main className="flex-grow pt-16 md:pt-0">
        {renderView()}
      </main>
      {currentView !== 'admin' && <Footer onNavigate={handleNavigate} onBranchChange={setSelectedBranch} />}

      {/* Mobile Sticky Bar */}
      {currentView !== 'admin' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-gray-200 z-50 flex items-center justify-around py-3">
          <button onClick={() => handleNavigate('home')} className={`flex flex-col items-center ${currentView === 'home' ? 'text-primary' : 'text-gray-500'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Home</span>
          </button>
          <button onClick={() => handleNavigate('booking')} className="bg-primary text-white p-3 rounded-full -mt-10 shadow-xl border-4 border-white transition-transform active:scale-90">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </button>
          <button onClick={() => handleNavigate('shop')} className={`flex flex-col items-center ${currentView === 'shop' ? 'text-primary' : 'text-gray-500'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Shop</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
