import React from 'react';
import { PhoneCall, AlertCircle, Clock } from 'lucide-react';

interface EmergencyBannerProps {
  primaryPhone: string;
  secondaryPhone: string;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ primaryPhone, secondaryPhone }) => {
  return (
    <div id="emergency-top-banner" className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-6 shadow-sm border-b border-red-500/30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <div className="flex items-center gap-1.5 font-bold tracking-wide">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-200" />
            <span>24 Hours Emergency Service (आपातकालीन सेवा)</span>
          </div>
          <span className="hidden md:inline text-red-100">|</span>
          <div className="hidden md:flex items-center gap-1 text-red-100">
            <Clock className="w-3.5 h-3.5" />
            <span>प्रतिदिन 8:00 AM – 7:00 PM</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-red-100 text-xs">इमरजेंसी कॉल करें:</span>
          <a
            id="emergency-call-primary"
            href={`tel:${primaryPhone}`}
            className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-xs transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-200" />
            <span>{primaryPhone}</span>
          </a>
          <a
            id="emergency-call-secondary"
            href={`tel:${secondaryPhone}`}
            className="hidden sm:inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white/90 px-2 py-0.5 rounded-full text-xs transition-colors"
          >
            <span>{secondaryPhone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
