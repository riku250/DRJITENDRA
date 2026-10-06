import React from 'react';
import { Phone, MessageSquare, Calendar, Activity, Image as ImageIcon } from 'lucide-react';
import { ClinicSettings } from '../types';

interface MobileBottomNavProps {
  settings: ClinicSettings | null;
  onNavigate: (page: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ settings, onNavigate }) => {
  const primaryPhone = settings?.primary_phone || '9525719654';
  const whatsappNumber = settings?.whatsapp_number || primaryPhone;
  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent('नमस्ते, मुझे मां जानकी एक्स-रे में appointment लेना है।')}`;
  
  // Directions link using Google Maps query
  const mapsQuery = encodeURIComponent(settings?.google_maps_query || 'Maa Janki X-Ray, Opposite Srishti Jyoti Public School, Main Road, Poojahan Patjirva Chowk');
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div id="sticky-mobile-bottom-nav" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-1.5 py-1.5 safe-area-pb">
      <div className="grid grid-cols-5 gap-1 max-w-lg mx-auto">
        {/* Call Button */}
        <a
          id="mobile-bottom-call-btn"
          href={`tel:${primaryPhone}`}
          className="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-slate-700 hover:text-teal-700 hover:bg-slate-100 active:bg-teal-50 transition-colors min-h-[48px]"
        >
          <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 mb-0.5 shadow-xs">
            <Phone className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Call</span>
        </a>

        {/* WhatsApp Button */}
        <a
          id="mobile-bottom-whatsapp-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/50 active:bg-emerald-100 transition-colors min-h-[48px]"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-0.5 shadow-xs">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">WhatsApp</span>
        </a>

        {/* Appointment Button */}
        <button
          id="mobile-bottom-appointment-btn"
          onClick={() => {
            onNavigate('appointment');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-white bg-gradient-to-br from-teal-600 to-teal-700 active:scale-95 transition-all min-h-[48px] shadow-sm shadow-teal-600/30"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white mb-0.5">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Appointment</span>
        </button>

        {/* X-Ray Button */}
        <button
          id="mobile-bottom-xray-btn"
          onClick={() => {
            onNavigate('xray');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-cyan-900 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200/80 active:scale-95 transition-all min-h-[48px]"
        >
          <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 mb-0.5 shadow-2xs">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold tracking-tight text-cyan-900">एक्स-रे</span>
        </button>

        {/* Gallery Button */}
        <button
          id="mobile-bottom-gallery-btn"
          onClick={() => {
            onNavigate('gallery');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-slate-700 hover:text-teal-700 hover:bg-slate-100 active:bg-teal-50 transition-colors min-h-[48px]"
        >
          <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 mb-0.5 shadow-xs">
            <ImageIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">गैलरी</span>
        </button>
      </div>
    </div>
  );
};
