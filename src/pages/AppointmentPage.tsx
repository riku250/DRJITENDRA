import React, { useState } from 'react';
import { 
  Calendar, Clock, ShieldCheck, FileCheck, 
  HelpCircle, Phone, Search, CheckCircle2 
} from 'lucide-react';
import { ClinicSettings } from '../types';
import { AppointmentFormSection } from '../components/AppointmentFormSection';
import { TrackAppointmentModal } from '../components/TrackAppointmentModal';

interface AppointmentPageProps {
  settings: ClinicSettings | null;
  onNavigate: (page: string) => void;
  defaultService?: string;
}

export const AppointmentPage: React.FC<AppointmentPageProps> = ({
  settings,
  onNavigate,
  defaultService
}) => {
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [createdAptId, setCreatedAptId] = useState<string | null>(null);

  const primaryPhone = settings?.primary_phone || '9525719654';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button onClick={() => onNavigate('home')} className="hover:text-teal-700">Home</button>
          <span>/</span>
          <span className="text-slate-800">Book Appointment</span>
        </div>

        {/* Quick Track Button */}
        <button
          onClick={() => setIsTrackModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Status Track करें</span>
        </button>
      </div>

      {/* Main Form Section */}
      <AppointmentFormSection
        primaryPhone={primaryPhone}
        defaultService={defaultService}
        consultationFee={settings?.consultation_fee || 100}
        onNavigate={onNavigate}
        onSuccessSubmitted={(id) => {
          setCreatedAptId(id);
        }}
      />

      {/* Patient Preparation Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">पुरानी जांच रिपोर्ट साथ लाएं</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            यदि आपके पास कोई पुराना एक्स-रे, एमआरआई, सीटी स्कैन या रक्त जांच की रिपोर्ट है, तो परामर्श के समय अवश्य साथ रखें।
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">समय से 10 मिनट पहले पहुंचें</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            निर्धारित समय से 10 मिनट पूर्व क्लिनिक पहुंचने से कागजी कार्यवाही और रजिस्ट्रेशन सुगमता से संपन्न हो जाता है।
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">पुष्टि (Confirmation) कॉल</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            फॉर्म सबमिट करने के बाद हमारे क्लिनिक समन्वयक द्वारा समय की पुष्टि हेतु आपसे फोन पर संपर्क किया जाएगा।
          </p>
        </div>
      </div>

      {/* Track Modal */}
      <TrackAppointmentModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        defaultQuery={createdAptId || ''}
        primaryPhone={primaryPhone}
      />
    </div>
  );
};
