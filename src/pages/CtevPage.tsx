import React from 'react';
import { Footprints, AlertCircle, CheckCircle2, Calendar, Phone, Heart, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react';
import { ClinicSettings } from '../types';

interface CtevPageProps {
  settings: ClinicSettings | null;
  onNavigate: (page: string) => void;
}

export const CtevPage: React.FC<CtevPageProps> = ({ settings, onNavigate }) => {
  const primaryPhone = settings?.primary_phone || '9525719654';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-teal-700">Home</button>
        <span>/</span>
        <button onClick={() => onNavigate('services')} className="hover:text-teal-700">Services</button>
        <span>/</span>
        <span className="text-slate-800">CTEV (जन्मजात टेढ़ा पैर)</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-cyan-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
            <Footprints className="w-4 h-4" />
            <span>बाल ऑर्थोपेडिक जानकारी</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            जन्मजात टेढ़ा पैर (CTEV / Clubfoot) का उपचार
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            समय पर सही चिकित्सकीय परामर्श और पोन्सेटी विधि (Ponseti Technique) द्वारा नवजात शिशुओं के मुड़े हुए पैर सामान्य हो सकते हैं।
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={() => onNavigate('appointment')}
              className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-black px-7 py-3.5 rounded-xl text-sm transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              Appointment के लिए संपर्क करें
            </button>
            <a
              href={`tel:${primaryPhone}`}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl text-sm border border-white/20 transition-colors"
            >
              फोन द्वारा परामर्श: {primaryPhone}
            </a>
          </div>
        </div>
      </div>

      {/* 1. What is CTEV */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            CTEV (क्लबफुट) क्या है? (What is CTEV?)
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            <strong>CTEV (Congenital Talipes Equinovarus)</strong> नवजात बच्चों में जन्म से ही पैरों की हड्डियों व मांसपेशियों का एक विकार है, जिसमें शिशु का एक या दोनों पैर अंदर की ओर तथा नीचे की तरफ मुड़े हुए होते हैं। यह जन्म के समय पाई जाने वाली सबसे सामान्य मस्कुलोस्केलेटल स्थितियों में से एक है।
          </p>
        </div>

        {/* 2. Symptoms */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-teal-600" />
            <span>प्रमुख लक्षण (Common Symptoms):</span>
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>पैर का आगे का हिस्सा अंदर की तरफ मुड़ा होना।</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>एड़ी ऊपर की तरफ खिंची होना (चलने पर पैर का तलवा जमीन पर सपाट न आना)।</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>प्रभावित पैर सामान्य पैर की तुलना में थोड़ा छोटा दिखना।</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>पिंडली (Calf) की मांसपेशियां थोड़ी पतली दिखाई देना।</span>
            </li>
          </ul>
        </div>

        {/* 3. Why early evaluation is important */}
        <div className="p-6 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3 text-xs sm:text-sm text-teal-950">
          <h3 className="text-base font-bold text-teal-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-700" />
            <span>प्रारंभिक परीक्षण क्यों अत्यंत आवश्यक है? (Why Early Medical Evaluation Matters)</span>
          </h3>
          <p className="leading-relaxed">
            नवजात शिशु की हड्डियां, टेंडन एवं स्नायु अत्यंत कोमल और लचीले होते हैं। जन्म के पहले 1-2 हफ्तों में उपचार शुरू करने से पैर बिना किसी बड़ी सर्जरी के धीरे-धीरे सही दिशा में मोड़कर ठीक किए जा सकते हैं। देरी होने पर हड्डियां सख्त होने लगती हैं जिससे सुधार में अधिक समय लगता है।
          </p>
        </div>

        {/* 4. Treatment Approach: Ponseti Technique */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            उपचार पद्धति: पोन्सेटी विधि (Ponseti Technique)
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            विश्वभर में CTEV के उपचार के लिए <strong>पोन्सेटी तकनीक</strong> को सर्वोत्तम माना गया है:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-slate-900">क्रमबद्ध कास्टिंग (Serial Plastering)</h4>
              <p className="text-slate-600 text-xs">
                हर हफ्ते धीरे-धीरे पैर की स्थिति सुधारते हुए हल्का प्लास्टर लगाया जाता है (लगभग 4 से 6 हफ्ते)।
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-slate-900">माइनर टैनोटोमी (Tenotomy - आवश्यकतानुसार)</h4>
              <p className="text-slate-600 text-xs">
                एकिलीस टेंडन को ढीला करने हेतु एक छोटा व सुरक्षित चिकित्सकीय प्रोसीजर।
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-slate-900">ब्रेस / विशेष जूते (Bracing Phase)</h4>
              <p className="text-slate-600 text-xs">
                सुधरे हुए पैर को उसी स्थिति में बनाए रखने हेतु विशेष जूते पहनाए जाते हैं ताकि समस्या दोबारा न लौटे।
              </p>
            </div>
          </div>
        </div>

        {/* 5. When parents should consult */}
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs sm:text-sm text-amber-950">
          <h4 className="font-bold text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span>माता-पिता को डॉक्टर से कब संपर्क करना चाहिए?</span>
          </h4>
          <p className="leading-relaxed">
            जैसे ही प्रसव के बाद शिशु के पैर में कोई भी मोड़ या असामान्य बनावट दिखाई दे, तुरंत प्रशिक्षित चिकित्सक से परामर्श लें। घरेलू मालिश या झोलाछाप उपायों में समय व्यर्थ न करें।
          </p>
        </div>

        {/* CTA Strip */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-slate-900">Dr. Jitendra Kumar - परामर्श उपलब्ध</div>
            <div className="text-xs text-slate-500">मां जानकी एक्स-रे एवं क्लिनिक, पूजाहां पत्जीरवा चौक</div>
          </div>

          <button
            id="ctev-bottom-book-btn"
            onClick={() => onNavigate('appointment')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-7 py-3 rounded-xl text-sm shadow-md transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Appointment के लिए संपर्क करें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
