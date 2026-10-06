import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, User, Phone, CheckCircle2, 
  XCircle, AlertCircle, Trash2, Edit3, Settings, 
  MessageSquare, HelpCircle, Save, LogOut, Search, 
  ExternalLink, Plus, RefreshCw, Key, TrendingUp, 
  DollarSign, Receipt, ImageIcon, ZoomIn, X, Eye
} from 'lucide-react';
import { Appointment, ServiceItem, ClinicSettings, FaqItem, ContactMessage } from '../types';
import { api } from '../services/api';
import { AdminSalesManager } from '../components/admin/AdminSalesManager';
import { AdminGalleryManager } from '../components/admin/AdminGalleryManager';

interface AdminDashboardProps {
  currentUser: any;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onDataRefresh?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onNavigate,
  onDataRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'sales' | 'gallery' | 'appointments' | 'services' | 'settings' | 'messages' | 'faqs' | 'password'>('appointments');
  
  // Data states
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Settings editing state
  const [settingsForm, setSettingsForm] = useState<ClinicSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
  const [previewDoctorPicModal, setPreviewDoctorPicModal] = useState<boolean>(false);
  const [doctorPicInputUrl, setDoctorPicInputUrl] = useState<string>('');

  // FAQ editing/adding
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // Fetch initial admin data
  const fetchData = async () => {
    setLoading(true);
    const [aptRes, srvRes, setRes, msgRes, faqRes] = await Promise.all([
      api.getAppointments(),
      api.getServices(),
      api.getSettings(),
      api.getMessages(),
      api.getFaqs()
    ]);
    setLoading(false);

    if (aptRes.success && aptRes.data) setAppointments(aptRes.data);
    if (srvRes.success && srvRes.data) setServices(srvRes.data);
    if (setRes.success && setRes.data) {
      setSettings(setRes.data);
      setSettingsForm(setRes.data);
    }
    if (msgRes.success && msgRes.data) setMessages(msgRes.data);
    if (faqRes.success && faqRes.data) setFaqs(faqRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Appointment Status Update
  const handleUpdateStatus = async (id: string, status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled') => {
    // Instantly update UI optimistically
    setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
    showNotification(`Appointment ${id} status updated to ${status}`);

    try {
      const res = await api.updateAppointmentStatus(id, status);
      if (res && res.success && res.data) {
        setAppointments(appointments.map(a => a.id === id ? res.data! : a));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
    // Background refresh
    fetchData();
  };

  // Delete Appointment
  const handleDeleteAppointment = async (id: string) => {
    if (!window.confirm(`क्या आप वाकई अपॉइंटमेंट ${id} को हटाना चाहते हैं?`)) return;
    setAppointments(appointments.filter(a => a.id !== id));
    showNotification(`Appointment ${id} deleted`);
    try {
      await api.deleteAppointment(id);
    } catch (err) {
      console.error('Error deleting appointment:', err);
    }
    fetchData();
  };

  // Appointment Payment Collection
  const handleUpdatePayment = async (id: string, payment_status: 'Paid' | 'Unpaid', payment_mode: string = 'Cash') => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, payment_status, payment_mode } : a));
    showNotification(`परामर्श शुल्क ₹100 (${payment_mode}) सफलतापूर्वक दर्ज हुआ`);
    try {
      const res = await api.updateAppointmentPayment(id, payment_status, payment_mode);
      if (res.success && res.data) {
        setAppointments(prev => prev.map(a => a.id === id ? res.data! : a));
      }
    } catch (err) {
      console.error('Error updating payment:', err);
    }
    fetchData();
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    setSavingSettings(true);
    const res = await api.updateSettings(settingsForm);
    setSavingSettings(false);
    if (res.success && res.data) {
      setSettings(res.data);
      showNotification('क्लिनिक सेटिंग्स सफलतापूर्वक सुरक्षित कर ली गईं।');
      if (onDataRefresh) onDataRefresh();
    } else {
      alert(res.error || 'सेटिंग्स सेव करने में समस्या आई।');
    }
  };

