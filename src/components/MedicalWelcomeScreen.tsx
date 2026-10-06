import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scan, Activity, ShieldCheck, Clock, Phone, 
  MapPin, CheckCircle2, ArrowRight, Stethoscope, Zap, 
  MessageSquare, UserCheck, Calendar, Sparkles, Building2
} from 'lucide-react';
import { ClinicSettings } from '../types';

interface MedicalWelcomeScreenProps {
  settings: ClinicSettings | null;
  onContinue: () => void;
  onDirectAppointment?: () => void;
}

export const MedicalWelcomeScreen: React.FC<MedicalWelcomeScreenProps> = ({
  settings,
  onContinue,
  onDirectAppointment
}) => {
  const [isEntering, setIsEntering] = useState(false);

  const primaryPhone = settings?.primary_phone || '9525719654';
  const doctorName = settings?.doctor_name || 'Dr. Jitendra Kumar';
  const doctorQual = settings?.doctor_qualification || 'MBBS, D.Ortho (Fellow in Joint Replacement)';
  const doctorImage = settings?.doctor_image_url || 'https://kommodo.ai/i/FO7CYWP05Q4WRXPrY0yg';
  const radiographerName = settings?.radiographer_name || 'Mr. Upendra Kumar';
  const radiographerInst = settings?.radiographer_institution || 'NIMS University, Jaipur';
  const addressLine1 = settings?.address_line1 || 'सृष्टि ज्योति स्कूल के सामने';
  const addressLine2 = settings?.address_line2 || 'मेन रोड, पूजाहां पत्जीरवा चौक';
  const fee = settings?.consultation_fee || 100;

  const handleEnter = () => {
    setIsEntering(true);
    setTimeout(() => {
      onContinue();
    }, 350);
  };

  return (
    <AnimatePresence>
      <motion.div
        id="medical-welcome-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="fixed inset-0 z-[100] overflow-y-auto bg-gradient-to-br from-teal-50 via-slate-50 to-cyan-50/60 text-slate-800 flex flex-col justify-between"
      >
        {/* Top Fresh Strip */}
        <header className="bg-white/90 backdrop-blur-md border-b border-teal-100 shadow-xs px-4 sm:px-8 py-3">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-teal-800 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>खुला है: प्रतिदिन 8:00 AM – 7:00 PM · 24 घंटे आपातकालीन सेवा</span>
            </div>

            <a
              href={`tel:${primaryPhone}`}
              className="inline-flex items-center gap-1.5 font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-full border border-rose-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>हेल्पलाइन: {primaryPhone}</span>
            </a>
          </div>
        </header>

        {/* Center Card - Clean, Fresh, Easy to Understand */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 flex flex-col justify-center items-center">
          <div className="w-full bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-teal-100 space-y-6 sm:space-y-8">
            
            {/* Header Badge & Title */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 text-teal-900 font-bold text-xs sm:text-sm">
                <span className="w-2 h-2 rounded-full bg-teal-600" />
                <span>हार्दिक स्वागत है · Welcome</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                माँ जानकी एक्स-रे <br />
                <span className="text-teal-700">एवं ऑर्थोपेडिक क्लिनिक</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 flex items-center justify-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{addressLine1}, {addressLine2}</span>
              </p>
            </div>

            {/* Doctor & Medical Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50/80 p-5 sm:p-7 rounded-2xl border border-slate-200/90">
              
              {/* Doctor Large Picture Column */}
              <div className="md:col-span-5 flex flex-col items-center text-center space-y-3">
                <div className="relative group">
                  <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-4 border-teal-600 shadow-lg bg-teal-100 relative">
                    <img
                      src={doctorImage}
                      alt={doctorName}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 to-transparent p-2 text-center text-white text-xs font-bold">
                      {doctorName}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-sm shadow-md border-2 border-white">
                    +
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{doctorName}</h3>
                  <p className="text-xs text-teal-800 font-semibold">{doctorQual}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold">
                    परामर्श शुल्क: मात्र ₹{fee}
                  </span>
                </div>
              </div>

              {/* Key Features Column - Simple & Clear */}
              <div className="md:col-span-7 space-y-3.5 text-left">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    क्लिनिक की प्रमुख सुविधाएं
                  </h4>
                  <div className="h-0.5 w-12 bg-teal-600 rounded-full" />
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">मैनुअल एक्स-रे जांच (Manual X-Ray)</strong>
                      <span className="text-slate-600 text-xs">रेडियोग्राफर {radiographerName} ({radiographerInst}) द्वारा त्वरित रिपोर्ट।</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">हड्डी, जोड़ व नस रोग परामर्श</strong>
                      <span className="text-slate-600 text-xs">फ्रैक्चर, गठिया, जोड़ दर्द एवं जन्मजात टेढ़े पैर (CTEV) का इलाज।</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">लेज़र फिजियोथेरेपी व 24 घंटे बैकअप</strong>
                      <span className="text-slate-600 text-xs">हल्का फाइबरग्लास प्लास्टर एवं निरंतर जनरेटर सुविधा।</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* BIG, FRESH, EASY-TO-UNDERSTAND CONTINUE BUTTON     */}
            {/* ================================================= */}
            <div className="pt-2 text-center space-y-3">
              <button
                id="welcome-continue-btn"
                onClick={handleEnter}
                disabled={isEntering}
                className="w-full sm:w-auto sm:min-w-[340px] inline-flex items-center justify-center gap-3 bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-black text-base sm:text-lg py-4 px-8 rounded-2xl shadow-lg shadow-teal-700/25 active:scale-98 transition-all cursor-pointer group"
              >
                <span>{isEntering ? 'वेबसाइट खुल रही है...' : '👉 वेबसाइट खोलें (Continue)'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <p className="text-xs text-slate-500 font-medium">
                वेबसाइट पर जाने के लिए ऊपर दिए गए हरे बटन को दबाएं
              </p>
            </div>

            {/* Secondary Quick Action Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-slate-100 text-xs font-bold">
              <a
                href={`tel:${primaryPhone}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-rose-600" />
                <span>फोन पर बात करें ({primaryPhone})</span>
              </a>

              <a
                href={`https://wa.me/91${primaryPhone}?text=${encodeURIComponent('नमस्ते, मुझे मां जानकी एक्स-रे क्लिनिक में परामर्श लेना है।')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>व्हाट्सएप संदेश</span>
              </a>

              {onDirectAppointment && (
                <button
                  onClick={() => {
                    onContinue();
                    onDirectAppointment();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>सीधा अपॉइंटमेंट बुक करें</span>
                </button>
              )}
            </div>

          </div>
        </main>

        {/* Bottom Simple Credit */}
        <footer className="text-center py-3 text-xs text-slate-500">
          माँ जानकी एक्स-रे एवं क्लिनिक · पूजाहां पत्जीरवा चौक
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};
