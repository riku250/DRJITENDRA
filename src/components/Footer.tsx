import React from 'react';
import { 
  Phone, Mail, MapPin, Clock, AlertCircle, 
  Calendar, ShieldCheck, Activity, ArrowRight, Lock
} from 'lucide-react';
import { ClinicSettings } from '../types';

interface FooterProps {
  settings: ClinicSettings | null;
  onNavigate: (page: string) => void;
  onOpenWelcome?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onOpenWelcome }) => {
  const primaryPhone = settings?.primary_phone || '9525719654';
  const secondaryPhone = settings?.secondary_phone || '7492022733';
  const email = settings?.email || 'jitendrakumarbth061999@gmail.com';
  const hours = settings?.opening_hours || 'Everyday 8:00 AM – 7:00 PM';
  const emergency = settings?.emergency_service || '24 Hours Emergency Service';
  const addressLine1 = settings?.address_line1 || 'सृष्टि ज्योति पब्लिक स्कूल के सामने';
  const addressLine2 = settings?.address_line2 || 'मेन रोड';
  const city = settings?.city || 'पूजाहां पत्जीरवा चौक';

  const handleNav = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-clinic-footer" className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      {/* Top Banner Callout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-gradient-to-r from-teal-900/60 via-slate-800 to-cyan-900/60 rounded-2xl p-6 sm:p-8 border border-teal-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-400/30">
              <Activity className="w-3.5 h-3.5" />
              <span>सुलभ एवं विश्वसनीय चिकित्सा परामर्श</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              आज ही Appointment के लिए संपर्क करें
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              हड्डी, जोड़, नस रोग, CTEV एवं फिजियोथेरेपी से जुड़ी किसी भी समस्या के लिए अपना समय पूर्व-निर्धारित करें।
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              id="footer-book-apt-btn"
              onClick={() => handleNav('appointment')}
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg shadow-teal-500/20 active:scale-95 transition-all text-sm cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
            <a
              id="footer-call-now-btn"
              href={`tel:${primaryPhone}`}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-3 rounded-xl border border-slate-700 transition-colors text-sm"
            >
              <Phone className="w-4 h-4 text-teal-400" />
              <span>कॉल करें: {primaryPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Doctor Credentials */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-black text-white tracking-tight">
                  मां जानकी <span className="text-teal-400">एक्स-रे</span>
                </h4>
                <p className="text-xs text-slate-400">हड्डी, जोड़ एवं नस रोग क्लिनिक</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2 text-xs">
              <div 
                onClick={() => handleNav('doctor')}
                className="cursor-pointer group hover:bg-slate-700/40 p-1.5 -m-1.5 rounded-lg transition-colors"
              >
                <div className="font-bold text-white text-sm group-hover:text-teal-300 transition-colors flex items-center justify-between">
                  <span>Dr. Jitendra Kumar</span>
                  <span className="text-[10px] text-teal-400 font-normal">प्रोफाइल देखें →</span>
                </div>
                <div className="text-teal-400 font-medium">BPT (APP), BOTT (Ranchi), CMS & ED (HR)</div>
                <div className="text-slate-400">Reg No: <span className="text-slate-200 font-mono">15504/24</span></div>
                <div className="text-slate-300">विशेषज्ञता: हड्डी, जोड़ एवं नस रोग</div>
              </div>

              <div 
                onClick={() => handleNav('radiographer')}
                className="pt-2 border-t border-slate-700/60 cursor-pointer group hover:bg-slate-700/40 p-1.5 -mx-1.5 rounded-lg transition-colors"
              >
                <div className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>रेडियोग्राफर: Mr. Upendra Kumar</span>
                  <span className="text-[10px] text-cyan-400 font-normal">प्रोफाइल देखें →</span>
                </div>
                <div className="text-slate-400">NIMS University, Jaipur</div>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Quick Links (त्वरित लिंक)
            </h5>
            <ul className="space-y-2 text-sm">
              {[
                { id: 'home', label: 'Home (होम)' },
                { id: 'doctor', label: 'About Doctor (डॉक्टर परिचय)' },
                { id: 'radiographer', label: 'Radiographer (Mr. Upendra Kumar)' },
                { id: 'services', label: 'All Services (उपलब्ध सेवाएं)' },
                { id: 'xray', label: 'X-Ray / Radiography' },
                { id: 'physiotherapy', label: 'Modern Physiotherapy' },
                { id: 'ctev', label: 'CTEV (जन्मजात टेढ़ा पैर)' },
                { id: 'facilities', label: 'Facilities (सुविधाएं)' },
                { id: 'appointment', label: 'Book Appointment (अपॉइंटमेंट)' },
                { id: 'gallery', label: 'Photo Gallery (गैलरी)' },
                { id: 'faq', label: 'FAQs (अक्सर पूछे जाने वाले सवाल)' }
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNav(item.id)}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-teal-400 transition-colors text-left"
                  >
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
              {onOpenWelcome && (
                <li>
                  <button
                    onClick={onOpenWelcome}
                    className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-semibold transition-colors text-left"
                  >
                    <ArrowRight className="w-3 h-3 text-teal-500" />
                    <span>क्लिनिक वेलकम स्क्रीन (Intro Screen)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Contact & Timings */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Contact & Hours (संपर्क व समय)
            </h5>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-snug">
                  {addressLine1},<br />
                  {addressLine2}, {city}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-400 shrink-0" />
                <div className="flex flex-col">
                  <a href={`tel:${primaryPhone}`} className="hover:text-teal-300 font-semibold text-white">
                    {primaryPhone}
                  </a>
                  <a href={`tel:${secondaryPhone}`} className="hover:text-teal-300 text-slate-400 text-xs">
                    {secondaryPhone}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-400 shrink-0" />
                <a href={`mailto:${email}`} className="text-xs hover:text-teal-300 break-all text-slate-300">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3 pt-2">
                <Clock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <div className="font-semibold text-white">{hours}</div>
                  <div className="text-slate-400">प्रतिदिन क्लिनिक खुला है</div>
                </div>
              </li>
              <li className="flex items-center gap-3 bg-red-950/40 p-2.5 rounded-lg border border-red-900/40">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-xs font-bold text-red-300">{emergency}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Verified Details */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              विश्वसनीयता (Trust & Standards)
            </h5>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span>पंजीकृत स्वास्थ्य सेवा (Reg: 15504/24)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span>प्रशिक्षित रेडियोग्राफर (NIMS University)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span>आधुनिक इलेक्ट्रोथेरेपी मशीनें</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span>निरंतर जनरेटर पावर बैकअप</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span>रंगीन व हल्के फाइबर प्लास्टर सुविधा</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                id="footer-open-map-btn"
                onClick={() => handleNav('contact')}
                className="w-full text-xs font-semibold py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>नक्शा देखें एवं दिशा-निर्देश पाएं</span>
              </button>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer Box */}
        <div className="mt-12 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-300">महत्वपूर्ण चिकित्सकीय अस्वीकरण (Medical Disclaimer): </span>
              Website पर दी गई जानकारी सामान्य जानकारी के उद्देश्य से है। किसी भी स्वास्थ्य समस्या के लिए योग्य चिकित्सा पेशेवर से व्यक्तिगत परामर्श लें। Emergency की स्थिति में तुरंत चिकित्सा सहायता प्राप्त करें।
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} मां जानकी एक्स-रे (Maa Janki X-Ray & Orthopedic / Physiotherapy Clinic). सर्वाधिकार सुरक्षित।
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNav('privacy-policy')}
              className="hover:text-slate-300 transition-colors underline"
            >
              Privacy Policy (गोपनीयता नीति)
            </button>
            <span>•</span>
            <button
              onClick={() => handleNav('terms')}
              className="hover:text-slate-300 transition-colors underline"
            >
              Terms & Conditions (नियम व शर्तें)
            </button>
            <span>•</span>
            <button
              id="footer-admin-link"
              onClick={() => handleNav('admin-login')}
              className="inline-flex items-center gap-1 hover:text-teal-400 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
