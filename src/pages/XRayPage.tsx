import React from 'react';
import { Scan, CheckCircle2, Phone, Calendar, ArrowRight, ShieldCheck, Zap, Clock } from 'lucide-react';
import { ClinicSettings } from '../types';

interface XRayPageProps {
  settings: ClinicSettings | null;
  onNavigate: (page: string) => void;
}

export const XRayPage: React.FC<XRayPageProps> = ({ settings, onNavigate }) => {
  const primaryPhone = settings?.primary_phone || '9525719654';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-teal-700">Home</button>
        <span>/</span>
        <span className="text-slate-800">X-Ray / Radiography</span>
      </div>

      {/* Main Feature Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-xl border border-slate-200 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-900">
              <Scan className="w-3.5 h-3.5" />
              <span>मैनुअल रेडियोग्राफी जांच</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              X-Ray / Radiography
            </h1>

            <p className="text-base text-slate-600 leading-relaxed">
              मां जानकी एक्स-रे में उच्च गुणवत्ता वाली मैनुअल एक्स-रे जांच सुविधा उपलब्ध है। हड्डी की चोट, फ्रैक्चर, जोड़ों के विकार, रीढ़ की हड्डी एवं चेस्ट से संबंधित जांच प्रशिक्षित रेडियोग्राफर द्वारा संपन्न की जाती है।
            </p>

            {/* Three key checklist points required by prompt */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-200">
                <CheckCircle2 className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">✓ X-Ray Facility (एक्स-रे सुविधा)</h4>
                  <p className="text-xs text-slate-600">सटीक व स्पष्ट मैनुअल इमेजिंग जिससे रोगों एवं फ्रैक्चर का सही निदान संभव होता है।</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-200">
                <CheckCircle2 className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">✓ Professional Radiographer (प्रशिक्षित रेडियोग्राफर)</h4>
                  <p className="text-xs text-slate-600">
                    श्री उपेंद्र कुमार (Mr. Upendra Kumar, NIMS University, Jaipur) द्वारा सभी सुरक्षा मानकों का पालन।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-200">
                <CheckCircle2 className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">✓ Modern Diagnostic Setup (आधुनिक डायग्नोस्टिक व्यवस्था)</h4>
                  <p className="text-xs text-slate-600">त्वरित रिपोर्टिंग, रेडिएशन सेफ्टी और अनवरत जनरेटर पावर बैकअप।</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                id="xray-contact-cta-btn"
                href={`tel:${primaryPhone}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-800 hover:to-teal-800 text-white font-black px-7 py-3.5 rounded-xl text-sm shadow-lg shadow-cyan-700/20 active:scale-98 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>X-Ray के लिए संपर्क करें ({primaryPhone})</span>
              </a>

              <button
                onClick={() => onNavigate('appointment')}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3.5 rounded-xl text-sm transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>अपॉइंटमेंट स्लॉट चुनें</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Radiographer Spotlight Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Scan className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] uppercase font-bold text-cyan-400 tracking-wider">
                    Radiographer Profile
                  </span>
                  <h3 className="text-xl font-bold">Mr. Upendra Kumar</h3>
                  <p className="text-xs text-slate-400">NIMS University, Jaipur</p>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
                <p>
                  श्री उपेंद्र कुमार NIMS University, Jaipur से प्रशिक्षित रेडियोग्राफर हैं। क्लिनिक में सभी एक्स-रे प्रक्रियाएं मरीज की शारीरिक सुरक्षा एवं न्यूनतम विकिरण (Low Radiation) प्रोटोकॉल के साथ संपन्न की जाती हैं।
                </p>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                  <div className="text-slate-200 font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>जांच का समय</span>
                  </div>
                  <div className="text-slate-400">प्रतिदिन प्रातः 8:00 बजे से सायं 7:00 बजे तक एवं 24 घंटे आपातकालीन सेवा</div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('radiographer')}
                className="w-full text-center text-xs font-bold py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
              >
                रेडियोग्राफर विवरण पृष्ठ देखें
              </button>
            </div>

            {/* Power backup card */}
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-start gap-3">
              <Zap className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-teal-950 font-bold">जनरेटर की सुविधा (Generator Backup):</strong>
                बिजली बाधित होने की स्थिति में भी एक्स-रे जांच में कोई रुकावट नहीं आती।
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
