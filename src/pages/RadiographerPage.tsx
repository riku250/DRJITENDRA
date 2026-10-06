import React from 'react';
import { 
  Scan, Award, FileText, CheckCircle2, Calendar, Phone, 
  MessageSquare, ShieldCheck, ArrowRight, Clock, Zap, UserCheck, Stethoscope
} from 'lucide-react';
import { motion } from 'motion/react';
import { ClinicSettings } from '../types';

interface RadiographerPageProps {
  settings: ClinicSettings | null;
  onNavigate: (page: string, serviceName?: string) => void;
}

export const RadiographerPage: React.FC<RadiographerPageProps> = ({ settings, onNavigate }) => {
  const primaryPhone = settings?.primary_phone || '9525719654';
  const radiographerName = settings?.radiographer_name || 'Mr. Upendra Kumar';
  const institution = settings?.radiographer_institution || 'NIMS University, Jaipur';
  const radiographerImageUrl = settings?.radiographer_image_url || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80';
  const consultationFee = settings?.consultation_fee || 100;

  const xrayWhatsappUrl = `https://wa.me/91${primaryPhone}?text=${encodeURIComponent(`नमस्ते, मुझे माँ जानकी एक्स-रे में श्री उपेंद्र कुमार (रेडियोग्राफर) से एक्स-रे जांच व परामर्श के बारे में जानकारी चाहिए।`)}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-teal-700 cursor-pointer">Home</button>
        <span>/</span>
        <button onClick={() => onNavigate('xray')} className="hover:text-teal-700 cursor-pointer">X-Ray Department</button>
        <span>/</span>
        <span className="text-slate-800 font-bold">Mr. Upendra Kumar (Radiographer Profile)</span>
      </div>

      {/* Main Profile Hero Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl p-6 sm:p-12 shadow-xl border border-slate-200/90 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-50/70 rounded-bl-full -z-0 pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Radiographer Portrait */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
              <img
                src={radiographerImageUrl}
                alt={radiographerName}
                className="w-full h-96 object-cover object-top transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent p-6 text-white">
                <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider bg-cyan-950/60 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  मुख्य रेडियोग्राफर • Chief Radiographer
                </span>
                <h3 className="text-2xl font-black">{radiographerName}</h3>
                <p className="text-xs text-cyan-200 mt-1 font-medium">{institution}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              <span>प्रमाणित एवं सुरक्षा-मानकों के अनुरूप एक्स-रे जांच</span>
            </div>
          </div>

          {/* Details & Credentials */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-900 border border-cyan-200">
                  <Scan className="w-3.5 h-3.5" />
                  <span>Radiography & Diagnostic Imaging</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                  <Zap className="w-3 h-3" />
                  <span>24hr जनरेटर बैकअप सुविधा</span>
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {radiographerName}
              </h1>
              <p className="text-lg font-bold text-cyan-800">
                रेडियोग्राफर एवं एक्स-रे इमेजिंग स्पेशलिस्ट (Radiographer)
              </p>
            </div>

            {/* Academic Credentials Box */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                शैक्षणिक योग्यता एवं प्रशिक्षण (Qualifications & Institute)
              </h4>
              <ul className="space-y-2 text-sm text-slate-800">
                <li className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span className="font-bold text-slate-900">Radiography Professional Qualification</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span className="font-semibold text-slate-700">विश्वविद्यालय: <strong className="text-slate-900">{institution}</strong></span>
                </li>
                <li className="flex items-center gap-2.5 pt-1 border-t border-slate-200 text-slate-700 text-xs">
                  <UserCheck className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>रेडिएशन सुरक्षा, सटीक पोजिशनिंग और मैनुअल एक्स-रे तकनीक में विशेषज्ञता</span>
                </li>
              </ul>
            </div>

            {/* Department Services */}
            <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
              <h4 className="font-bold text-slate-900">विशेषज्ञता एवं उपलब्ध एक्स-रे सेवाएं:</h4>
              <p>
                माँ जानकी क्लिनिक में श्री उपेंद्र कुमार द्वारा सभी प्रकार के सामान्य, मैनुअल व ऑर्थोपेडिक एक्स-रे अत्यंत सावधानी व स्पष्टता से किए जाते हैं। न्यूनतम रेडिएशन और तुरंत रिपोर्टिंग के साथ मरीजों को सटीक परिणाम मिलते हैं:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                <div className="flex items-center gap-2 text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>हड्डी एवं जोड़ (Bone & Joints) एक्स-रे</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>छाती (Chest PA/AP View) एक्स-रे</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>रीढ़ की हड्डी (Spine & Cervical) एक्स-रे</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>हाथ, पैर, घुटना, टखना व कूल्हे की जांच</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>बच्चों व CTEV (टेढ़े पैर) की एक्स-रे जांच</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>आपातकालीन फ्रैक्चर जांच (24hr इमरजेंसी)</span>
                </div>
              </div>
            </div>

            {/* Operating Hours & Generator Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-cyan-50/80 border border-cyan-200 text-xs text-cyan-950">
                <Clock className="w-4 h-4 text-cyan-700 shrink-0" />
                <div>
                  <span className="font-bold block">जांच समय:</span>
                  <span>प्रतिदिन 8:00 AM – 7:00 PM</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950">
                <Zap className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <span className="font-bold block">बिजली की निरंतर सुविधा:</span>
                  <span>पावर कट होने पर भी जनरेटर बैकअप चालू</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="xray-book-appointment-btn"
                onClick={() => onNavigate('appointment', 'मैनुअल एक्स-रे')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-800 hover:to-teal-800 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-cyan-700/20 active:scale-98 transition-all text-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>एक्स-रे अपॉइंटमेंट बुक करें (परामर्श शुल्क ₹{consultationFee})</span>
              </button>

              <a
                href={xrayWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3.5 rounded-xl text-sm transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp पर पर्ची भेजें</span>
              </a>

              <a
                href={`tel:${primaryPhone}`}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-3.5 rounded-xl text-sm transition-colors"
              >
                <Phone className="w-4 h-4 text-cyan-700" />
                <span>Call: {primaryPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cross-Link Card to Doctor Jitendra Kumar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg"
      >
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-400/30">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>क्लिनिक चिकित्सक (Consultant Doctor)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Dr. Jitendra Kumar (BPT, BOTT, CMS & ED)
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            हड्डी, जोड़ एवं नस रोग विशेषज्ञ • एक्स-रे रिपोर्ट के बाद व्यक्तिगत परामर्श एवं फिजियोथेरेपी उपचार।
          </p>
        </div>

        <button
          onClick={() => onNavigate('doctor')}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm shadow-md transition-all cursor-pointer"
        >
          <span>डॉक्टर की प्रोफाइल देखें</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
};
