import React from 'react';
import { 
  HeartPulse, CheckCircle2, AlertCircle, Calendar, 
  Phone, ArrowRight, Zap, Activity, ShieldCheck 
} from 'lucide-react';
import { ClinicSettings } from '../types';

interface PhysiotherapyPageProps {
  settings: ClinicSettings | null;
  onNavigate: (page: string) => void;
}

export const PhysiotherapyPage: React.FC<PhysiotherapyPageProps> = ({ settings, onNavigate }) => {
  const primaryPhone = settings?.primary_phone || '9525719654';

  const painConditions = [
    {
      title: 'Joint Pain',
      hi: 'जोड़ों का पुराना दर्द',
      desc: 'घुटने का दर्द (Osteoarthritis), कूल्हे का दर्द, कंधे का अकड़ना (Frozen Shoulder) एवं टखने का दर्द।',
      bullets: ['जोड़ों की अकड़न दूर करना', 'गतिशीलता (Mobility) बढ़ाना', 'दर्द निवारक इलेक्ट्रोथेरेपी']
    },
    {
      title: 'Back Pain',
      hi: 'कमर व रीढ़ का दर्द',
      desc: 'लम्बर स्पॉन्डिलाइटिस, स्लिप डिस्क (Sciatica), मांसपेशियों में खिंचाव व खराब पोस्चर से उत्पन्न दर्द।',
      bullets: ['रीढ़ की मांसपेशियों को मजबूती', 'सायटिका नसों का दबाव कम करना', 'दैनिक दिनचर्या में सुधार']
    },
    {
      title: 'Neck Pain',
      hi: 'गर्दन का दर्द व सर्वाइकल',
      desc: 'सर्वाइकल स्पॉन्डिलाइटिस, गर्दन में अकड़न, सिरदर्द एवं कंधे व हाथों में सुन्नपन की समस्या।',
      bullets: ['ट्रैक्शन एवं मोबिलाइजेशन', 'गर्दन की मांसपेशियों का लचीलापन', 'कंप्यूटर व मोबाइल पोस्चर सुधार']
    },
    {
      title: 'Muscle Pain',
      hi: 'मांसपेशियों का खिंचाव व ऐंठन',
      desc: 'खेलकूद या कार्य के दौरान मोच, लिगामेंट चोट, मांसपेशियों में कमजोरी व पुराना दर्द।',
      bullets: ['अल्ट्रासाउंड व TENS थेरेपी', 'ऊतकों का प्राकृतिक उपचार', 'सूजन व तनाव कम करना']
    },
    {
      title: 'Mobility Problems',
      hi: 'चलने-फिरने में असमर्थता',
      desc: 'ऑपरेशन, फ्रैक्चर या प्लास्टर कटने के बाद जोड़ों का जाम होना व लकवा (Paralysis) उपरांत पुनर्वास।',
      bullets: ['स्ट्रेंथ व बैलेंस ट्रेनिंग', 'सहज चलने का अभ्यास', 'दैनिक गतिविधियों में स्वावलंबन']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-teal-700">Home</button>
        <span>/</span>
        <button onClick={() => onNavigate('services')} className="hover:text-teal-700">Services</button>
        <span>/</span>
        <span className="text-slate-800">Modern Physiotherapy</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
            <HeartPulse className="w-4 h-4" />
            <span>आधुनिक पुनर्वास चिकित्सा</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Modern Physiotherapy
          </h1>
          <p className="text-xl font-bold text-teal-300">
            आधुनिक मशीनों द्वारा फिजियोथेरेपी की सुविधा
          </p>
          <p className="text-base text-slate-300 leading-relaxed">
            मां जानकी क्लिनिक में पुराने से पुराने दर्द, जोड़ों की अकड़न, लिगामेंट चोट एवं पोस्ट-ऑपरेटिव पुनर्वास हेतु आधुनिक इलेक्ट्रोथेरेपी व वैज्ञानिक व्यायाम विधियों द्वारा उपचार किया जाता है।
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              id="physio-hero-book-btn"
              onClick={() => onNavigate('appointment')}
              className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-black px-7 py-3.5 rounded-xl text-sm transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              Physiotherapy Appointment लें
            </button>
            <a
              href={`tel:${primaryPhone}`}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl text-sm border border-white/20 transition-colors"
            >
              फोन द्वारा संपर्क: {primaryPhone}
            </a>
          </div>
        </div>
      </div>

      {/* 5 Conditions Cards */}
      <div className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            प्रमुख समस्याएं जिनका उपचार फिजियोथेरेपी से किया जाता है
          </h2>
          <p className="text-sm text-slate-600">
            पुराने दर्द से मुक्ति एवं सामान्य गतिशीलता पुनः प्राप्त करने के लिए विशेष उपचार योजनाएं:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {painConditions.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 font-black flex items-center justify-center text-sm">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                  <div className="text-xs font-bold text-teal-700 mt-0.5">{item.hi}</div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>

                <ul className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-700">
                  {item.bullets.map((b, bidx) => (
                    <li key={bidx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigate('appointment')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
                >
                  <span>इसके लिए अपॉइंटमेंट लें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Medical Assessment Note required by prompt */}
      <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>चिकित्सीय सूचना (Important Medical Note):</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-amber-900/90">
          फिजियोथेरेपी उपचार की अवधि, मशीनों का चयन एवं व्यायाम का प्रकार प्रत्येक मरीज के व्यक्तिगत चिकित्सीय परीक्षण (Individual Medical Assessment) एवं रोग की गंभीरता पर निर्भर करता है। बिना डॉक्टर की सलाह के कोई भी जटिल व्यायाम न करें।
        </p>
      </div>

      {/* CTA Box */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-xl font-bold text-slate-900">क्या आप पुराने दर्द से परेशान हैं?</h4>
          <p className="text-xs sm:text-sm text-slate-600">मां जानकी क्लिनिक में डॉ. जितेंद्र कुमार से परामर्श लेकर अपनी थेरेपी शुरू करें।</p>
        </div>
        <button
          onClick={() => onNavigate('appointment')}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-7 py-3.5 rounded-xl text-sm shadow-md transition-colors cursor-pointer shrink-0"
        >
          Physiotherapy Appointment लें
        </button>
      </div>
    </div>
  );
};
