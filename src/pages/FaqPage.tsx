import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search, Phone, Calendar, ArrowRight } from 'lucide-react';
import { FaqItem, ClinicSettings } from '../types';

interface FaqPageProps {
  faqs: FaqItem[];
  settings: ClinicSettings | null;
  onNavigate: (page: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ faqs, settings, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIds, setOpenIds] = useState<number[]>([1, 2]); // default first 2 open

  const primaryPhone = settings?.primary_phone || '9525719654';

  const toggleFaq = (id: number) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter(item => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const filteredFaqs = faqs.filter(f =>
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-teal-700">Home</button>
        <span>/</span>
        <span className="text-slate-800">Frequently Asked Questions</span>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>सामान्य जिज्ञासाएं एवं उत्तर</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          अक्सर पूछे जाने वाले सवाल (FAQs)
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          क्लिनिक समय, एक्स-रे जांच, फिजियोथेरेपी एवं परामर्श से संबंधित महत्वपूर्ण प्रश्नों के उत्तर।
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 mt-1" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="सवाल खोजें (जैसे: समय, एक्स-रे, प्लास्टर)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white shadow-xs font-medium"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
            आपके द्वारा खोजे गए शब्द से कोई प्रश्न नहीं मिला।
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-teal-300 transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900">
                    {faq.id}. {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-full bg-slate-100 text-slate-600 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-teal-100 text-teal-800' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still Have Questions Box */}
      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900">क्या आपका सवाल यहां सूचीबद्ध नहीं है?</h3>
        <p className="text-xs sm:text-sm text-slate-600">
          सीधे क्लिनिक पर फोन करके अपनी शंका का समाधान करें या परामर्श अपॉइंटमेंट बुक करें।
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={`tel:${primaryPhone}`}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call: {primaryPhone}</span>
          </a>
          <button
            onClick={() => onNavigate('appointment')}
            className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-300 transition-colors"
          >
            अपॉइंटमेंट बुक करें
          </button>
        </div>
      </div>
    </div>
  );
};
