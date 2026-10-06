import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, AlertCircle, 
  MessageSquare, Send, CheckCircle2, Copy, Check, Navigation, ExternalLink 
} from 'lucide-react';
import { ClinicSettings } from '../types';
import { api } from '../services/api';
import { LocationSection } from '../components/LocationSection';

interface ContactPageProps {
  settings: ClinicSettings | null;
  onNavigate: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const primaryPhone = settings?.primary_phone || '9525719654';
  const secondaryPhone = settings?.secondary_phone || '7492022733';
  const email = settings?.email || 'jitendrakumarbth061999@gmail.com';
  const addressLine1 = settings?.address_line1 || 'सृष्टि ज्योति पब्लिक स्कूल के सामने';
  const addressLine2 = settings?.address_line2 || 'मेन रोड';
  const city = settings?.city || 'पूजाहां पत्जीरवा चौक';
  const fullAddress = `${addressLine1}, ${addressLine2}, ${city}`;

  const whatsappUrl = `https://wa.me/91${primaryPhone}?text=${encodeURIComponent('नमस्ते, मुझे मां जानकी एक्स-रे क्लिनिक से संपर्क करना है।')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMessage('कृपया सभी आवश्यक विवरण भरें।');
      return;
    }

    setSubmitting(true);
    const res = await api.submitMessage({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject.trim() || undefined,
      message: formData.message.trim()
    });
    setSubmitting(false);

    if (res.success) {
      setSubmitted(true);
      setFormData({ name: '', phone: '', subject: '', message: '' });
    } else {
      setErrorMessage(res.error || 'संदेश भेजने में समस्या आई।');
    }
  };

  return (
    <div className="space-y-12 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button onClick={() => onNavigate('home')} className="hover:text-teal-700">Home</button>
          <span>/</span>
          <span className="text-slate-800">Contact Us</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
            <Phone className="w-3.5 h-3.5" />
            <span>सीधा संपर्क</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            संपर्क करें (Contact & Support)
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            किसी भी जानकारी, परामर्श समय या एक्स-रे जांच के लिए आप हमसे फोन, व्हाट्सएप या क्लिनिक पते पर सीधे संपर्क कर सकते हैं।
          </p>
        </div>

        {/* Grid: 3 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phone Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:border-teal-300 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">कॉल करें (Call Us)</h3>
              <p className="text-xs text-slate-500">सीधे फोन पर परामर्श या पूछताछ</p>
            </div>
            <div className="space-y-1 pt-1">
              <a href={`tel:${primaryPhone}`} className="block text-base font-bold text-teal-700 hover:underline">
                {primaryPhone}
              </a>
              <a href={`tel:${secondaryPhone}`} className="block text-sm font-semibold text-slate-700 hover:underline">
                {secondaryPhone}
              </a>
            </div>
            <a
              id="contact-call-btn"
              href={`tel:${primaryPhone}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 pt-2"
            >
              <span>सीधे डायल करें</span>
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:border-emerald-300 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">WhatsApp संदेश</h3>
              <p className="text-xs text-slate-500">तुरंत संदेश व रिपोर्ट भेजें</p>
            </div>
            <div className="pt-1">
              <span className="block text-base font-bold text-emerald-700">
                +91 {primaryPhone}
              </span>
              <span className="text-xs text-slate-500">त्वरित उत्तर सुविधा</span>
            </div>
            <a
              id="contact-whatsapp-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 pt-2"
            >
              <span>WhatsApp पर बात करें</span>
            </a>
          </div>

          {/* Email & Emergency */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:border-blue-300 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">ईमेल (Email)</h3>
              <p className="text-xs text-slate-500">कागजी रिपोर्ट व प्रशासनिक संपर्क</p>
            </div>
            <div className="pt-1">
              <a href={`mailto:${email}`} className="block text-xs font-semibold text-slate-800 break-all hover:text-teal-700">
                {email}
              </a>
            </div>
            <div className="pt-2">
              <span className="inline-block px-2.5 py-1 rounded bg-red-50 text-red-700 text-[11px] font-bold border border-red-200">
                24 Hours Emergency Service
              </span>
            </div>
          </div>
        </div>

        {/* Message Inquiry Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200 max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black text-slate-900">सीधा संदेश भेजें (Send a Message)</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              अपनी कोई भी समस्या या प्रश्न नीचे लिखें। हमारी टीम आपसे संपर्क करेगी।
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-lg font-bold text-emerald-900">आपका संदेश प्राप्त हो गया है!</h4>
              <p className="text-xs text-emerald-700">हम शीघ्र ही आपसे दिए गए फोन नंबर पर संपर्क करेंगे।</p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-emerald-800 underline cursor-pointer"
              >
                दूसरा संदेश भेजें
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">आपका नाम *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="उदा. अमित कुमार"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">मोबाइल नंबर *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10 अंकों का मोबाइल नंबर"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">विषय (Subject)</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="उदा. एक्स-रे समय या फिजियोथेरेपी पूछताछ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">संदेश (Message) *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="अपनी समस्या या प्रश्न लिखें..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors disabled:opacity-50 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'भेजा जा रहा है...' : 'संदेश भेजें (Send Message)'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Location Section */}
      <LocationSection settings={settings} />
    </div>
  );
};