  // Add FAQ
  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
    const updated = [...faqs, {
      id: faqs.length > 0 ? Math.max(...faqs.map(f => f.id)) + 1 : 1,
      question: newFaqQuestion.trim(),
      answer: newFaqAnswer.trim()
    }];
    const res = await api.updateFaqs(updated);
    if (res.success && res.data) {
      setFaqs(res.data);
      setNewFaqQuestion('');
      setNewFaqAnswer('');
      showNotification('नया प्रश्न जोड़ दिया गया।');
      if (onDataRefresh) onDataRefresh();
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (id: number) => {
    if (!window.confirm('क्या आप वाकई इस प्रश्न को हटाना चाहते हैं?')) return;
    const updated = faqs.filter(f => f.id !== id);
    const res = await api.updateFaqs(updated);
    if (res.success && res.data) {
      setFaqs(res.data);
      showNotification('प्रश्न हटा दिया गया।');
      if (onDataRefresh) onDataRefresh();
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);
    if (newPassword.length < 6) {
      setPasswordStatus('नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }
    const res = await api.changePassword(oldPassword, newPassword);
    if (res.success) {
      setPasswordStatus('पासवर्ड सफलतापूर्वक बदल दिया गया!');
      setOldPassword('');
      setNewPassword('');
    } else {
      setPasswordStatus(res.error || 'पासवर्ड बदलने में समस्या आई।');
    }
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesDoctor = doctorFilter === 'all' || (apt.doctor_name || 'Dr. Jitendra Kumar').includes(doctorFilter);
    const matchesDate = !dateFilter || apt.preferred_date === dateFilter;
    const matchesSearch = searchTerm === '' ||
      apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.mobile.includes(searchTerm) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDoctor && matchesDate && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100/70 pb-24">
      {/* Top Admin Navigation Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="font-black text-lg tracking-tight">मां जानकी एक्स-रे Admin</span>
            <span className="hidden sm:inline-block text-xs bg-slate-800 text-teal-400 px-2.5 py-0.5 rounded-full border border-slate-700">
              Admin: {currentUser?.username || 'admin'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
            >
              वेबसाइट देखें
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 px-3 py-1.5 rounded-lg border border-rose-800/60 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>लॉगआउट</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification banner */}
      {actionMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between animate-in fade-in">
            <span>✓ {actionMessage}</span>
            <button onClick={() => setActionMessage(null)} className="text-white/80 hover:text-white">✕</button>
          </div>
        </div>
      )}

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'sales', label: 'कुल बिक्री / Total Sell (Revenue)', icon: TrendingUp },
            { id: 'gallery', label: 'फोटो गैलरी (Gallery)', icon: ImageIcon },
            { id: 'appointments', label: `अपॉइंटमेंट्स (${appointments.length})`, icon: Calendar },
            { id: 'services', label: `सेवाएं व दरें (${services.length})`, icon: Edit3 },
            { id: 'settings', label: 'क्लिनिक सूचना व समय', icon: Settings },
            { id: 'messages', label: `पूछताछ संदेश (${messages.length})`, icon: MessageSquare },
            { id: 'faqs', label: `अक्सर पूछे जाने वाले सवाल (${faqs.length})`, icon: HelpCircle },
            { id: 'supabase', label: 'Supabase RLS & Policies', icon: Key },
            { id: 'password', label: 'पासवर्ड बदलें', icon: Key }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 0A: TOTAL SELL / SALES REVENUE */}
        {activeTab === 'sales' && (
          <AdminSalesManager onNotification={showNotification} />
        )}

        {/* TAB 0C: GALLERY MANAGER */}
        {activeTab === 'gallery' && (
          <AdminGalleryManager onNotification={showNotification} onDataRefresh={onDataRefresh} />
        )}

        {/* TAB 1: APPOINTMENTS MANAGER */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {/* Stats Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Appointments</span>
                <div className="text-2xl font-black text-slate-900">{appointments.length}</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs space-y-1">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending</span>
                <div className="text-2xl font-black text-amber-800">{appointments.filter(a => a.status === 'Pending').length}</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Confirmed</span>
                <div className="text-2xl font-black text-emerald-800">{appointments.filter(a => a.status === 'Confirmed' || a.status === 'Completed').length}</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/30 shadow-xs space-y-1">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Cancelled</span>
                <div className="text-2xl font-black text-rose-800">{appointments.filter(a => a.status === 'Cancelled').length}</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <span className="text-xs font-bold text-slate-500 mr-1">स्थिति:</span>
                  {['all', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        statusFilter === st
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'all' ? 'सभी' : st}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="मरीज़ का नाम, फोन या ID..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Advanced Filters (Date & Doctor) */}
              <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-600">डॉक्टर फ़िल्टर:</span>
                  <select
                    value={doctorFilter}
                    onChange={(e) => setDoctorFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 font-medium bg-white"
                  >
                    <option value="all">सभी डॉक्टर</option>
                    <option value="Jitendra">Dr. Jitendra Kumar</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-600">दिनांक फ़िल्टर:</span>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 font-medium bg-white"
                  />
                  {dateFilter && (
                    <button
                      onClick={() => setDateFilter('')}
                      className="text-rose-600 font-bold hover:underline"
                    >
                      रीसेट
                    </button>
                  )}
                </div>

                <div className="ml-auto text-slate-500 font-medium">
                  कुल मिलान: <strong className="text-slate-800">{filteredAppointments.length}</strong>
                </div>
              </div>
            </div>

            {/* Appointments Table / Cards */}
            {loading ? (
              <div className="text-center py-12 text-slate-500 text-sm">लोड हो रहा है...</div>
            ) : filteredAppointments.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
                कोई अपॉइंटमेंट उपलब्ध नहीं है।
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredAppointments.map((apt) => {
                  const whatsappConfirmationText = encodeURIComponent(
                    `नमस्ते ${apt.patient_name} जी,\nमां जानकी एक्स-रे एवं क्लिनिक में आपका अपॉइंटमेंट (ID: ${apt.id}) दिनांक ${apt.preferred_date} को ${apt.preferred_time} के लिए स्वीकृत किया गया है।\nक्लिनिक पता: सृष्टि ज्योति पब्लिक स्कूल के सामने, मेन रोड, पूजाहां पत्जीरवा चौक।\nफोन: 9525719654`
                  );
                  const whatsappLink = `https://wa.me/91${apt.mobile}?text=${whatsappConfirmationText}`;

                  return (
                    <div
                      key={apt.id}
                      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 hover:border-teal-300 transition-all"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                              {apt.id}
                            </span>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                              apt.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                              apt.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              ● {apt.status}
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-slate-900">
                            {apt.patient_name} ({apt.age} वर्ष, {apt.gender})
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp पर पुष्टि भेजें</span>
                          </a>
                          <a
                            href={`tel:${apt.mobile}`}
                            className="inline-flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{apt.mobile}</span>
                          </a>
                          <button
                            onClick={() => handleDeleteAppointment(apt.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="हटाएं"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <span className="text-slate-500 font-medium">सेवा / विभाग:</span>
                          <div className="font-bold text-slate-800 mt-0.5">{apt.service}</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <span className="text-slate-500 font-medium">पसंदीदा समय:</span>
                          <div className="font-bold text-slate-800 mt-0.5">{apt.preferred_date} ({apt.preferred_time})</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <span className="text-slate-500 font-medium">अनुरोध दर्ज समय:</span>
                          <div className="font-medium text-slate-700 mt-0.5">{new Date(apt.created_at).toLocaleString('hi-IN')}</div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-700 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                        <strong>समस्या / कारण:</strong> {apt.problem}
                        {apt.additional_message && (
                          <div className="text-slate-500 mt-1">
                            <strong>अतिरिक्त टिप्पणी:</strong> {apt.additional_message}
                          </div>
                        )}
                      </div>

                      {/* Payment Collection & Fee Status */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-teal-700" />
                          <span className="font-bold text-slate-700">परामर्श शुल्क (OPD Fee):</span>
                          <span className="font-mono font-black text-slate-900 text-sm">₹{apt.consultation_fee || 100}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            apt.payment_status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {apt.payment_status === 'Paid' ? `✓ Paid (${apt.payment_mode || 'Cash'})` : '● Unpaid (बाकी)'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {apt.payment_status !== 'Paid' ? (
                            <>
                              <button
                                onClick={() => handleUpdatePayment(apt.id, 'Paid', 'Cash')}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                              >
                                💰 ₹100 नकद (Cash) प्राप्त
                              </button>
                              <button
                                onClick={() => handleUpdatePayment(apt.id, 'Paid', 'UPI')}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
                              >
                                📱 ₹100 UPI प्राप्त
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleUpdatePayment(apt.id, 'Unpaid')}
                              className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                            >
                              भुगतान अनमार्क करें
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Status Changing Button Group */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <span className="text-xs font-bold text-slate-500 mr-1">स्थिति बदलें:</span>
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'Confirmed')}
                          disabled={apt.status === 'Confirmed'}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          Confirm (स्वीकृत करें)
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'Completed')}
                          disabled={apt.status === 'Completed'}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          Completed (परामर्श संपन्न)
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'Cancelled')}
                          disabled={apt.status === 'Cancelled'}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-600 hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          Cancel (रद्द करें)
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'Pending')}
                          disabled={apt.status === 'Pending'}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-600 hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          Pending (समीक्षाधीन)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: SUPABASE RLS & POLICIES GUIDE */}
        {activeTab === 'supabase' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Supabase Row Level Security (RLS) & Policies</h2>
              <p className="text-xs text-slate-500">सुरक्षा निर्देश और डेटाबेस पॉलिसी सेटअप गाइड</p>
            </div>

            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-teal-900 space-y-2">
                <h4 className="font-bold flex items-center gap-2">
                  <Key className="w-4 h-4 text-teal-700" />
                  <span>सुरक्षा नियम (Security Rules)</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li><strong>Patients (Public):</strong> केवल नए अपॉइंटमेंट्स दर्ज (INSERT) कर सकते हैं।</li>
                  <li><strong>Admin (Authenticated):</strong> अपॉइंटमेंट्स देखने (SELECT), अपडेट करने (UPDATE) और हटाने (DELETE) के लिए अधिकृत हैं।</li>
                  <li><strong>Service Role Key:</strong> कभी भी फ्रंटएंड (Frontend) में उपयोग नहीं की जाती है।</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900">Supabase SQL Editor में चलाने के लिए कमांड:</h3>
                <pre className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-xs font-mono overflow-x-auto">
{`-- 1. Create appointments table
create table if not exists appointments (
  id uuid default gen_random_uuid() primary key,
  patient_name text not null,
  mobile text not null,
  age integer,
  gender text,
  service text not null,
  doctor_name text default 'Dr. Jitendra Kumar',
  problem text,
  preferred_date text not null,
  preferred_time text not null,
  status text default 'Pending',
  created_at timestamptz default now()
);

-- 2. Enable RLS
alter table appointments enable row level security;

-- 3. Policy: Allow public to insert appointments
create policy "Allow public to insert appointments"
  on appointments for insert
  with check (true);

-- 4. Policy: Allow authenticated admin to select, update, delete
create policy "Allow admin to select appointments"
  on appointments for select
  using (auth.role() = 'authenticated');

create policy "Allow admin to update appointments"
  on appointments for update
  using (auth.role() = 'authenticated');

create policy "Allow admin to delete appointments"
  on appointments for delete
  using (auth.role() = 'authenticated');`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SERVICES & PRICING */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">क्लिनिक सेवाएं व दरें</h2>
              <p className="text-xs text-slate-500">उपलब्ध 10 प्रमुख सेवाओं का विवरण (Price policy अनुसार)</p>
            </div>

            <div className="space-y-4">
              {services.map((srv, idx) => (
                <div key={srv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{idx + 1}. {srv.title_hi} ({srv.title_en})</h4>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">{srv.category}</span>
                  </div>
                  <p className="text-xs text-slate-600">{srv.description}</p>
                  <div className="text-[11px] text-teal-700 font-medium">
                    दर: {srv.price_display || 'क्लिनिक पर संपर्क करें'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CLINIC INFORMATION & TIMINGS */}
        {activeTab === 'settings' && settingsForm && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">क्लिनिक सूचना व समय सेटिंग्स</h2>
              <p className="text-xs text-slate-500">वेबसाइट पर प्रदर्शित फोन, पता, समय और गूगल मैप्स क्वेरी अपडेट करें</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">क्लिनिक नाम (हिंदी)</label>
                  <input
                    type="text"
                    value={settingsForm.clinic_name_hi}
                    onChange={(e) => setSettingsForm({ ...settingsForm, clinic_name_hi: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Clinic Name (English)</label>
                  <input
                    type="text"
                    value={settingsForm.clinic_name_en}
                    onChange={(e) => setSettingsForm({ ...settingsForm, clinic_name_en: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">प्राथमिक फोन (Primary Phone)</label>
                  <input
                    type="text"
                    value={settingsForm.primary_phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, primary_phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">द्वितीय फोन (Secondary Phone)</label>
                  <input
                    type="text"
                    value={settingsForm.secondary_phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, secondary_phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">ईमेल (Email)</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">पता पंक्ति 1</label>
                  <input
                    type="text"
                    value={settingsForm.address_line1}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address_line1: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">पता पंक्ति 2</label>
                  <input
                    type="text"
                    value={settingsForm.address_line2}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address_line2: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">शहर / चौक</label>
                  <input
                    type="text"
                    value={settingsForm.city}
                    onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">परामर्श समय (Opening Hours)</label>
                  <input
                    type="text"
                    value={settingsForm.opening_hours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, opening_hours: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">आपातकालीन सेवा विवरण</label>
                  <input
                    type="text"
                    value={settingsForm.emergency_service}
                    onChange={(e) => setSettingsForm({ ...settingsForm, emergency_service: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">डॉक्टर का नाम (Doctor Name)</label>
                <input
                  type="text"
                  value={settingsForm.doctor_name || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, doctor_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                  placeholder="उदा. Dr. Jitendra Kumar"
                />
              </div>

              <div className="space-y-4 bg-teal-50/60 p-5 sm:p-6 rounded-2xl border-2 border-teal-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-200/80 pb-3">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 bg-teal-200/80 px-2.5 py-0.5 rounded-full">
                      Doctor Profile Picture (HD Large Size)
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-1">
                      डॉक्टर की बड़ी फोटो (गैलरी से बड़ा फोटो अपलोड एवं प्रबंधन)
                    </h4>
                  </div>
                  <p className="text-xs text-teal-900 font-medium">
                    (यह बड़ी फोटो वेलकम स्क्रीन, डॉक्टर प्रोफाइल और होमपेज पर साफ दिखेगी)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Large Preview Box */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-2.5">
                    {settingsForm.doctor_image_url ? (
                      <div className="relative group w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-4 border-teal-600 shadow-xl bg-white shrink-0">
                        <img 
                          src={settingsForm.doctor_image_url} 
                          alt="Doctor Large Preview" 
                          className="w-full h-full object-cover object-top transition-transform group-hover:scale-105 duration-300" 
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewDoctorPicModal(true)}
                          className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                        >
                          <div className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-xs flex items-center gap-1.5 text-xs font-bold">
                            <ZoomIn className="w-4 h-4 text-cyan-300" />
                            <span>बड़ा ज़ूम देखें</span>
                          </div>
                        </button>
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-teal-800/80 backdrop-blur-xs text-[10px] font-bold text-white">
                          बड़ा फोटो सक्रिय
                        </div>
                      </div>
                    ) : (
                      <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-xs font-medium p-4 text-center">
                        <ImageIcon className="w-10 h-10 mb-2 text-slate-300" />
                        <span>फोटो अपलोड नहीं है</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {settingsForm.doctor_image_url && (
                        <button
                          type="button"
                          onClick={() => setPreviewDoctorPicModal(true)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-teal-300 text-teal-800 text-xs font-bold hover:bg-teal-50 shadow-2xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-600" />
                          <span>फुल साइज़ देखें</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setSettingsForm({
                            ...settingsForm,
                            doctor_image_url: 'https://kommodo.ai/i/FO7CYWP05Q4WRXPrY0yg'
                          });
                          showNotification('डिफ़ॉल्ट डॉक्टर फोटो सेट कर दी गई है।');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                      >
                        डिफ़ॉल्ट फोटो
                      </button>
                    </div>
                  </div>

                  {/* Upload Controls & URL Input */}
                  <div className="md:col-span-8 space-y-4">
                    {/* Gallery Large File Upload Button */}
                    <div className="p-4 bg-white rounded-xl border border-teal-200 shadow-2xs space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-black text-slate-900">
                            1. फोन या कंप्यूटर गैलरी से बड़ा फोटो अपलोड करें
                          </div>
                          <p className="text-[11px] text-slate-500">
                            हाई-डेफिनिशन (HD 1200px) इमेज सपोर्ट ताकि फोटो फटे नहीं।
                          </p>
                        </div>

                        <label className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-black px-5 py-3 rounded-xl text-xs cursor-pointer shadow-md active:scale-95 transition-all shrink-0">
                          <span>📁 गैलरी से बड़ा फोटो चुनें (Upload)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (uploadEvent) => {
                                  const img = new Image();
                                  img.onload = () => {
                                    const canvas = document.createElement('canvas');
                                    let width = img.width;
                                    let height = img.height;
                                    const MAX_DIM = 1200; // Increased to 1200 for Large High-Res Picture
                                    if (width > height && width > MAX_DIM) {
                                      height = Math.round((height * MAX_DIM) / width);
                                      width = MAX_DIM;
                                    } else if (height > MAX_DIM) {
                                      width = Math.round((width * MAX_DIM) / height);
                                      height = MAX_DIM;
                                    }
                                    canvas.width = width;
                                    canvas.height = height;
                                    const ctx = canvas.getContext('2d');
                                    ctx?.drawImage(img, 0, 0, width, height);
                                    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
                                    setSettingsForm({ ...settingsForm, doctor_image_url: dataUrl });
                                    showNotification('बड़ी डॉक्टर फोटो सफलतापूर्वक अपलोड हो गई है! नीचे "सेटिंग्स सेव करें" दबाएं।');
                                  };
                                  img.src = uploadEvent.target?.result as string;
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Direct Image URL Input */}
                    <div className="p-4 bg-white rounded-xl border border-teal-200 shadow-2xs space-y-2">
                      <div className="text-xs font-black text-slate-900">
                        2. या सीधे फोटो का वेब लिंक (URL) दर्ज करें
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          value={doctorPicInputUrl || settingsForm.doctor_image_url || ''}
                          onChange={(e) => setDoctorPicInputUrl(e.target.value)}
                          placeholder="https://images.example.com/doctor-photo.jpg"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (doctorPicInputUrl.trim()) {
                              setSettingsForm({ ...settingsForm, doctor_image_url: doctorPicInputUrl.trim() });
                              showNotification('फोटो लिंक लागू किया गया! अब नीचे सेव करें।');
                            }
                          }}
                          className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer"
                        >
                          लागू करें
                        </button>
                      </div>
                    </div>

                    {/* Aspect & Crop options */}
                    {settingsForm.doctor_image_url && (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                        <span className="font-bold text-teal-900">अनुपात मोड:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => showNotification('वर्ग 1:1 मोड चयनित किया गया।')}
                            className="px-3 py-1.5 bg-white text-teal-800 hover:bg-teal-100 font-bold rounded-lg border border-teal-300"
                          >
                            ⏹️ बड़ा वर्ग (1:1)
                          </button>
                          <button
                            type="button"
                            onClick={() => showNotification('पोर्ट्रेट 3:4 मोड चयनित किया गया।')}
                            className="px-3 py-1.5 bg-white text-teal-800 hover:bg-teal-100 font-bold rounded-lg border border-teal-300"
                          >
                            📱 पोर्ट्रेट (3:4)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSettingsForm({ ...settingsForm, doctor_image_url: '' });
                              showNotification('डॉक्टर फोटो हटाई गई।');
                            }}
                            className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-lg border border-rose-200"
                          >
                            🗑️ फोटो हटाएं
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ================================================= */}
              {/* CONSULTATION FEE (परामर्श शुल्क)                  */}
              {/* ================================================= */}
              <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-extrabold text-amber-950">
                    परामर्श शुल्क (Consultation Fee in ₹)
                  </label>
                  <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">
                    वर्तमान शुल्क: ₹{settingsForm.consultation_fee || 100}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-amber-900">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={settingsForm.consultation_fee || 100}
                      onChange={(e) => setSettingsForm({ ...settingsForm, consultation_fee: Number(e.target.value) || 0 })}
                      className="w-36 px-3 py-2 rounded-xl border border-amber-300 text-base font-black bg-white text-slate-900 focus:ring-2 focus:ring-amber-500"
                      placeholder="100"
                    />
                  </div>
                  <span className="text-xs text-amber-800 font-medium">
                    (यह शुल्क ऑनलाइन अपॉइंटमेंट बुकिंग, रसीद पर्ची, और WhatsApp स्लिप में स्वतः ₹100 अपडेट रहेगा)
                  </span>
                </div>
              </div>

              {/* ================================================= */}
              {/* RADIOGRAPHER (श्री उपेंद्र कुमार) PROFILE & PHOTO */}
              {/* ================================================= */}
              <div className="bg-cyan-50/70 p-5 rounded-2xl border border-cyan-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-black tracking-wider text-cyan-800 bg-cyan-200/80 px-2 py-0.5 rounded">
                      Radiographer Profile & Picture
                    </span>
                    <h4 className="text-base font-black text-cyan-950">
                      रेडियोग्राफर (श्री उपेंद्र कुमार) - प्रोफाइल एवं फोटो प्रबंधन
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">रेडियोग्राफर का नाम (Radiographer Name)</label>
                    <input
                      type="text"
                      value={settingsForm.radiographer_name || 'Mr. Upendra Kumar'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, radiographer_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium bg-white"
                      placeholder="Mr. Upendra Kumar"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">संस्थान / शैक्षणिक योग्यता (Institution)</label>
                    <input
                      type="text"
                      value={settingsForm.radiographer_institution || 'NIMS University, Jaipur'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, radiographer_institution: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium bg-white"
                      placeholder="NIMS University, Jaipur"
                    />
                  </div>
                </div>

                {/* Radiographer Photo Upload */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-slate-700">
                    रेडियोग्राफर की फोटो (गैलरी/डिवाइस से डायरेक्ट अपलोड व साइज़ एडजस्टमेंट)
                  </label>

                  <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-cyan-300 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      {/* Preview */}
                      <div className="flex items-center gap-4">
                        {settingsForm.radiographer_image_url ? (
                          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-cyan-600 shadow-md bg-white shrink-0 relative group">
                            <img
                              src={settingsForm.radiographer_image_url}
                              alt="Radiographer Preview"
                              className="w-full h-full object-cover object-top transition-transform"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-cyan-100/60 border-2 border-dashed border-cyan-300 flex items-center justify-center text-cyan-700 text-xs font-medium shrink-0">
                            फोटो नहीं है
                          </div>
                        )}

                        <div className="space-y-1">
                          <div className="text-xs font-bold text-slate-800">श्री उपेंद्र कुमार की फोटो अपलोड करें</div>
                          <p className="text-[11px] text-slate-500">
                            अपलोड की गई फोटो होमपेज और मि. उपेंद्र कुमार के प्रोफाइल पेज (/radiographer) पर तुरंत दिखेगी।
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {settingsForm.radiographer_image_url && (
                          <button
                            type="button"
                            onClick={() => {
                              setSettingsForm({ ...settingsForm, radiographer_image_url: '' });
                              showNotification('रेडियोग्राफर की फोटो हटा दी गई है।');
                            }}
                            className="px-3 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                            title="फोटो हटाएं"
                          >
                            🗑️ हटाएं
                          </button>
                        )}

                        <label className="inline-flex items-center gap-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold px-5 py-3 rounded-xl text-xs cursor-pointer shadow-md transition-all">
                          <span>📁 गैलरी से फोटो चुनें (Upload)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (uploadEvent) => {
                                  const img = new Image();
                                  img.onload = () => {
                                    const canvas = document.createElement('canvas');
                                    let width = img.width;
                                    let height = img.height;
                                    const MAX_DIM = 600;
                                    if (width > height && width > MAX_DIM) {
                                      height = Math.round((height * MAX_DIM) / width);
                                      width = MAX_DIM;
                                    } else if (height > MAX_DIM) {
                                      width = Math.round((width * MAX_DIM) / height);
                                      height = MAX_DIM;
                                    }
                                    canvas.width = width;
                                    canvas.height = height;
                                    const ctx = canvas.getContext('2d');
                                    ctx?.drawImage(img, 0, 0, width, height);
                                    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                                    setSettingsForm({ ...settingsForm, radiographer_image_url: dataUrl });
                                    showNotification('रेडियोग्राफर की तस्वीर सफलतापूर्वक गैलरी से अपलोड हो गई है! ऑटो-साइज़ लागू कर दिया गया है।');
                                  };
                                  img.src = uploadEvent.target?.result as string;
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {settingsForm.radiographer_image_url && (
                      <div className="pt-3 border-t border-cyan-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="font-bold text-cyan-900 flex items-center gap-1.5">
                          <span>✨ साइज़ एडजेस्टमेंट:</span>
                          <span className="bg-cyan-200 text-cyan-900 px-2 py-0.5 rounded text-[10px]">ऑटो-सेलेक्टेड</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => showNotification('ऑटो-फिट साइज़ लागू किया गया।')}
                            className="px-3 py-1.5 bg-white text-cyan-800 hover:bg-cyan-700 hover:text-white font-bold rounded-lg border border-cyan-300 shadow-xs transition-colors"
                          >
                            ⚡ ऑटो-साइज़ (Auto)
                          </button>
                          <button
                            type="button"
                            onClick={() => showNotification('वर्ग 1:1 अनुपात सेट किया गया।')}
                            className="px-3 py-1.5 bg-white text-cyan-800 hover:bg-cyan-700 hover:text-white font-bold rounded-lg border border-cyan-300 shadow-xs transition-colors"
                          >
                            ⏹️ वर्ग 1:1 (Square)
                          </button>
                          <button
                            type="button"
                            onClick={() => showNotification('पोर्ट्रेट 3:4 अनुपात सेट किया गया।')}
                            className="px-3 py-1.5 bg-white text-cyan-800 hover:bg-cyan-700 hover:text-white font-bold rounded-lg border border-cyan-300 shadow-xs transition-colors"
                          >
                            📱 पोर्ट्रेट 3:4 (Portrait)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Google Maps Search Query (नक्शा खोज)</label>
                <input
                  type="text"
                  value={settingsForm.google_maps_query}
                  onChange={(e) => setSettingsForm({ ...settingsForm, google_maps_query: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'सुरक्षित हो रहा है...' : 'सेटिंग्स सुरक्षित करें (Save Settings)'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">पूछताछ संदेश (Contact Inquiries)</h2>
              <p className="text-xs text-slate-500">मरीजों द्वारा संपर्क फॉर्म से भेजे गए संदेश</p>
            </div>

            {messages.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">अभी कोई नया संदेश नहीं है।</div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm">{msg.name}</div>
                      <span className="text-[11px] text-slate-400">{new Date(msg.created_at).toLocaleString('hi-IN')}</span>
                    </div>
                    <div className="text-xs font-semibold text-teal-700">फोन: {msg.phone} {msg.subject && `• विषय: ${msg.subject}`}</div>
                    <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">{msg.message}</p>
                    <div className="pt-1">
                      <a
                        href={`tel:${msg.phone}`}
                        className="text-xs font-bold text-teal-700 hover:underline inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>कॉल करें</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: FAQs MANAGEMENT */}
        {activeTab === 'faqs' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            <div>
              <h2 className="text-xl font-black text-slate-900">अक्सर पूछे जाने वाले सवाल (FAQs) प्रबंधित करें</h2>
              <p className="text-xs text-slate-500">वेबसाइट पर दिखने वाले 10 प्रमुख प्रश्न व उत्तर</p>
            </div>

            {/* Add New FAQ Form */}
            <form onSubmit={handleAddFaq} className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-3">
              <h4 className="text-xs font-bold text-teal-900 uppercase">नया प्रश्न जोड़ें (Add Question)</h4>
              <input
                type="text"
                required
                value={newFaqQuestion}
                onChange={(e) => setNewFaqQuestion(e.target.value)}
                placeholder="प्रश्न लिखें (उदा. क्या संडे को क्लिनिक खुला है?)..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
              />
              <textarea
                required
                rows={2}
                value={newFaqAnswer}
                onChange={(e) => setNewFaqAnswer(e.target.value)}
                placeholder="उत्तर लिखें..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white resize-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-2 rounded-xl text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>प्रश्न जोड़ें</span>
              </button>
            </form>

            {/* List of FAQs */}
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h5 className="font-bold text-slate-900 text-sm">
                      {faq.id}. {faq.question}
                    </h5>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PASSWORD / PIN CHANGE */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-lg space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Admin PIN / Password बदलें</h2>
              <p className="text-xs text-slate-500">डिफ़ॉल्ट एक्टिव PIN: <strong className="font-mono text-teal-700">995564</strong></p>
            </div>

            {passwordStatus && (
              <div className={`p-3.5 rounded-xl text-xs font-bold ${
                passwordStatus.includes('सफलतापूर्वक') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {passwordStatus}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">वर्तमान पासवर्ड या PIN (Current PIN)</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  placeholder="उदा. 995564"
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">नया PIN या पासवर्ड (New PIN - Min 6 digits/chars)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium font-mono"
                />
              </div>

              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors cursor-pointer"
              >
                PIN / पासवर्ड अपडेट करें
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Fullscreen HD Preview Modal for Doctor Photo */}
      {previewDoctorPicModal && settingsForm.doctor_image_url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setPreviewDoctorPicModal(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h4 className="text-sm font-bold">डॉक्टर की बड़ी फोटो (Full Size HD Preview)</h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoctorPicModal(false)}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 bg-slate-100 flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={settingsForm.doctor_image_url}
                alt="Doctor Full Preview"
                className="max-h-[65vh] w-auto rounded-2xl shadow-xl object-contain border border-slate-300"
              />
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                यह फोटो पूरे क्लिनिक पोर्टल और वेलकम स्क्रीन पर इसी प्रकार साफ दिखेगी।
              </span>
              <button
                type="button"
                onClick={() => setPreviewDoctorPicModal(false)}
                className="px-4 py-2 bg-teal-700 text-white font-bold rounded-xl"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
