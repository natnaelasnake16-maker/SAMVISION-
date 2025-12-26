
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverable = false }) => {
  return (
    <div className={`glass rounded-[2rem] p-6 transition-all duration-500 shadow-soft ${hoverable ? 'hover:shadow-2xl hover:-translate-y-1.5 hover:bg-white/80' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;