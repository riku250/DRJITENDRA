import React, { useState } from 'react';
import { 
  HeartPulse, Scan, Bone, Footprints, Ambulance, 
  Activity, CheckCircle2, ChevronRight, Calendar, Phone, Sparkles 
} from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesPageProps {
  services: ServiceItem[];
  onNavigate: (page: string, serviceName?: string) => void;
  primaryPhone?: string;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  onNavigate,
  primaryPhone = '9525719654'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'सभी सेवाएं (All)' },
    { id: 'orthopedic', label: 'हड्डी एवं जोड़' },
    { id: 'xray', label: 'X-Ray जांच' },
    { id: 'physiotherapy', label: 'फिजियोथेरेपी' },
    { id: 'ctev', label: 'CTEV (क्लबफुट)' },
    { id: 'emergency', label: 'इमरजेंसी' }
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-teal-700">Home</button>
        <span>/</span>
        <span className="text-slate-800">Services & Facilities</span>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
          <HeartPulse className="w-3.5 h-3.5" />
          <span>संपूर्ण चिकित्सकीय सुविधाएं</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          क्लिनिक में उपलब्ध प्रमुख सेवाएं (Services)
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          मां जानकी एक्स-रे में मस्कुलोस्केलेटल, मैनुअल इमेजिंग एवं फिजियोथेरेपी संबंधी व्यापक सेवाएं एक ही छत के नीचे उपलब्ध कराई जाती हैं।
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv, idx) => (
          <div
            key={srv.id}
            className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-teal-50 group-hover:bg-teal-600 group-hover:text-white text-teal-700 flex items-center justify-center transition-colors">
                  {srv.category === 'xray' && <Scan className="w-6 h-6" />}
                  {srv.category === 'ctev' && <Footprints className="w-6 h-6" />}
                  {srv.category === 'physiotherapy' && <HeartPulse className="w-6 h-6" />}
                  {srv.category === 'emergency' && <Ambulance className="w-6 h-6" />}
                  {srv.category === 'orthopedic' && <Bone className="w-6 h-6" />}
                  {srv.category === 'general' && <Activity className="w-6 h-6" />}
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {srv.title_hi}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{srv.title_en}</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {srv.description}
              </p>

              {srv.features && srv.features.length > 0 && (
                <ul className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  {srv.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 italic">शुल्क: क्लिनिक पर संपर्क करें</span>
              <button
                onClick={() => onNavigate('appointment', srv.title_hi)}
                className="inline-flex items-center gap-1.5 bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>अपॉइंटमेंट लें</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Assistance Box */}
      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center space-y-4 max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-slate-900">क्या आपकी समस्या सूची में नहीं है?</h3>
        <p className="text-xs sm:text-sm text-slate-600">
          सीधे क्लिनिक पर फोन करके परामर्श लें। हमारे डॉक्टर आपकी स्थिति के अनुसार सही मार्गदर्शन प्रदान करेंगे।
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={`tel:${primaryPhone}`}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call: {primaryPhone}</span>
          </a>
          <button
            onClick={() => onNavigate('appointment')}
            className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-300 transition-colors"
          >
            सामान्य परामर्श बुक करें
          </button>
        </div>
      </div>
    </div>
  );
};
