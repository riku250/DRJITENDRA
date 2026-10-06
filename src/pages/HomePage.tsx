import React, { useState } from 'react';
import { 
  Calendar, Phone, MessageSquare, Clock, AlertCircle, 
  MapPin, ShieldCheck, CheckCircle2, ChevronRight, Activity, 
  Scan, Bone, Footprints, HeartPulse, Zap, Bandage, UserCheck, 
  Sparkles, ArrowRight, Ambulance, Stethoscope, Award, Users, Pill, Building2,
  Image as ImageIcon, ZoomIn, X
} from 'lucide-react';
import { motion } from 'motion/react';
import { ClinicSettings, ServiceItem, FacilityItem, GalleryItem } from '../types';
import { AppointmentFormSection } from '../components/AppointmentFormSection';

const DEFAULT_HOME_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    title: "मैनुअल एक्स-रे डायग्नोस्टिक सेटअप",
    category: "X-Ray",
    image_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
    description: "रेडियोग्राफर श्री उपेंद्र कुमार द्वारा संचालित आधुनिक एक्स-रे जांच कक्ष",
    active: true
  },
  {
    id: "gal-2",
    title: "डॉ. जितेंद्र कुमार परामर्श कक्ष",
    category: "Doctor",
    image_url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    description: "मरीजों के साथ सौम्य एवं व्यक्तिगत परामर्श",
    active: true
  },
  {
    id: "gal-3",
    title: "आधुनिक फिजियोथेरेपी उपकरण",
    category: "Physiotherapy",
    image_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    description: "इलेक्ट्रोथेरेपी, IFT एवं रीहैब एक्सरसाइज उपकरण",
    active: true
  },
  {
    id: "gal-4",
    title: "क्लिनिक रिसेप्शन एवं वेटिंग एरिया",
    category: "Clinic",
    image_url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80",
    description: "साफ-सुथरा एवं व्यवस्थित प्रतीक्षालय",
    active: true
  },
  {
    id: "gal-5",
    title: "रंगीन एवं हल्के प्लास्टर की सुविधा",
    category: "Facilities",
    image_url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    description: "वाटर-रेसिस्टेंट एवं आरामदायक कास्टिंग",
    active: true
  },
  {
    id: "gal-6",
    title: "निरंतर जनरेटर पावर बैकअप",
    category: "Facilities",
    image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    description: "आपातकालीन स्थिति एवं मशीनों के लिए निरंतर विद्युत आपूर्ति",
    active: true
  }
];

