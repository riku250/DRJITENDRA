import React, { useState } from 'react';
import { X, Search, Clock, CheckCircle2, AlertCircle, XCircle, Phone } from 'lucide-react';
import { api } from '../services/api';

interface TrackAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultQuery?: string;
  primaryPhone?: string;
}

export const TrackAppointmentModal: React.FC<TrackAppointmentModalProps> = ({
  isOpen,
  onClose,
  defaultQuery = '',
  primaryPhone = '9525719654'
}) => {
  const [query, setQuery] = useState(defaultQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{
    id: string;
    service: string;
    preferred_date: string;
    preferred_time: string;
    status: string;
    created_at: string;
  }> | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      setError('कृपया मोबाइल नंबर या Appointment ID दर्ज करें।');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    const res = await api.trackAppointment(query.trim());
    setLoading(false);

    if (res.success && res.data) {
      if (res.data.length === 0) {
        setError('इस विवरण से कोई अपॉइंटमेंट नहीं मिला। कृपया नंबर जांचें अथवा क्लिनिक से संपर्क करें।');
      } else {
        setResults(res.data);
      }
    } else {
      setError(res.error || 'खोजने में समस्या आई।');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Confirmed (स्वीकृत)</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Completed (संपन्न)</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Cancelled (रद्द)</span>
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending (समीक्षाधीन)</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Appointment Status Track करें</h3>
              <p className="text-xs text-slate-500">अपना रजिस्टर्ड मोबाइल नंबर या ID डालें</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              id="track-query-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="10 अंकों का मोबाइल नंबर या APT-..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              {loading ? 'खोज रहे हैं...' : 'खोजें'}
            </button>
          </form>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {results && results.length > 0 && (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {results.map((apt) => (
                <div key={apt.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500">{apt.id}</span>
                    {getStatusBadge(apt.status)}
                  </div>
                  <div className="text-sm font-bold text-slate-800">{apt.service}</div>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <div>तारीख: <span className="font-semibold text-slate-800">{apt.preferred_date}</span></div>
                    <div>समय: <span className="font-semibold text-slate-800">{apt.preferred_time}</span></div>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/80">
                    {apt.status === 'Pending' && 'क्लिनिक द्वारा पुष्टि के लिए शीघ्र संपर्क किया जाएगा।'}
                    {apt.status === 'Confirmed' && 'कृपया निर्धारित समय पर क्लिनिक पहुंचें।'}
                    {apt.status === 'Completed' && 'यह अपॉइंटमेंट संपन्न हो चुका है।'}
                    {apt.status === 'Cancelled' && 'यह अपॉइंटमेंट रद्द कर दिया गया है।'}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>किसी सहायता के लिए:</span>
            <a
              href={`tel:${primaryPhone}`}
              className="inline-flex items-center gap-1 text-teal-700 font-bold hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{primaryPhone}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
