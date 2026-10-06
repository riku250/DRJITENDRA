import React from 'react';
import { 
  Activity, MapPin, Clock, AlertCircle, ShieldCheck, 
  Zap, Award, CheckCircle2, Navigation, Phone, Calendar, ArrowRight 
} from 'lucide-react';
import { ClinicSettings } from '../types';

interface AboutPageProps {
  settings: ClinicSettings | null;
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate }) => {
  const primaryPhone = settings?.primary_phone || '9525719654';
  const addressLine1 = settings?.address_line1 || 'सृष्टि ज्योति पब्लिक स्कूल के सामने';
  const addressLine2 = settings?.address_line2 || 'मेन रोड';
  const city = settings?.city || 'पूजाहां पत्जीरवा चौक';

  const mapsQuery = encodeURIComponent(settings?.google_maps_query || 'Maa Janki X-Ray, Opposite Srishti Jyoti Public School, Main Road, Poojahan Patjirva Chowk');
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-teal-700">Home</button>
        <span>/</span>
        <span className="text-slate-800">About Clinic</span>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-xl border border-slate-200 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
              <Activity className="w-3.5 h-3.5" />
              <span>विश्वसनीय स्वास्थ्य केंद्र</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              मां जानकी एक्स-रे के बारे में
            </h1>

            <p className="text-base text-slate-700 leading-relaxed">
              <strong>मां जानकी एक्स-रे (Maa Janki X-Ray & Orthopedic / Physiotherapy Clinic)</strong> स्थानीय क्षेत्र में हड्डी, जोड़, नस रोग, मैनुअल एक्स-रे तथा आधुनिक फिजियोथेरेपी से संबंधित चिकित्सा परामर्श व सेवाओं का एक विश्वसनीय केंद्र है।
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              क्लिनिक का मुख्य उद्देश्य मरीजों को गुणवत्तापूर्ण, पारदर्शी एवं सुलभ स्वास्थ्य सेवाएं प्रदान करना है। यहां उच्च गुणवत्ता वाली मैनुअल एक्स-रे जांच, विशेषज्ञ डॉक्टर द्वारा मस्कुलोस्केलेटल परामर्श, बच्चों में जन्मजात टेढ़े पैर (CTEV) का पोन्सेटी उपचार तथा विभिन्न प्रकार के पुराने दर्दों से राहत हेतु आधुनिक इलेक्ट्रोथेरेपी मशीनें उपलब्ध हैं।
            </p>

            {/* Clinic Quick Factual Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-semibold">क्लिनिक का नाम:</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">मां जानकी एक्स-रे</div>
                <div className="text-xs text-teal-700">Maa Janki X-Ray</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-semibold">स्थान / पता:</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">{addressLine1}</div>
                <div className="text-xs text-slate-600">{addressLine2}, {city}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-semibold">परामर्श का समय:</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">Everyday: 8:00 AM – 7:00 PM</div>
                <div className="text-xs text-slate-600">सातों दिन खुला रहता है</div>
              </div>

              <div className="p-4 rounded-xl bg-red-50/70 border border-red-200">
                <div className="text-xs text-red-600 font-semibold">इमरजेंसी सेवा:</div>
                <div className="text-sm font-bold text-red-900 mt-0.5">24 Hours Emergency Service</div>
                <div className="text-xs text-red-700">आपातकालीन हेल्पलाइन उपलब्ध</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a
                id="about-get-directions-btn"
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions (रास्ता देखें)</span>
              </a>

              <button
                onClick={() => onNavigate('appointment')}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-6 py-3 rounded-xl text-sm transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
                alt="Maa Janki Clinic Interior"
                className="w-full h-72 object-cover"
              />
            </div>

            {/* Trust factors */}
            <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-slate-700 space-y-2.5">
              <div className="font-bold text-teal-900 flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>क्लिनिक की मुख्य विशेषताएं:</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>स्वच्छ, सुरक्षित एवं मरीज-अनुकूल परिवेश</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>जनरेटर पावर बैकअप (बिना रुकावट जांच की सुविधा)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>रंगीन एवं हल्के फाइबर प्लास्टर की उपलब्धता</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>आधुनिक इलेक्ट्रोथेरेपी एवं पुनर्वास उपकरण</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