interface HomePageProps {
  settings: ClinicSettings | null;
  services: ServiceItem[];
  facilities: FacilityItem[];
  gallery?: GalleryItem[];
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  services,
  facilities,
  gallery = [],
  onNavigate
}) => {
  const [activeGalleryCategory, setActiveGalleryCategory] = useState<string>('all');
  const [previewImage, setPreviewImage] = useState<GalleryItem | null>(null);

  const displayGallery = (gallery && gallery.length > 0) ? gallery : DEFAULT_HOME_GALLERY;
  const filteredGallery = activeGalleryCategory === 'all'
    ? displayGallery
    : displayGallery.filter(item => item.category?.toLowerCase() === activeGalleryCategory.toLowerCase());
  const primaryPhone = settings?.primary_phone || '9525719654';
  const secondaryPhone = settings?.secondary_phone || '7492022733';
  const whatsappUrl = `https://wa.me/91${primaryPhone}?text=${encodeURIComponent('नमस्ते, मुझे मां जानकी एक्स-रे में appointment लेना है।')}`;
  const doctorWhatsappUrl = `https://wa.me/91${primaryPhone}?text=${encodeURIComponent('नमस्ते, मुझे Dr. Jitendra Kumar से appointment के बारे में जानकारी चाहिए।')}`;
  const consultationFee = settings?.consultation_fee || 100;

  const handleNav = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* ================================================= */}
      {/* 1. HERO SECTION                                  */}
      {/* ================================================= */}
      <section id="hero-section" className="relative overflow-hidden pt-6 pb-16 lg:py-16 bg-gradient-to-b from-teal-50/70 via-slate-50 to-white">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-teal-200/30 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-200/20 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (7 Cols) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Timing & Doctor OPD Pill */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-teal-100/90 text-teal-900 border border-teal-200 shadow-xs">
                  <Clock className="w-4 h-4 text-teal-700 animate-spin-slow" />
                  <span>Everyday: 8:00 AM – 7:00 PM</span>
                  <span className="text-teal-400">•</span>
                  <span className="text-red-700 font-extrabold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> 24hr Emergency
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-amber-100 text-amber-950 border border-amber-300 shadow-xs">
                  <span>परामर्श शुल्क: ₹{consultationFee}</span>
                </div>
              </div>

              {/* Main Heading with Grand Hospital Vibe */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                विश्वसनीय स्वास्थ्य सेवा,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-cyan-700 to-teal-800">
                  हड्डी, जोड़, नस एवं एक्स-रे केंद्र
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                मां जानकी एक्स-रे एवं क्लिनिक में डॉ. जितेंद्र कुमार के मार्गदर्शन में आधुनिक मैनुअल एक्स-रे, फिजियोथेरेपी व संपूर्ण ऑर्थोपेडिक उपचार की उत्कृष्ट व्यवस्था।
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  id="hero-book-appointment-button"
                  onClick={() => handleNav('appointment')}
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-teal-600/25 active:scale-98 transition-all text-sm sm:text-base cursor-pointer"
                >
                  <Calendar className="w-5 h-5" />
                  <span>📅 Appointment Book करें (₹{consultationFee})</span>
                </button>

                <button
                  id="hero-xray-button"
                  onClick={() => handleNav('xray')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-extrabold px-5 py-3.5 rounded-xl shadow-md shadow-cyan-600/20 active:scale-98 transition-all text-sm sm:text-base cursor-pointer border border-cyan-400/50"
                >
                  <Activity className="w-5 h-5 text-white" />
                  <span>🩻 एक्स-रे यूनिट (X-Ray)</span>
                </button>

                <a
                  id="hero-call-now-button"
                  href={`tel:${primaryPhone}`}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold px-5 py-3.5 rounded-xl border border-slate-300 shadow-xs hover:border-teal-400 transition-all text-sm sm:text-base active:scale-98"
                >
                  <Phone className="w-4 h-4 text-teal-600" />
                  <span>📞 Call Now</span>
                </a>

                <a
                  id="hero-whatsapp-button"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all text-sm sm:text-base active:scale-98"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>💬 WhatsApp करें</span>
                </a>
              </div>

              {/* Trust Cards Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                {[
                  { text: 'Doctor Consultation', sub: settings?.doctor_name || 'Dr. Jitendra Kumar' },
                  { text: 'Manual X-Ray', sub: settings?.radiographer_name || 'Mr. Upendra Kumar' },
                  { text: 'Laser Physiotherapy', sub: 'उन्नत मशीनें' },
                  { text: 'Emergency Service', sub: '24 घंटे सहायता' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs text-left space-y-0.5 hover:border-teal-300 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{item.text}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pl-5">{item.sub}</div>
                  </div>
                ))}
              </div>

              {/* Live Status Pulse */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-teal-500/10 border border-teal-200/80 text-xs font-bold text-teal-900 shadow-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
                </span>
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Live OPD & X-Ray Queue Active • Real-time Doctor Consultation Open</span>
              </div>
            </motion.div>

            {/* Right Card / Doctor & Radiographer Highlight (5 Cols) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 space-y-4"
            >
              {/* Doctor Card with Medical Stethoscope animation */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/90 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-36 h-36 bg-teal-50 rounded-bl-full -z-0"></div>
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-18 h-18 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-teal-600 bg-slate-100 group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src={settings?.doctor_image_url || 'https://kommodo.ai/i/FO7CYWP05Q4WRXPrY0yg'} 
                        alt={settings?.doctor_name || 'Dr. Jitendra Kumar'} 
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] uppercase tracking-wider font-extrabold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 inline-flex items-center gap-1">
                          <Stethoscope className="w-3 h-3" />
                          Consultant Doctor
                        </span>
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          फीस: ₹{consultationFee}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                        {settings?.doctor_name || 'Dr. Jitendra Kumar'}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 font-mono">
                        Reg No: 15504/24
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Qualifications:</span>
                      <span className="font-bold text-slate-800 text-right">BPT (APP), BOTT (Ranchi), CMS & ED (HR)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Specialization:</span>
                      <span className="font-bold text-teal-700">हड्डी, जोड़ एवं नस रोग</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => handleNav('doctor')}
                      className="flex-1 text-xs font-bold py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-center transition-colors cursor-pointer"
                    >
                      डॉक्टर प्रोफाइल देखें
                    </button>
                    <a
                      href={doctorWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-center transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>परामर्श पूछताछ</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Radiographer Spotlight */}
              <div 
                onClick={() => handleNav('radiographer')}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-md border border-cyan-200/90 hover:border-cyan-400 hover:shadow-lg transition-all flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold border border-cyan-300 shrink-0">
                    {settings?.radiographer_image_url ? (
                      <img 
                        src={settings.radiographer_image_url} 
                        alt={settings.radiographer_name || 'Mr. Upendra Kumar'} 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Scan className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-800">
                      Radiographer (एक्स-रे विशेषज्ञ)
                    </span>
                    <h4 className="text-base font-black text-slate-900 group-hover:text-cyan-800 transition-colors">
                      {settings?.radiographer_name || 'Mr. Upendra Kumar'}
                    </h4>
                    <p className="text-xs text-slate-500">{settings?.radiographer_institution || 'NIMS University, Jaipur'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNav('radiographer');
                  }}
                  className="shrink-0 p-2.5 rounded-xl bg-cyan-50 group-hover:bg-cyan-600 text-cyan-700 group-hover:text-white transition-all shadow-xs cursor-pointer"
                  title="मि. उपेंद्र कुमार की प्रोफाइल देखें"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 1.5 GRAND MEDICAL INSTITUTION HIGHLIGHTS          */}
      {/* ================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-5 border border-teal-200/90 shadow-md flex items-center gap-3.5"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">10,000+</div>
              <div className="text-xs font-bold text-teal-800">स्वस्थ मरीज</div>
              <div className="text-[11px] text-slate-500">संतुष्ट परामर्श</div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-5 border border-cyan-200/90 shadow-md flex items-center gap-3.5"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
              <Scan className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">100%</div>
              <div className="text-xs font-bold text-cyan-800">सटीक मैनुअल एक्स-रे</div>
              <div className="text-[11px] text-slate-500">त्वरित रिपोर्टिंग</div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-md flex items-center gap-3.5"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">₹{consultationFee}</div>
              <div className="text-xs font-bold text-amber-800">न्यूनतम शुल्क</div>
              <div className="text-[11px] text-slate-500">पारदर्शी सेवा</div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-5 border border-red-200/90 shadow-md flex items-center gap-3.5"
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Ambulance className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">24 Hours</div>
              <div className="text-xs font-bold text-red-800">आपातकालीन सेवा</div>
              <div className="text-[11px] text-slate-500">ट्रॉमा व फ्रैक्चर सहायता</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 2. QUICK INFORMATION BAR (4 Cards)               */}
      {/* ================================================= */}
      <section id="quick-info-bar" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Timing Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Timing</span>
              <h4 className="text-lg font-black text-slate-900">8:00 AM – 7:00 PM</h4>
              <p className="text-xs font-medium text-slate-500">Everyday (प्रतिदिन)</p>
            </div>
          </div>

          {/* Emergency Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200 bg-gradient-to-br from-white to-red-50/40 hover:shadow-md transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Ambulance className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Emergency</span>
              <h4 className="text-lg font-black text-red-950">24 Hours</h4>
              <p className="text-xs font-medium text-red-700">Emergency Service</p>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Location</span>
              <h4 className="text-base font-black text-slate-900 leading-tight">Poojahan Patjirva</h4>
              <p className="text-xs text-slate-500">Main Road, Opp. School</p>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Contact</span>
              <a href={`tel:${primaryPhone}`} className="block text-base font-black text-slate-900 hover:text-teal-700">
                {primaryPhone}
              </a>
              <a href={`tel:${secondaryPhone}`} className="block text-xs text-slate-500 hover:text-teal-700">
                {secondaryPhone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 3. ABOUT CLINIC SECTION                          */}
      {/* ================================================= */}
      <section id="about-clinic-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                <Activity className="w-3.5 h-3.5" />
                <span>क्लिनिक परिचय</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                मां जानकी एक्स-रे के बारे में
              </h2>

              <p className="text-base text-slate-700 leading-relaxed">
                <strong>मां जानकी एक्स-रे</strong> एक समर्पित स्वास्थ्य सेवा केंद्र है जो एक्स-रे (Radiography) तथा हड्डी, जोड़, नस एवं फिजियोथेरेपी से संबंधित संपूर्ण परामर्श व आधुनिक सुविधाएं प्रदान करता है।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-500 font-medium">Clinic Name:</span>
                  <div className="text-sm font-bold text-slate-900">मां जानकी एक्स-रे</div>
                  <div className="text-xs text-teal-700">Maa Janki X-Ray</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-500 font-medium">Location:</span>
                  <div className="text-xs font-bold text-slate-900">सृष्टि ज्योति स्कूल के सामने</div>
                  <div className="text-xs text-slate-600">मेन रोड, पूजाहां पत्जीरवा चौक</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-500 font-medium">Opening Hours:</span>
                  <div className="text-xs font-bold text-slate-900">Everyday: 8:00 AM – 7:00 PM</div>
                  <div className="text-xs text-slate-600">सातों दिन उपलब्ध</div>
                </div>

                <div className="p-4 rounded-xl bg-red-50/60 border border-red-200 space-y-1">
                  <span className="text-xs text-red-600 font-medium">Emergency Availability:</span>
                  <div className="text-xs font-bold text-red-900">24 Hours Emergency Service</div>
                  <div className="text-xs text-red-700">आपातकालीन हेल्पलाइन सेवा</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  onClick={() => handleNav('about')}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                >
                  <span>विस्तृत जानकारी पढ़ें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleNav('contact')}
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>Get Directions (रास्ता देखें)</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
                  alt="Maa Janki X-Ray Clinic Setup"
                  className="w-full h-64 object-cover"
                />
              </div>

              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                  <span>स्वच्छ, सुरक्षित एवं आधुनिक वातावरण</span>
                </div>
                <p className="text-slate-600">
                  मरीजों के आराम, स्वच्छता और निर्बाध जनरेटर बैकअप के साथ त्वरित एक्स-रे व फिजियोथेरेपी सेवा।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 4. CTEV (जन्मजात टेढ़ा पैर) DEDICATED SECTION      */}
      {/* ================================================= */}
      <section id="ctev-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-cyan-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                <Footprints className="w-4 h-4" />
                <span>विशेष बाल ऑर्थोपेडिक परामर्श</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                जन्मजात टेढ़ा पैर (CTEV / Clubfoot)
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                <strong>CTEV (Congenital Talipes Equinovarus)</strong> नवजात शिशुओं में जन्म के समय पैरों का अंदर की ओर मुड़े रहने की एक सामान्य विकृति है। समय पर सही परीक्षण और पोन्सेटी विधि अनुसार क्रमबद्ध कास्टिंग (Plaster) द्वारा शिशु के पैर पूर्णतः सामान्य और सीधे हो सकते हैं।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/10 space-y-1">
                  <div className="font-bold text-teal-300">शुरुआती पहचान</div>
                  <div className="text-slate-300">जन्म के तुरंत बाद शिशु के पैर अंदर मुड़े दिखें तो तुरंत परीक्षण कराएं।</div>
                </div>

                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/10 space-y-1">
                  <div className="font-bold text-teal-300">पोन्सेटी तकनीक</div>
                  <div className="text-slate-300">हल्के व व्यवस्थित प्लास्टर द्वारा पैरों को क्रमशः सीधा किया जाता है।</div>
                </div>

                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/10 space-y-1">
                  <div className="font-bold text-teal-300">नियमित फॉलो-अप</div>
                  <div className="text-slate-300">विशेष बूट्स एवं नियमित जांच द्वारा सुधार को स्थाई बनाया जाता है।</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleNav('ctev')}
                  className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-all active:scale-95 cursor-pointer shadow-lg"
                >
                  CTEV के बारे में पूरा पढ़ें
                </button>

                <button
                  onClick={() => handleNav('appointment')}
                  className="bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-3 rounded-xl text-sm border border-white/20 transition-colors cursor-pointer"
                >
                  Appointment के लिए संपर्क करें
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/5 p-6 rounded-2xl border border-white/10 text-xs space-y-3">
              <h4 className="font-bold text-teal-300 text-sm">माता-पिता के लिए सलाह:</h4>
              <p className="text-slate-300 leading-relaxed">
                शिशु के जन्म के तुरंत बाद या शुरुआती हफ्तों में डॉक्टर से परामर्श लेना सबसे अधिक प्रभावशाली सिद्ध होता है क्योंकि उस समय हड्डियां और स्नायु लचीले होते हैं।
              </p>
              <div className="pt-2 border-t border-white/10 text-slate-400">
                क्लिनिक हेल्पलाइन: <span className="text-white font-bold">{primaryPhone}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 5. SERVICES & TREATMENTS (10 Cards Grid)          */}
      {/* ================================================= */}
      <section id="services-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>उपचार एवं सुविधाएं</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            क्लिनिक में उपलब्ध प्रमुख सेवाएं (Services)
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            मां जानकी एक्स-रे में आधुनिक नैदानिक एवं चिकित्सीय सुविधाएं एक ही छत के नीचे उपलब्ध हैं।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all flex flex-col justify-between group"
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
                  <span className="text-xs font-mono font-bold text-slate-400">0{idx + 1}</span>
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
                  <ul className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    {srv.features.slice(0, 3).map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium italic">Price: संपर्क करें</span>
                <button
                  onClick={() => handleNav('appointment')}
                  className="text-teal-700 font-bold hover:text-teal-900 inline-flex items-center gap-1"
                >
                  <span>Book Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================= */}
      {/* 6. MODERN PHYSIOTHERAPY SECTION                  */}
      {/* ================================================= */}
      <section id="physiotherapy-spotlight" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Modern Physiotherapy</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              आधुनिक मशीनों द्वारा फिजियोथेरेपी की सुविधा
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              क्लिनिक में दर्द निवारण एवं रीहैबिलिटेशन हेतु आधुनिक इलेक्ट्रोथेरेपी उपकरण उपलब्ध हैं। उपचार मरीज के व्यक्तिगत चिकित्सकीय परीक्षण (Individual Assessment) के आधार पर किया जाता है।
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: 'Joint Pain', hi: 'जोड़ों का दर्द', desc: 'घुटने, कूल्हे व कंधे का पुराना दर्द' },
              { title: 'Back Pain', hi: 'कमर का दर्द', desc: 'स्लिप डिस्क, लम्बर स्पॉन्डिलाइटिस' },
              { title: 'Neck Pain', hi: 'गर्दन का दर्द', desc: 'सर्वाइकल स्पॉन्डिलाइटिस व अकड़न' },
              { title: 'Muscle Pain', hi: 'मांसपेशियों का दर्द', desc: 'खिंचाव, मोच एवं मांसपेशियों की कमजोरी' },
              { title: 'Mobility Problems', hi: 'चलने-फिरने में कठिनाई', desc: 'सर्जरी के बाद रीहैबिलिटेशन' }
            ].map((card, cidx) => (
              <div key={cidx} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2 hover:border-teal-400 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                  0{cidx + 1}
                </div>
                <h4 className="font-black text-slate-900 text-sm">{card.title}</h4>
                <div className="text-xs font-semibold text-teal-700">{card.hi}</div>
                <p className="text-[11px] text-slate-500 leading-snug">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>सूचना:</strong> फिजियोथेरेपी उपचार की अवधि एवं विधि प्रत्येक मरीज की व्यक्तिगत स्थिति व डॉक्टर की सलाह पर निर्भर करती है।
            </span>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 7. X-RAY / RADIOGRAPHY SECTION                   */}
      {/* ================================================= */}
      <section id="xray-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-900">
                <Scan className="w-3.5 h-3.5" />
                <span>X-Ray / Radiography</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                आधुनिक मैनुअल एक्स-रे जांच सुविधा
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                हड्डी, जोड़, रीढ़ एवं छाती की सटीक व स्पष्ट मैनुअल एक्स-रे जांच हमारे प्रशिक्षित रेडियोग्राफर द्वारा पूर्ण सुरक्षा मानकों के साथ की जाती है।
              </p>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  <span>X-Ray Facility: स्पष्ट एवं उच्च गुणवत्ता मैनुअल इमेजिंग</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  <span>Professional Radiographer: श्री उपेंद्र कुमार (NIMS University, Jaipur)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  <span>Modern Diagnostic Setup: त्वरित रिपोर्टिंग एवं रेडिएशन सुरक्षा प्रोटोकॉल</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`tel:${primaryPhone}`}
                  className="inline-flex items-center gap-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>X-Ray के लिए संपर्क करें ({primaryPhone})</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-cyan-50/90 to-teal-50/50 p-6 rounded-3xl border border-cyan-200 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-cyan-600 text-white flex items-center justify-center font-bold border-2 border-cyan-300 shadow-sm shrink-0">
                  {settings?.radiographer_image_url ? (
                    <img 
                      src={settings.radiographer_image_url} 
                      alt={settings.radiographer_name || 'Mr. Upendra Kumar'} 
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <Scan className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <div className="text-[11px] uppercase font-black tracking-wider text-cyan-800 bg-cyan-100/80 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    Radiographer • एक्स-रे विशेषज्ञ
                  </div>
                  <div className="text-xl font-black text-slate-900">{settings?.radiographer_name || 'Mr. Upendra Kumar'}</div>
                  <div className="text-xs text-slate-600 font-semibold">{settings?.radiographer_institution || 'NIMS University, Jaipur'}</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                क्लिनिक में आने वाले मरीजों को आधुनिक तकनीक द्वारा बिना किसी देरी के स्पष्ट एवं सुरक्षित एक्स-रे जांच उपलब्ध कराई जाती है। जनरेटर बैकअप के कारण जांच प्रक्रिया में बिजली बाधित नहीं होती।
              </p>
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleNav('radiographer')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <span>मि. उपेंद्र कुमार प्रोफाइल देखें</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('xray')}
                  className="text-xs font-bold text-cyan-800 hover:underline cursor-pointer"
                >
                  X-Ray सेवाएं
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 8. FACILITIES SECTION (8 Cards)                  */}
      {/* ================================================= */}
      <section id="facilities-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
            <Zap className="w-3.5 h-3.5" />
            <span>क्लिनिक की सुविधाएं</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Facilities at Maa Janki Clinic
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            मरीजों की सुविधा एवं सुरक्षा के लिए उपलब्ध 8 प्रमुख सुविधाएं
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                {fac.icon === 'Ambulance' && <Ambulance className="w-6 h-6" />}
                {fac.icon === 'Scan' && <Scan className="w-6 h-6" />}
                {fac.icon === 'Bone' && <Bone className="w-6 h-6" />}
                {fac.icon === 'Footprints' && <Footprints className="w-6 h-6" />}
                {fac.icon === 'Activity' && <Activity className="w-6 h-6" />}
                {fac.icon === 'Bandage' && <Bandage className="w-6 h-6" />}
                {fac.icon === 'Zap' && <Zap className="w-6 h-6" />}
                {fac.icon === 'CalendarCheck' && <Calendar className="w-6 h-6" />}
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">{fac.title}</h4>
                {fac.highlight && (
                  <span className="inline-block mt-0.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    {fac.highlight}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {fac.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================= */}
      {/* 9. TRUST SECTION: "क्यों चुनें मां जानकी एक्स-रे?" */}
      {/* ================================================= */}
      <section id="trust-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-800 to-cyan-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-teal-200 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>विश्वसनीयता के आधार</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              क्यों चुनें मां जानकी एक्स-रे?
            </h2>
            <p className="text-xs sm:text-sm text-teal-100">
              तथ्यात्मक सुविधाएं जो क्लिनिक को मरीजों के लिए सुलभ व भरोसेमंद बनाती हैं:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'X-Ray / Radiography facility', desc: 'उच्च गुणवत्ता वाली मैनुुअल जांच सुविधा' },
              { title: 'Physiotherapy facility', desc: 'आधुनिक मशीनों द्वारा दर्द निवारण' },
              { title: 'CTEV treatment', desc: 'बच्चों के मुड़े पैर का पोन्सेटी उपचार' },
              { title: '24-hour emergency service', desc: 'आपातकालीन समय में निरंतर सहायता' },
              { title: 'Color & lightweight plaster', desc: 'हल्का, मजबूत एवं आरामदायक कास्ट' },
              { title: 'Generator backup', desc: 'बिना रुकावट जांच व उपचार की निरंतरता' },
              { title: 'Convenient location', desc: 'मेन रोड, पूजाहां पत्जीरवा चौक पर सुलभ' },
              { title: 'Appointment facility', desc: 'वेबसाइट, फोन व व्हाट्सएप द्वारा सरल बुकिंग' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-1 backdrop-blur-xs">
                <div className="flex items-center gap-2 font-bold text-teal-200 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>{item.title}</span>
                </div>
                <div className="text-xs text-slate-300 pl-6">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 10. PATIENT TESTIMONIALS & REVIEWS               */}
      {/* ================================================= */}
      <section id="reviews-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
            <Award className="w-3.5 h-3.5" />
            <span>मरीजों का विश्वास</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            मरीजों के अनुभव एवं समीक्षाएँ
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            डॉ. जितेंद्र कुमार और श्री उपेंद्र कुमार के सानिध्य में उपचार करा चुके मरीजों के वास्तविक अनुभव:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'रमेश कुमार',
              location: 'पूजाहां, मोतिहारी',
              condition: 'कमर व घुटना दर्द (Physiotherapy)',
              text: 'कमर और घुटने के दर्द से सालों से परेशान था। डॉ. जितेंद्र कुमार सर के परामर्श और यहाँ की फिजियोथेरेपी मशीनों से मुझे बहुत आराम मिला। क्लिनिक बहुत साफ-सुथरा है।',
              rating: 5,
              date: 'हाल ही में'
            },
            {
              name: 'सुनीता देवी',
              location: 'पत्जीरवा',
              condition: 'हाथ का फ्रैक्चर (X-Ray)',
              text: 'हाथ में चोट लगने पर तुरंत मैनुअल एक्स-रे कराया गया। श्री उपेंद्र कुमार जी ने बहुत सावधानी से एक्स-रे किया और डॉक्टर साहब ने सही इलाज किया। बहुत ही अच्छी व्यवस्था है।',
              rating: 5,
              date: '1 सप्ताह पूर्व'
            },
            {
              name: 'अमित सिंह',
              location: 'बेतिया रोड',
              condition: 'CTEV (क्लबफुट) उपचार',
              text: 'हमारे बच्चे के जन्मजात टेढ़े पैर (CTEV) का इलाज यहाँ चल रहा है। पोन्सेटी तकनीक से प्लास्टर और सही मार्गदर्शन मिल रहा है। बहुत संतोषजनक परिणाम हैं।',
              rating: 5,
              date: '2 सप्ताह पूर्व'
            }
          ].map((rev, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-md border border-slate-200/90 hover:border-teal-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {rev.date}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 text-sm">{rev.name}</h4>
                  <p className="text-[11px] text-slate-500">{rev.location} • <span className="text-teal-700 font-semibold">{rev.condition}</span></p>
                </div>
                <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-800 font-bold flex items-center justify-center text-xs border border-teal-200">
                  {rev.name[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================= */}
      {/* 11. ONLINE APPOINTMENT FORM                      */}
      {/* ================================================= */}
      <section id="appointment-form-anchor" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AppointmentFormSection
          primaryPhone={primaryPhone}
          consultationFee={settings?.consultation_fee || 100}
          onNavigate={handleNav}
          onSuccessSubmitted={(id) => {
            console.log('Booked ID:', id);
          }}
        />
      </section>

      {/* ================================================= */}
      {/* 12. CLINIC PHOTO GALLERY (फोटो गैलरी विकल्प)        */}
      {/* ================================================= */}
      <section id="homepage-gallery-section" className="py-16 bg-gradient-to-b from-slate-50 via-teal-50/20 to-slate-100/60 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200 shadow-2xs">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>क्लिनिक फोटो गैलरी (Photo Gallery)</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                क्लिनिक एवं जांच केंद्र की तस्वीरें
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                मां जानकी एक्स-रे में उच्च गुणवत्ता वाले मैनुअल एक्स-रे यूनिट, ऑर्थोपेडिक परामर्श कक्ष, आधुनिक फिजियोथेरेपी और स्वच्छ वातावरण की विस्तृत झलकियां।
              </p>
            </div>

            {/* Direct View Full Gallery Action */}
            <div className="shrink-0 flex items-center gap-3">
              <button
                id="homepage-view-full-gallery-btn"
                onClick={() => handleNav('gallery')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold px-5 py-3 rounded-xl text-sm shadow-md shadow-teal-600/20 active:scale-95 transition-all cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                <span>पूरी गैलरी देखें (All Photos)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {[
              { id: 'all', label: 'सभी तस्वीरें (All)' },
              { id: 'x-ray', label: 'मैनुअल एक्स-रे (X-Ray)' },
              { id: 'doctor', label: 'डॉक्टर परामर्श (Doctor)' },
              { id: 'physiotherapy', label: 'फिजियोथेरेपी (Physiotherapy)' },
              { id: 'facilities', label: 'सुविधाएं व बैकअप (Facilities)' },
              { id: 'clinic', label: 'परिसर (Clinic)' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveGalleryCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeGalleryCategory === cat.id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.slice(0, 6).map((item) => (
              <div
                key={item.id}
                onClick={() => setPreviewImage(item)}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
              >
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/70 backdrop-blur-xs text-[11px] font-bold text-white uppercase tracking-wider">
                    {item.category}
                  </div>
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <div className="p-3 rounded-full bg-white/20 backdrop-blur-xs flex items-center gap-2 text-xs font-bold">
                      <ZoomIn className="w-5 h-5" />
                      <span>तस्वीर बड़ी करें</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-1.5 bg-white grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-teal-700 border-t border-slate-100">
                    <span>विस्तार से देखें</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Bar below gallery */}
          <div className="bg-white rounded-2xl p-6 border border-teal-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-bold text-slate-900">
                क्या आप क्लिनिक में परामर्श या एक्स-रे जांच करवाना चाहते हैं?
              </h4>
              <p className="text-xs text-slate-500">
                घर बैठे 1 मिनट में ऑनलाइन अपॉइंटमेंट स्लॉट बुक करें अथवा पूरी फोटो गैलरी देखें।
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => handleNav('gallery')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-slate-600" />
                <span>गैलरी पेज खोलें</span>
              </button>
              <button
                onClick={() => handleNav('appointment')}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>अपॉइंटमेंट बुक करें</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Homepage Gallery */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={previewImage.image_url}
                alt={previewImage.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold uppercase">
                  {previewImage.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{previewImage.title}</h3>
                <p className="text-sm text-slate-600">{previewImage.description}</p>
              </div>
              <button
                onClick={() => {
                  setPreviewImage(null);
                  handleNav('gallery');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shrink-0 shadow-sm"
              >
                <span>पूरी गैलरी देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
