import React from 'react';
import { 
  User, Award, FileText, CheckCircle2, Calendar, Phone, 
  MessageSquare, ShieldCheck, Bone, ArrowRight, Clock, AlertCircle, Scan, Stethoscope, Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { ClinicSettings } from '../types';

interface DoctorPageProps {
  settings: ClinicSettings | null;
  onNavigate: (page: string) => void;
}

export const DoctorPage: React.FC<DoctorPageProps> = ({ settings, onNavigate }) => {
  const primaryPhone = settings?.primary_phone || '9525719654';
  const doctorWhatsappUrl = `https://wa.me/91${primaryPhone}?text=${encodeURIComponent('नमस्ते, मुझे Dr. Jitendra Kumar से appointment के बारे में जानकारी चाहिए।')}`;
  const consultationFee = settings?.consultation_fee || 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-teal-700">Home</button>
        <span>/</span>
        <span className="text-slate-800 font-bold">Doctor Profile (Dr. Jitendra Kumar)</span>
      </div>

      {/* Profile Hero Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl p-6 sm:p-12 shadow-xl border border-slate-200/90 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50/70 rounded-bl-full -z-0 pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Doctor Portrait / Visual */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
              <img
                src={settings?.doctor_image_url || 'https://kommodo.ai/i/FO7CYWP05Q4WRXPrY0yg'}
                alt={settings?.doctor_name || 'Dr. Jitendra Kumar'}
                className="w-full h-96 object-cover object-top transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent p-6 text-white">
                <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider inline-flex items-center gap-1 bg-teal-950/70 px-2.5 py-0.5 rounded-full mb-1">
                  <Stethoscope className="w-3 h-3" />
                  हड्डी, जोड़ एवं नस रोग विशेषज्ञ
                </span>
                <h3 className="text-2xl font-black">{settings?.doctor_name || 'Dr. Jitendra Kumar'}</h3>
                <p className="text-xs text-slate-300 mt-0.5 font-mono">Reg No: 15504/24</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-600 font-medium">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>सत्यापित चिकित्सीय पंजीकरण (Verified Registration)</span>
            </div>
          </div>

          {/* Details & Credentials */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                  <Bone className="w-3.5 h-3.5" />
                  <span>चिकित्सक परिचय • Consultant Specialist</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 shadow-xs">
                  <span>परामर्श शुल्क: ₹{consultationFee}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>OPD Open Today</span>
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {settings?.doctor_name || 'Dr. Jitendra Kumar'}
              </h1>
              <p className="text-lg font-bold text-teal-700">
                हड्डी, जोड़ एवं नस रोग (Bone, Joint & Nerve Care)
              </p>
            </div>

            {/* Factual Qualifications Box */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3 shadow-xs">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                शैक्षणिक योग्यता (Credentials)
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-800">
                <li className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-bold">BPT (APP)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-bold">BOTT (Ranchi)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-bold">CMS & ED (HR)</span>
                </li>
                <li className="flex items-center gap-2 pt-1.5 border-t border-slate-200 text-slate-700">
                  <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>रजिस्ट्रेशन संख्या (Registration No): <strong className="font-mono text-slate-900">15504/24</strong></span>
                </li>
              </ul>
            </div>

            {/* Consultation focus */}
            <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
              <h4 className="font-bold text-slate-900">मुख्य परामर्श क्षेत्र:</h4>
              <p>
                हड्डी एवं जोड़ों का दर्द, पुराने गठिया (Arthritis), घुटने व रीढ़ की हड्डी की समस्याएं, सायटिका (Sciatica), नसों का खिंचाव एवं सुन्नपन, मोच, फ्रैक्चर के बाद पुनर्वास तथा नवजात शिशुओं में जन्मजात टेढ़े पैर (CTEV / Clubfoot) का सुधारात्मक मार्गदर्शन।
              </p>
            </div>

            {/* Consultation Hours & Fee Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-teal-50/70 border border-teal-200 text-xs sm:text-sm text-teal-950">
                <Clock className="w-5 h-5 text-teal-700 shrink-0" />
                <div>
                  <span className="font-bold">परामर्श समय: </span>
                  <div>प्रतिदिन 8:00 AM – 7:00 PM</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm text-amber-950">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold">परामर्श शुल्क (Fee): </span>
                  <div className="text-base font-extrabold text-amber-900">मात्र ₹{consultationFee}</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="doctor-appointment-cta-btn"
                onClick={() => onNavigate('appointment')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-teal-600/20 active:scale-98 transition-all text-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>डॉक्टर से अपॉइंटमेंट लें (₹{consultationFee})</span>
              </button>

              <a
                href={doctorWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3.5 rounded-xl text-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp पर जानकारी लें</span>
              </a>

              <a
                href={`tel:${primaryPhone}`}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-3.5 rounded-xl text-sm transition-colors"
              >
                <Phone className="w-4 h-4 text-teal-600" />
                <span>Call: {primaryPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cross-Link Card to Radiographer Mr. Upendra Kumar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-gradient-to-r from-cyan-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg"
      >
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
            <Scan className="w-3.5 h-3.5" />
            <span>रेडियोग्राफर (X-Ray Radiographer)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            {settings?.radiographer_name || 'Mr. Upendra Kumar'} ({settings?.radiographer_institution || 'NIMS University, Jaipur'})
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            क्लिनिक में उच्च गुणवत्ता मैनुअल एक्स-रे जांच, 24 घंटे जनरेटर बैकअप एवं त्वरित रिपोर्टिंग के साथ उपलब्ध।
          </p>
        </div>

        <button
          onClick={() => onNavigate('radiographer')}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm shadow-md transition-all cursor-pointer"
        >
          <span>मि. उपेंद्र कुमार की प्रोफाइल देखें</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
};
