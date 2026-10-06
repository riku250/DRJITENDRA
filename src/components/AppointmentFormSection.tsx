import React, { useState } from 'react';
import { 
  Calendar, Clock, User, Phone, CheckCircle2, 
  AlertCircle, Sparkles, Activity, ShieldCheck, ArrowRight, Printer, Download, FileText, X 
} from 'lucide-react';
import { api } from '../services/api';

interface AppointmentFormSectionProps {
  onSuccessSubmitted?: (appointmentId: string) => void;
  onNavigate?: (page: string) => void;
  primaryPhone?: string;
  defaultService?: string;
  consultationFee?: number;
}

export const AppointmentFormSection: React.FC<AppointmentFormSectionProps> = ({
  onSuccessSubmitted,
  onNavigate,
  primaryPhone = '9525719654',
  defaultService = 'हड्डी एवं जोड़ संबंधी परामर्श',
  consultationFee = 100
}) => {
  const [formData, setFormData] = useState({
    patient_name: '',
    age: '',
    gender: 'Male',
    mobile: '',
    preferred_date: '',
    preferred_time: '10:00 AM – 01:00 PM',
    service: defaultService,
    problem: '',
    additional_message: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    id: string;
    patient_name: string;
    age?: string | number;
    gender?: string;
    mobile?: string;
    preferred_date: string;
    preferred_time: string;
    service: string;
    problem?: string;
  } | null>(null);
  const [showSlipModal, setShowSlipModal] = useState(false);

  // Available services list
  const servicesList = [
    'हड्डी एवं जोड़ संबंधी परामर्श (Orthopedic Consultation)',
    'X-Ray / Radiography (मैनुअल एक्स-रे जांच)',
    'आधुनिक मशीन द्वारा Physiotherapy (इलेक्ट्रोथेरेपी)',
    'जन्मजात टेढ़ा पैर (CTEV / Clubfoot) का इलाज',
    'नस संबंधी समस्याओं के लिए परामर्श (Nerve Care)',
    'पुराने से पुराने दर्द के उपचार हेतु Physiotherapy',
    'रंगीन एवं हल्के प्लास्टर की सुविधा (Fiberglass Plaster)',
    '24 Hours Emergency Service (आपातकालीन सेवा)',
    'सामान्य परामर्श (General Consultation)'
  ];

  const timeSlots = [
    '08:00 AM – 10:00 AM (सुबह)',
    '10:00 AM – 01:00 PM (दोपहर पूर्व)',
    '01:00 PM – 04:00 PM (दोपहर)',
    '04:00 PM – 07:00 PM (शाम)',
    'इमरजेंसी / तत्काल (Immediate Care)'
  ];

  // Min date = today
  const todayDate = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.patient_name.trim()) {
      setErrorMessage('कृपया मरीज़ का नाम दर्ज करें।');
      return;
    }
    const ageNum = parseInt(formData.age, 10);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 125) {
      setErrorMessage('कृपया मान्य आयु दर्ज करें।');
      return;
    }
    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage('कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (!formData.preferred_date) {
      setErrorMessage('कृपया परामर्श की पसंदीदा तारीख चुनें।');
      return;
    }
    if (!formData.problem.trim()) {
      setErrorMessage('कृपया समस्या अथवा आने का कारण संक्षेप में लिखें।');
      return;
    }

    setLoading(true);

    const res = await api.submitAppointment({
      patient_name: formData.patient_name.trim(),
      age: ageNum,
      gender: formData.gender as any,
      mobile: cleanMobile,
      preferred_date: formData.preferred_date,
      preferred_time: formData.preferred_time,
      service: formData.service,
      problem: formData.problem.trim(),
      additional_message: formData.additional_message.trim() || undefined
    });

    setLoading(false);

    if (res.success && res.data) {
      localStorage.setItem('last_appointment_id', res.data.id);
      setSuccessData({
        id: res.data.id,
        patient_name: formData.patient_name.trim(),
        age: ageNum,
        gender: formData.gender,
        mobile: cleanMobile,
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        service: formData.service,
        problem: formData.problem.trim()
      });
      setShowSlipModal(true);
      if (onSuccessSubmitted) {
        onSuccessSubmitted(res.data.id);
      }
    } else {
      setErrorMessage(res.error || 'अपॉइंटमेंट सबमिट करने में समस्या आई। कृपया पुनः प्रयास करें।');
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setFormData({
      patient_name: '',
      age: '',
      gender: 'Male',
      mobile: '',
      preferred_date: '',
      preferred_time: '10:00 AM – 01:00 PM',
      service: defaultService,
      problem: '',
      additional_message: ''
    });
  };

  return (
    <div id="appointment-form-container" className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 text-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-200 border border-teal-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>सरल व त्वरित ऑनलाइन प्रक्रिया</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              अपॉइंटमेंट अनुरोध (Book Appointment)
            </h3>
            <p className="text-sm text-teal-100/90 max-w-xl">
              अपनी पसंदीदा तारीख एवं समय का चयन करें। क्लिनिक टीम द्वारा जांच उपरांत पुष्टि (Confirmation) के लिए आपसे शीघ्र संपर्क किया जाएगा।
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end text-xs text-teal-100 bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10">
            <span className="font-bold text-white">🕐 क्लिनिक समय</span>
            <span>Everyday: 8:00 AM – 7:00 PM</span>
            <span className="text-amber-300 font-semibold mt-0.5">24hr Emergency</span>
          </div>
        </div>
      </div>

      {/* Form or Success State */}
      <div className="p-6 sm:p-10">
        {successData ? (
          <div className="text-center py-8 px-4 max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold border border-amber-300">
                अनुरोध स्थिति: समीक्षाधीन (Pending Request)
              </span>
              <h4 className="text-2xl font-black text-slate-900">
                आपकी appointment request successfully submit हो गई है।
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Clinic द्वारा confirmation के लिए आपसे संपर्क किया जाएगा।
              </p>
            </div>

            {/* Appointment Details Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Appointment ID:</span>
                <span className="font-mono font-bold text-teal-700 text-base">{successData.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">मरीज़ का नाम:</span>
                <span className="font-bold text-slate-800">{successData.patient_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">सेवा / विभाग:</span>
                <span className="font-medium text-slate-800">{successData.service}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">पसंदीदा तारीख:</span>
                <span className="font-bold text-slate-800">{successData.preferred_date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">पसंदीदा समय:</span>
                <span className="font-bold text-slate-800">{successData.preferred_time}</span>
              </div>
            </div>

            {/* Note & Actions */}
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5 text-left">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>कृपया ध्यान दें:</strong> यह एक अनुरोध (Request) है। क्लिनिक द्वारा पुष्टि (Confirmation) के पश्चात ही अपॉइंटमेंट अंतिम माना जाएगा। किसी आपातकाल की स्थिति में सीधे <strong>{primaryPhone}</strong> पर कॉल करें।
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowSlipModal(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-colors inline-flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>📥 अपॉइंटमेंट स्लिप डाउनलोड / प्रिंट करें</span>
              </button>
              <button
                onClick={handleReset}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
              >
                दूसरा अपॉइंटमेंट बुक करें
              </button>
              <a
                href={`https://wa.me/91${primaryPhone}?text=${encodeURIComponent(`नमस्ते, मैंने मां जानकी एक्स-रे में अपॉइंटमेंट रिक्वेस्ट (ID: ${successData.id}) सबमिट की है। कृपया स्टेटस बताएं।`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                <span>WhatsApp पर पुष्टि मांगें</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Patient Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  मरीज़ का पूरा नाम (Patient Name) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="patient-name-input"
                    required
                    value={formData.patient_name}
                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                    placeholder="उदा. रमेश कुमार"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium"
                  />
                </div>
              </div>

              {/* Age */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  आयु (Age) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="patient-age-input"
                  required
                  min="0"
                  max="125"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="उदा. 35"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  लिंग (Gender) <span className="text-red-500">*</span>
                </label>
                <select
                  id="patient-gender-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium bg-white"
                >
                  <option value="Male">पुरुष (Male)</option>
                  <option value="Female">महिला (Female)</option>
                  <option value="Child">बच्चा / शिशु (Child)</option>
                  <option value="Other">अन्य (Other)</option>
                </select>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  मोबाइल नंबर (Mobile Number) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    id="patient-mobile-input"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="10 अंकों का मोबाइल नंबर"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium"
                  />
                </div>
              </div>

              {/* Preferred Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  पसंदीदा तारीख (Preferred Date) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="patient-date-input"
                    required
                    min={todayDate}
                    value={formData.preferred_date}
                    onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium"
                  />
                </div>
              </div>

              {/* Preferred Time */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  पसंदीदा समय (Preferred Time) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="patient-time-select"
                    value={formData.preferred_time}
                    onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium bg-white"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Service Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                सेवा / परामर्श विभाग (Service / Department) <span className="text-red-500">*</span>
              </label>
              <select
                id="patient-service-select"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium bg-white"
              >
                {servicesList.map((srv) => (
                  <option key={srv} value={srv}>
                    {srv}
                  </option>
                ))}
              </select>
            </div>

            {/* Problem / Reason for Visit */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  समस्या / लक्षण (Problem / Chief Complaint) <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  परामर्श शुल्क: ₹{consultationFee} मात्र (क्लिनिक पर देय)
                </span>
              </div>

              {/* Quick Symptom Chips */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {[
                  'घुटने का दर्द व सूजन',
                  'कमर दर्द / साइटिका',
                  'हड्डी फ्रैक्चर / मोच',
                  'गर्दन व कंधे का दर्द',
                  'जन्मजात टेढ़ा पैर (Clubfoot)',
                  'एक्स-रे जांच की आवश्यकता',
                  'नस में खिंचाव व सुन्नपन'
                ].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        problem: prev.problem ? `${prev.problem}, ${sym}` : sym
                      }));
                    }}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                  >
                    + {sym}
                  </button>
                ))}
              </div>

              <textarea
                id="patient-problem-textarea"
                required
                rows={2}
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                placeholder="उदा. घुटने में तेज दर्द, कमर में खिंचाव, एक्स-रे जांच, नवजात बच्चे के पैर का मुड़ा होना आदि..."
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium resize-none"
              />
            </div>

            {/* Additional Message (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                अतिरिक्त संदेश (Additional Message - Optional)
              </label>
              <input
                type="text"
                id="patient-additional-input"
                value={formData.additional_message}
                onChange={(e) => setFormData({ ...formData, additional_message: e.target.value })}
                placeholder="कोई पूर्व जांच, दवाई या विशेष अनुरोध..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium"
              />
            </div>

            {/* Privacy notice banner */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                <strong>गोपनीयता सूचना:</strong> आपकी व्यक्तिगत व चिकित्सीय जानकारी पूर्णतः सुरक्षित रखी जाती है और इसका उपयोग केवल क्लिनिक अपॉइंटमेंट व संपर्क हेतु किया जाता है।
              </span>
            </div>

            {/* Submit CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 text-center sm:text-left">
                <span>पुष्टि के लिए क्लिनिक से फोन या संदेश प्राप्त होगा।</span>
              </div>

              <button
                type="submit"
                id="submit-appointment-button"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg shadow-teal-600/25 active:scale-98 transition-all disabled:opacity-50 text-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{loading ? 'जमा हो रहा है...' : 'Book Appointment (अपॉइंटमेंट बुक करें)'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Printable / Downloadable Appointment Slip Modal */}
      {showSlipModal && successData && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSlipModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Slip Container - Professional Doctor Pad / Letterhead Style */}
            <div id="printable-appointment-slip" className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-teal-800 space-y-5 text-slate-900 shadow-sm relative overflow-hidden">
              {/* Watermark / Medical Cross Accent */}
              <div className="absolute top-4 right-4 opacity-5 pointer-events-none text-9{-teal-900 font-black select-none">
                🏥
              </div>

              {/* Header: Doctor & Clinic Letterhead */}
              <div className="border-b-2 border-teal-800 pb-4 space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-extrabold bg-teal-800 text-white px-3 py-1 rounded-full">
                      OPD CONSULTATION & X-RAY SLIP (परामर्श पर्ची)
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-teal-950 tracking-tight mt-1.5">
                      मां जानकी एक्स-रे एवं फिजियोथेरेपी क्लिनिक
                    </h1>
                    <p className="text-xs font-bold text-teal-800">
                      Maa Janki X-Ray, Orthopedic & Physiotherapy Clinic
                    </p>
                  </div>
                  <div className="text-left sm:text-right text-xs font-semibold text-slate-700 bg-teal-50 p-2.5 rounded-xl border border-teal-200">
                    <p className="font-black text-teal-900">Dr. Jitendra Kumar</p>
                    <p className="text-[11px] text-teal-800 font-bold">BPT (APP), BOTT (Ranchi), CMS & ED (HR)</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Reg No: 15504/24</p>
                  </div>
                </div>

                <div className="text-[11px] font-medium text-slate-600 flex flex-wrap items-center justify-between pt-1 border-t border-slate-100">
                  <span>📍 पता: सृष्टि ज्योति पब्लिक स्कूल के सामने, मेन रोड, पूजाहां पत्जीरवा चौक</span>
                  <span className="font-bold text-teal-900">📞 हेल्पलाईन: 9525719654, 7492022733</span>
                </div>
              </div>

              {/* Patient & Appointment Details Grid */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between bg-teal-50/60 p-3 rounded-xl border border-teal-200">
                  <span className="font-bold text-teal-900">Appointment ID (पर्ची क्रमांक):</span>
                  <span className="font-mono font-black text-teal-950 text-base bg-white px-3 py-1 rounded-lg border border-teal-300 shadow-2xs">{successData.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">मरीज़ का नाम (Patient Name):</span>
                    <span className="font-black text-slate-900 text-sm">{successData.patient_name}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">आयु व लिंग (Age / Gender):</span>
                    <span className="font-bold text-slate-900 text-sm">{successData.age || '—'} वर्ष ({successData.gender || '—'})</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">मोबाइल नंबर (Mobile No):</span>
                    <span className="font-bold text-slate-900 font-mono">{successData.mobile || '—'}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">स्थिति (Status):</span>
                    <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-xs inline-block mt-0.5">● समीक्षाधीन (Pending Approval)</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 block">विभागीय सेवा (Department / Service):</span>
                  <span className="font-black text-teal-950 text-sm">{successData.service}</span>
                </div>

                {successData.problem && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[11px] text-slate-500 block">समस्या / लक्षण (Chief Complaints / Problem):</span>
                    <span className="font-semibold text-slate-900">{successData.problem}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">परामर्श दिनांक (Preferred Date):</span>
                    <span className="font-bold text-teal-900">{successData.preferred_date}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">समय सारणी (Time Slot):</span>
                    <span className="font-bold text-teal-900">{successData.preferred_time}</span>
                  </div>
                </div>
              </div>

              {/* Consultation Fee Box */}
              <div className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-4 text-center space-y-1 shadow-xs">
                <div className="text-xs font-black text-rose-900 uppercase tracking-wider">
                  परामर्श शुल्क स्थिति (Consultation Fee Status)
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-rose-700 tracking-tight">
                  Fee: ₹{consultationFee} • UNPAID (अवैतनिक / भुगतान शेष)
                </div>
                <p className="text-[11px] text-rose-800 font-semibold">
                  नोट: यह शुल्क क्लिनिक पर परामर्श के समय देय है।
                </p>
              </div>

              {/* Footer Stamp & Sign */}
              <div className="pt-6 border-t-2 border-slate-200 flex items-end justify-between text-xs text-slate-700">
                <div>
                  <p className="font-black text-teal-950 text-sm">Dr. Jitendra Kumar</p>
                  <p className="text-[11px] text-slate-600">Consultant Orthopedic & Physiotherapist</p>
                  <p className="text-[10px] text-slate-400 font-mono">Maa Janki Clinic Official Slip</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="h-12 border-b-2 border-dashed border-slate-400 w-36 mx-auto flex items-center justify-center">
                    <span className="text-[10px] text-slate-400 italic">Signature / Stamp</span>
                  </div>
                  <p className="text-[10px] font-black text-teal-900 uppercase tracking-wider">Authorized Signature</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSlipModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                बंद करें
              </button>
              <button
                onClick={() => {
                  const slipElement = document.getElementById('printable-appointment-slip');
                  if (slipElement) {
                    const printWin = window.open('', '_blank', 'width=850,height=1100');
                    if (printWin) {
                      printWin.document.write(`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <meta charset="utf-8">
                            <title>OPD Appointment Prescription Slip - Maa Janki Clinic</title>
                            <style>
                              @page { size: A4 portrait; margin: 6mm; }
                              html, body { height: 100%; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; color: #0f172a; background: #fff; }
                              * { box-sizing: border-box; }
                              .slip-box { width: 100%; max-width: 720px; margin: 0 auto; border: 2px solid #0f766e; padding: 14px 18px; border-radius: 12px; page-break-inside: avoid; page-break-after: avoid; }
                              .header { border-bottom: 2px solid #0f766e; padding-bottom: 8px; margin-bottom: 10px; }
                              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
                              .box { background: #f8fafc; padding: 6px 10px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 6px; }
                              .label { font-size: 10px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 2px; }
                              .val { font-size: 13px; color: #0f172a; font-weight: 800; }
                              .fee-box { background: #fff1f2; border: 1.5px solid #fb7185; padding: 8px; border-radius: 8px; text-align: center; margin-top: 8px; margin-bottom: 8px; }
                              .footer { margin-top: 14px; border-top: 1.5px dashed #94a3b8; padding-top: 8px; display: flex; justify-content: space-between; align-items: flex-end; }
                              @media print {
                                body { background: #fff; }
                                .slip-box { border: 2px solid #000; box-shadow: none; max-height: 280mm; }
                              }
                            </style>
                          </head>
                          <body>
                            <div class="slip-box">
                              ${slipElement.innerHTML}
                            </div>
                            <script>
                              window.onload = function() {
                                setTimeout(function() {
                                  window.print();
                                }, 400);
                              }
                            </script>
                          </body>
                        </html>
                      `);
                      printWin.document.close();
                    }
                  } else {
                    window.print();
                  }
                }}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>प्रिंट / डाउनलोड करें (Print / PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
