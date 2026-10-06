import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowUp, Phone } from 'lucide-react';
import { ClinicSettings } from '../types';

interface FloatingActionsProps {
  settings: ClinicSettings | null;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ settings }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 320);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappPhone = settings?.whatsapp_number || settings?.primary_phone || '9525719654';
  const whatsappUrl = `https://wa.me/91${whatsappPhone}?text=${encodeURIComponent('नमस्ते, मुझे मां जानकी एक्स-रे में appointment लेना है।')}`;
  const primaryPhone = settings?.primary_phone || '9525719654';

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* Back to Top */}
      {showScrollTop && (
        <button
          id="back-to-top-button"
          onClick={scrollToTop}
          title="ऊपर जाएं (Back to Top)"
          className="pointer-events-auto p-3 rounded-full bg-white text-slate-700 hover:text-teal-700 shadow-lg border border-slate-200 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Floating Call Button (Desktop/Tablet) */}
      <a
        id="floating-call-button"
        href={`tel:${primaryPhone}`}
        title={`Call: ${primaryPhone}`}
        className="hidden md:flex pointer-events-auto p-3.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all items-center justify-center group"
      >
        <Phone className="w-5 h-5" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 text-xs font-bold whitespace-nowrap transition-all duration-300 ease-in-out">
          {primaryPhone}
        </span>
      </a>

      {/* Floating WhatsApp with Tooltip */}
      <div 
        className="relative pointer-events-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-xl shadow-lg whitespace-nowrap border border-slate-700 animate-in fade-in slide-in-from-right-2 duration-150 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>WhatsApp पर तुरंत संदेश भेजें</span>
          </div>
        )}

        <a
          id="floating-whatsapp-button"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact via WhatsApp"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <MessageSquare className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-200 text-[10px] font-extrabold text-emerald-900 items-center justify-center">1</span>
          </span>
        </a>
      </div>
    </div>
  );
};
