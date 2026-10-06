import React from 'react';
import { AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface TermsPageProps {
  onNavigate: (page: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-teal-700">Home</button>
        <span>/</span>
        <span className="text-slate-800">Terms & Conditions</span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200 space-y-6">
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700">
            <FileText className="w-3.5 h-3.5" />
            <span>नियम व शर्तें</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Terms & Conditions (नियम एवं शर्तें)
          </h1>
          <p className="text-xs text-slate-500">अंतिम अद्यतन: 2025</p>
        </div>

        <div className="space-y-5 text-sm text-slate-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">चिकित्सीय अस्वीकरण (Medical Disclaimer):</strong>
              Website पर दी गई जानकारी केवल सामान्य सूचना और जागरूकता के उद्देश्य से है। यह किसी पेशेवर चिकित्सक के व्यक्तिगत चिकित्सकीय परामर्श का विकल्प नहीं है। किसी भी गंभीर या आपातकालीन स्थिति में तुरंत निकटतम अस्पताल या डॉक्टर से संपर्क करें।
            </div>
          </div>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">1. ऑनलाइन अपॉइंटमेंट की स्थिति</h3>
            <p>
              वेबसाइट के माध्यम से भरा जाने वाला अपॉइंटमेंट फॉर्म एक प्रारंभिक अनुरोध (Request) है। क्लिनिक द्वारा समय की उपलब्धता और समीक्षा के उपरांत जब तक फोन या संदेश द्वारा पुष्टि नहीं की जाती, तब तक अपॉइंटमेंट को पूर्ण रूप से आरक्षित न मानें।
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">2. एक्स-रे व नैदानिक सेवाएं</h3>
            <p>
              एक्स-रे जांच प्रशिक्षित रेडियोग्राफर द्वारा आवश्यक सुरक्षा मानकों के साथ की जाती है। यदि मरीज गर्भवती हैं या विकिरण के प्रति संवेदनशील स्थिति में हैं, तो जांच से पूर्व रेडियोग्राफर को सूचित करना अनिवार्य है।
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">3. उपचार व सुधार की अवधि</h3>
            <p>
              फिजियोथेरेपी एवं ऑर्थोपेडिक उपचार के परिणाम प्रत्येक व्यक्ति की शारीरिक संरचना, रोग की अवधि, उम्र एवं नियमित व्यायाम पर निर्भर करते हैं। क्लिनिक किसी भी अवास्तविक या 100% सुधार का झूठा दावा नहीं करता है।
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">4. क्लिनिक स्थान व क्षेत्राधिकार</h3>
            <p>
              क्लिनिक सृष्टि ज्योति पब्लिक स्कूल के सामने, मेन रोड, पूजाहां पत्जीरवा चौक पर स्थित है। किसी भी विधिक प्रश्न हेतु स्थानीय क्षेत्राधिकार लागू होगा।
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
