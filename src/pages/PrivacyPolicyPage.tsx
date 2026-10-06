import React from 'react';
import { ShieldCheck, Lock, AlertCircle } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigate: (page: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-teal-700">Home</button>
        <span>/</span>
        <span className="text-slate-800">Privacy Policy</span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200 space-y-6">
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>गोपनीयता नीति</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Privacy Policy (गोपनीयता नीति)
          </h1>
          <p className="text-xs text-slate-500">अंतिम अद्यतन (Last Updated): 2025</p>
        </div>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">1. एकत्रित की जाने वाली जानकारी</h3>
            <p>
              मां जानकी एक्स-रे (Maa Janki X-Ray & Orthopedic / Physiotherapy Clinic) की वेबसाइट पर जब आप अपॉइंटमेंट अनुरोध फॉर्म भरते हैं या संदेश भेजते हैं, तो हम केवल आवश्यक जानकारी जैसे: मरीज़ का नाम, आयु, लिंग, मोबाइल नंबर, पसंदीदा समय एवं स्वास्थ्य समस्या का संक्षिप्त विवरण प्राप्त करते हैं।
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">2. जानकारी का उपयोग</h3>
            <p>
              एकत्रित की गई जानकारी का उपयोग केवल निम्नलिखित उद्देश्यों हेतु किया जाता है:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>क्लिनिक अपॉइंटमेंट की पुष्टि एवं शेड्यूलिंग हेतु संपर्क करना।</li>
              <li>परामर्श एवं एक्स-रे जांच से संबंधित आवश्यक पूर्व-निर्देश प्रदान करना।</li>
              <li>मरीजों की स्वास्थ्य सुरक्षा एवं सेवा गुणवत्ता में निरंतर सुधार।</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">3. डेटा सुरक्षा व गोपनीयता</h3>
            <p>
              हम किसी भी मरीज का व्यक्तिगत अथवा चिकित्सीय डेटा किसी तीसरे पक्ष (Third Party) के साथ विपणन (Marketing) या व्यावसायिक उद्देश्यों के लिए साझा, बेचा या स्थानांतरित नहीं करते हैं। सभी डेटा आधुनिक एन्क्रिप्शन एवं सुरक्षा मानकों के तहत सुरक्षित रखा जाता है।
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">4. संपर्क व प्रश्न</h3>
            <p>
              यदि आपको हमारी गोपनीयता नीति के संबंध में कोई प्रश्न है, तो आप सीधे हमारे आधिकारिक ईमेल <strong>jitendrakumarbth061999@gmail.com</strong> या हेल्पलाइन <strong>9525719654</strong> पर संपर्क कर सकते हैं।
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
