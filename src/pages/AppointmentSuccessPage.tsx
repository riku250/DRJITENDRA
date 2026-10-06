import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, Calendar, User, Phone, MapPin, Mail, 
  Printer, Download, MessageCircle, ArrowLeft, ShieldCheck, 
  AlertCircle, Activity, Sparkles, Building2, Stethoscope 
} from 'lucide-react';
import { api } from '../services/api';
import { Appointment } from '../types';

interface AppointmentSuccessPageProps {
  appointmentId?: string;
  onNavigate: (page: string) => void;
}

export const AppointmentSuccessPage: React.FC<AppointmentSuccessPageProps> = ({ 
  appointmentId: initialAppointmentId, 
  onNavigate 
}) => {
  const [appointmentId, setAppointmentId] = useState<string | null>(initialAppointmentId || null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Extract appointment ID from hash/search if not passed as prop
    let idToFetch = initialAppointmentId;
    if (!idToFetch) {
      const hash = window.location.hash;
      const match = hash.match(/[?&]id=([^&]+)/);
      if (match) {
        idToFetch = decodeURIComponent(match[1]);
      } else {
        // Fallback to latest booked appointment ID in localStorage
        idToFetch = localStorage.getItem('last_appointment_id');
      }
    }

    if (idToFetch) {
      setAppointmentId(idToFetch);
      fetchAppointmentDetails(idToFetch);
    } else {
      setLoading(false);
      setError('कोई Appointment ID नहीं मिली।');
    }
  }, [initialAppointmentId]);

  const fetchAppointmentDetails = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAppointmentDetail(id);
      if (res.success && res.data) {
        setAppointment(res.data);
      } else {
        setError(res.error || 'Appointment नहीं मिली।');
      }
    } catch (err: any) {
      setError(err?.message || 'Appointment details load करने में समस्या आई।');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const slipElement = document.querySelector('.printable-slip');
    if (slipElement) {
      const printWin = window.open('', '_blank', 'width=850,height=1100');
      if (printWin) {
        printWin.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>OPD Prescription Slip - Maa Janki Clinic</title>
              <style>
                @page { size: A4 portrait; margin: 6mm; }
                body { font-family: system-ui, -apple-system, sans-serif; background: #ffffff; color: #0f172a; margin: 0; padding: 0; font-size: 11px; line-height: 1.35; }
                .printable-slip { width: 100%; max-width: 200mm; margin: 0 auto; box-sizing: border-box; background: #ffffff !important; border: 2px solid #0f766e !important; padding: 12px 16px !important; border-radius: 8px; page-break-after: avoid; page-break-inside: avoid; }
                @media print {
                  body { background: #ffffff; }
                  .printable-slip { border: 2px solid #000 !important; box-shadow: none !important; }
                }
              </style>
            </head>
            <body>
              <div class="printable-slip">
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
  };

  const handleDownloadPDF = () => {
    handlePrint(); // Opens A4 print dialog where users can select "Save as PDF"
  };

  const handleWhatsAppShare = () => {
    if (!appointment) return;
    const text = `🏥 *मां जानकी एक्स-रे एवं फिजियोथेरेपी क्लिनिक*
📍 *OPD Appointment Confirmation Slip*

👤 *मरीज़ का नाम:* ${appointment.patient_name}
🆔 *Appointment ID:* ${appointment.id}
🩺 *विभागीय सेवा:* ${appointment.service}
📅 *तारीख:* ${appointment.preferred_date}
⏰ *समय:* ${appointment.preferred_time}
👨‍⚕️ *डॉक्टर:* Dr. Jitendra Kumar (BPT, BOTT)
💰 *परामर्श शुल्क:* ₹${appointment.consultation_fee || 100} (${appointment.payment_status || 'UNPAID'})
📊 *स्थिति:* ${appointment.status}

📞 *हेल्पलाइन:* 9525719654, 7492022733
📍 *पता:* सृष्टि ज्योति पब्लिक स्कूल के सामने, मेन रोड, पूजाहां पत्जीरवा चौक`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  // Status color badges
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Confirmed':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">● Confirmed (स्वीकृत)</span>;
      case 'Completed':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">● Completed (संपन्न)</span>;
      case 'Cancelled':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">● Cancelled (रद्द)</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">● Pending (समीक्षाधीन)</span>;
    }
  };

  const getPaymentBadge = (payStatus?: string) => {
    switch (payStatus?.toUpperCase()) {
      case 'PAID':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold">✓ भुगतान प्राप्त (PAID)</span>;
      case 'PENDING':
        return <span className="bg-yellow-100 text-yellow-800 border border-yellow-300 px-3 py-1 rounded-full text-xs font-bold">भुगतान सत्यापन लंबित (Pending)</span>;
      default:
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1 rounded-full text-xs font-bold">अवैतनिक / भुगतान शेष (Unpaid)</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-teal-600 border-t-transparent animate-spin mx-auto"></div>
          <h2 className="text-lg font-bold text-slate-800">Appointment Details Loading...</h2>
          <p className="text-xs text-slate-500">कृपया प्रतीक्षा करें, आपकी पर्ची लोड हो रही है।</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900">Appointment नहीं मिली</h2>
            <p className="text-xs text-slate-600">
              {error || 'माफ कीजिए, यह अपॉइंटमेंट रिकॉर्ड उपलब्ध नहीं है या हटा दिया गया है।'}
            </p>
          </div>
          <div className="p-3 bg-teal-50 rounded-xl text-xs text-teal-900 font-medium">
            सहायता के लिए संपर्क करें: <strong>9525719654, 7492022733</strong>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-md"
          >
            ← Back to Home (मुख्य पृष्ठ पर जाएं)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/80 py-8 px-4 sm:px-6 print:p-0 print:bg-white">
      {/* Print Stylesheet injection */}
      <style>{`
        @page { size: A4 portrait; margin: 6mm; }
        @media print {
          body { background: white !important; color: black !important; font-size: 11px !important; }
          .no-print { display: none !important; }
          .printable-slip { box-shadow: none !important; border: 2px solid #0f172a !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; padding: 16px !important; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Navigation & Action Buttons (Hidden in Print) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-teal-700 transition-colors bg-slate-100 hover:bg-teal-50 px-4 py-2 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Website</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* ======================================== */}
        {/* PROFESSIONAL PRESCRIPTION PAD APPOINTMENT SLIP */}
        {/* ======================================== */}
        <div className="printable-slip bg-white rounded-2xl p-6 sm:p-8 border-2 border-teal-900 shadow-xl space-y-5 text-slate-900 relative overflow-hidden">
          {/* Watermark Caduceus / Medical Symbol in Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none select-none">
            <span className="text-[220px]">⚕️</span>
          </div>

          {/* Success Notification Banner (Hidden in Print) */}
          <div className="no-print bg-teal-50 border border-teal-200 rounded-xl p-3 text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 text-teal-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Appointment Booked Successfully / आपकी अपॉइंटमेंट सुरक्षित हो गई है</span>
            </div>
          </div>

          {/* Top Letterhead Header */}
          <div className="border-b-3 border-teal-900 pb-4 space-y-3">
            {/* Clinic Main Title Banner */}
            <div className="text-center bg-gradient-to-r from-amber-500 via-orange-500 to-teal-700 text-white py-2.5 px-4 rounded-xl shadow-xs">
              <h1 className="text-xl sm:text-2xl font-black tracking-wide">
                माँ जानकी एक्स-रे एवं फिजियोथेरेपी क्लिनिक
              </h1>
              <p className="text-[11px] font-semibold tracking-wider opacity-95">
                Maa Janki X-Ray, Orthopedic & Physiotherapy Clinic
              </p>
            </div>

            {/* Doctor Info & Reg No Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center pt-2 text-xs">
              {/* Left Doctor Info */}
              <div className="text-left space-y-0.5 bg-teal-50/70 p-2.5 rounded-lg border border-teal-200">
                <p className="font-black text-teal-950 text-sm">डॉ. जितेन्द्र कुमार</p>
                <p className="text-[10px] text-teal-900 font-bold">BPT (APP), BOTT (Ranchi), CMS & ED</p>
                <p className="text-[10px] text-slate-600">हड्डी, जोड़ व नस रोग विशेषज्ञ</p>
              </div>

              {/* Center Reg No & Logo */}
              <div className="text-center space-y-1">
                <div className="w-12 h-12 mx-auto bg-teal-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                  ⚕️
                </div>
                <span className="inline-block bg-teal-900 text-white text-[11px] font-mono font-bold px-3 py-0.5 rounded-full shadow-2xs">
                  Reg. No.: 15504/24
                </span>
              </div>

              {/* Right Doctor Info */}
              <div className="text-right space-y-0.5 bg-teal-50/70 p-2.5 rounded-lg border border-teal-200">
                <p className="font-black text-teal-950 text-sm">Dr. Jitendra Kumar</p>
                <p className="text-[10px] text-teal-900 font-bold">Orthopedic & Physiotherapy Consultant</p>
                <p className="text-[10px] text-slate-600">Advanced Pain Management</p>
              </div>
            </div>

            <div className="text-center text-[11px] font-semibold text-slate-700 pt-1">
              📍 पता: सृष्टि ज्योति पब्लिक स्कूल के सामने, मेन रोड, पूजाहां पत्जीरवा चौक
            </div>
          </div>

          {/* Patient Details Prescription Line */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-300 space-y-2 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-500 font-medium">Name (नाम):</span>{' '}
                <span className="font-black text-slate-900 border-b border-dashed border-slate-400 pb-0.5 inline-block w-full">{appointment.patient_name}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Age / Gender (आयु/लिंग):</span>{' '}
                <span className="font-bold text-slate-900">{appointment.age || '—'} वर्ष ({appointment.gender || '—'})</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Mobile (मोबाइल):</span>{' '}
                <span className="font-bold text-slate-900 font-mono">{appointment.mobile || '—'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-200">
              <div>
                <span className="text-slate-500 font-medium">Appointment ID:</span>{' '}
                <span className="font-mono font-bold text-teal-900">{appointment.id}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Date & Time:</span>{' '}
                <span className="font-bold text-slate-900">{appointment.preferred_date} ({appointment.preferred_time})</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Status / स्थिति:</span>{' '}
                <span className="font-bold text-teal-800">{appointment.status || 'Pending'}</span>
              </div>
            </div>
          </div>

          {/* Main Prescription Area: Left Sidebar (Vitals/Impression) & Right Main Body */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[320px]">
            {/* Left Column: Impression, Pulse, BP, Fee */}
            <div className="md:col-span-4 border-r-2 border-dashed border-slate-300 pr-3 space-y-3 text-xs">
              <div className="space-y-2">
                <div className="font-black text-teal-950 uppercase tracking-wide border-b border-slate-300 pb-1">Vitals & Examination</div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Impression:</span>
                  <span className="font-semibold text-slate-900">{appointment.service || 'General OPD'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Pulse:</span>
                  <span className="text-slate-400">................</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">B.P.:</span>
                  <span className="text-slate-400">................</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Tem.:</span>
                  <span className="text-slate-400">................</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Weight:</span>
                  <span className="text-slate-400">................</span>
                </div>
              </div>

              {appointment.problem && (
                <div className="pt-2">
                  <span className="font-bold text-slate-700 block text-[11px]">Chief Complaint / Problem:</span>
                  <p className="text-slate-900 font-medium mt-0.5 bg-slate-50 p-2 rounded border border-slate-200">{appointment.problem}</p>
                </div>
              )}

              {/* Fee Box */}
              <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-300 text-center space-y-0.5">
                <div className="text-[10px] font-bold text-rose-900 uppercase">Consultation Fee</div>
                <div className="text-xl font-black font-mono text-rose-700">₹{appointment.consultation_fee || 100}</div>
                <div className="text-[10px] text-rose-800 font-semibold">{appointment.payment_status || 'UNPAID (क्लिनिक पर देय)'}</div>
              </div>
            </div>

            {/* Right Column: Rx Area */}
            <div className="md:col-span-8 pl-1 space-y-4">
              <div className="text-2xl font-black text-teal-900 font-serif">R<span className="text-lg font-normal">x</span></div>
              <div className="min-h-[220px] text-slate-500 text-sm space-y-2">
                <p className="italic text-xs text-slate-400">--- Doctor consultation notes & prescribed medicines will be written here during clinic visit ---</p>
                <div className="p-3 bg-teal-50/40 rounded-xl border border-teal-200 text-teal-950 text-xs space-y-1">
                  <p className="font-bold">✓ आपकी अपॉइंटमेंट दर्ज है।</p>
                  <p className="text-[11px] text-slate-700">कृपया निर्धारित समय पर अपनी पुरानी रिपोर्ट्स और इस पर्ची (Appointment ID: {appointment.id}) के साथ क्लिनिक पधारें।</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Notice */}
          <div className="pt-3 border-t border-slate-300 text-center text-[11px] font-bold text-rose-700 uppercase tracking-wider">
            Not Valid For Medico Legal Purpose
          </div>

          {/* Dark Footer Bar with Contacts & Notes */}
          <div className="bg-slate-900 text-white p-3.5 rounded-xl space-y-2 text-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="font-bold text-amber-400 text-[11px]">📞 संपर्क नंबर (Contact):</div>
                <div className="font-mono font-bold text-xs">9525719654, 7492022733</div>
              </div>
              <div className="text-center sm:text-right text-[11px] text-slate-300 space-y-0.5">
                <p>1. यहाँ ऑक्सीजन, निमुलाइजर, सक्शन की सुविधा उपलब्ध है।</p>
                <p>2. यह पर्ची केवल 21 दिनों के लिए मान्य है।</p>
              </div>
            </div>
          </div>

          {/* Signature Footer */}
          <div className="flex items-end justify-between pt-2 text-xs text-slate-700">
            <div>
              <p className="font-black text-teal-950 text-sm">Dr. Jitendra Kumar</p>
              <p className="text-[10px] text-slate-500">BPT (APP), BOTT, CMS & ED</p>
            </div>
            <div className="text-center">
              <div className="h-10 border-b-2 border-dashed border-slate-400 w-32 mx-auto"></div>
              <p className="text-[10px] font-bold text-slate-600 mt-1">Authorized Signature / Stamp</p>
            </div>
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="no-print text-center pt-2 pb-12">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
          >
            <span>← Back to Website (मुख्य पृष्ठ पर लौटें)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
