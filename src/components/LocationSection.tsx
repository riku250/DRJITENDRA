import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Copy, Check, Clock, Phone, AlertCircle } from 'lucide-react';
import { ClinicSettings } from '../types';

interface LocationSectionProps {
  settings: ClinicSettings | null;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ settings }) => {
  const [copied, setCopied] = useState(false);

  const addressLine1 = settings?.address_line1 || 'सृष्टि ज्योति पब्लिक स्कूल के सामने';
  const addressLine2 = settings?.address_line2 || 'मेन रोड';
  const city = settings?.city || 'पूजाहां पत्जीरवा चौक';
  const primaryPhone = settings?.primary_phone || '9525719654';
  const secondaryPhone = settings?.secondary_phone || '7492022733';
  const fullAddress = `${addressLine1}, ${addressLine2}, ${city}`;

  const mapsQuery = encodeURIComponent(settings?.google_maps_query || 'Maa Janki X-Ray, Opposite Srishti Jyoti Public School, Main Road, Poojahan Patjirva Chowk');
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;
  
  // Embed url or search embed
  const embedUrl = settings?.google_maps_embed_url || `https://maps.google.com/maps?q=${mapsQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="location-section" className="py-16 bg-slate-100/70 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
            <MapPin className="w-3.5 h-3.5" />
            <span>क्लिनिक स्थान व पता</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            क्लिनिक कैसे पहुंचे (Location & Directions)
          </h2>
          <p className="text-base text-slate-600">
            मां जानकी एक्स-रे क्लिनिक मुख्य मार्ग पर सृष्टि ज्योति पब्लिक स्कूल के सामने सुविधाजनक स्थान पर स्थित है।
          </p>
        </div>

        {/* 2 Column Layout: Details & Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Details Card (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">हमारा पता (Clinic Address)</h3>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {addressLine1},<br />
                    <span className="font-semibold text-slate-900">{addressLine2}, {city}</span>
                  </p>
                  <p className="text-xs text-slate-500 pt-1">
                    (सृष्टि ज्योति पब्लिक स्कूल के बिल्कुल सामने)
                  </p>
                </div>
              </div>

              {/* Copy Address Button */}
              <button
                id="copy-address-button"
                onClick={handleCopyAddress}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">पता कॉपी हो गया! (Copied)</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>पूरा पता कॉपी करें (Copy Address)</span>
                  </>
                )}
              </button>

              <hr className="border-slate-100" />

              {/* Timing & Contact highlights */}
              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">परामर्श समय: </span>
                    <span className="text-slate-600">प्रतिदिन 8:00 AM – 7:00 PM</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">इमरजेंसी सेवा: </span>
                    <span className="text-red-700 font-semibold">24 Hours Emergency Service</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">संपर्क नंबर: </span>
                    <span className="text-slate-800 font-semibold">{primaryPhone}, {secondaryPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
              <a
                id="get-directions-btn"
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md shadow-teal-600/20 active:scale-98 transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>

              <a
                id="open-google-maps-btn"
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm active:scale-98 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Maps</span>
              </a>
            </div>
          </div>

          {/* Interactive Google Maps Frame (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200 relative min-h-[380px] flex flex-col">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Interactive Google Maps (सृष्टि ज्योति स्कूल, पूजाहां पत्जीरवा चौक)</span>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 hover:underline inline-flex items-center gap-1 font-bold"
              >
                <span>बड़ा नक्शा देखें</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex-1 w-full h-full min-h-[340px] relative">
              <iframe
                title="Maa Janki Clinic Google Map"
                src={embedUrl}
                width="100%"
                height="100%"
                className="w-full h-full border-0 min-h-[340px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
