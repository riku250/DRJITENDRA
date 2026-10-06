import React from 'react';
import { 
  Zap, Ambulance, Scan, Bone, Footprints, 
  HeartPulse, Bandage, Calendar, CheckCircle2, Phone, ArrowRight 
} from 'lucide-react';
import { FacilityItem, ClinicSettings } from '../types';

interface FacilitiesPageProps {
  facilities: FacilityItem[];
  settings: ClinicSettings | null;
  onNavigate: (page: string) => void;
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({ facilities, settings, onNavigate }) => {
  const primaryPhone = settings?.primary_phone || '9525719654';

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Ambulance':
        return <Ambulance className="w-7 h-7 text-red-600" />;
      case 'Scan':
        return <Scan className="w-7 h-7 text-cyan-600" />;
      case 'Bone':
        return <Bone className="w-7 h-7 text-teal-600" />;
      case 'Footprints':
        return <Footprints className="w-7 h-7 text-amber-600" />;
      case 'Activity':
        return <HeartPulse className="w-7 h-7 text-emerald-600" />;
      case 'Bandage':
        return <Bandage className="w-7 h-7 text-indigo-600" />;
      case 'Zap':
        return <Zap className="w-7 h-7 text-yellow-600" />;
      case 'CalendarCheck':
      default:
        return <Calendar className="w-7 h-7 text-teal-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-teal-700">Home</button>
        <span>/</span>
        <span className="text-slate-800">Clinic Facilities</span>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
          <Zap className="w-3.5 h-3.5" />
          <span>आधुनिक अवसंरचना</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          क्लिनिक की सुविधाएं (Facilities)
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          मां जानकी एक्स-रे में मरीजों की सुविधा, सटीक जांच एवं गुणवत्तापूर्ण उपचार सुनिश्चित करने के लिए सभी आवश्यक सुविधाएं उपलब्ध कराई गई हैं।
        </p>
      </div>

      {/* Grid of 8 Facilities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {facilities.map((fac) => (
          <div
            key={fac.id}
            className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-xs">
                {getIcon(fac.icon)}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{fac.title}</h3>
                {fac.highlight && (
                  <span className="inline-block mt-1 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {fac.highlight}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {fac.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-teal-700 font-bold">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>उपलब्ध सुविधा</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Strip */}
      <div className="bg-gradient-to-r from-teal-800 to-cyan-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-2xl font-black">क्या आपको किसी सुविधा के बारे में पूछताछ करनी है?</h3>
          <p className="text-sm text-teal-100">हमारे हेल्पलाइन नंबर पर सीधे कॉल करें अथवा ऑनलाइन अपॉइंटमेंट बुक करें।</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('appointment')}
            className="bg-white hover:bg-slate-100 text-slate-900 font-black px-6 py-3 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
          >
            अपॉइंटमेंट बुक करें
          </button>
          <a
            href={`tel:${primaryPhone}`}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-colors"
          >
            Call: {primaryPhone}
          </a>
        </div>
      </div>
    </div>
  );
};
