import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Home } from 'lucide-react';
import { ClinicSettings, ServiceItem, FacilityItem, GalleryItem, FaqItem } from './types';
import { api } from './services/api';

// Components
import { EmergencyBanner } from './components/EmergencyBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MedicalWelcomeScreen } from './components/MedicalWelcomeScreen';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DoctorPage } from './pages/DoctorPage';
import { RadiographerPage } from './pages/RadiographerPage';
import { XRayPage } from './pages/XRayPage';
import { PhysiotherapyPage } from './pages/PhysiotherapyPage';
import { CtevPage } from './pages/CtevPage';
import { ServicesPage } from './pages/ServicesPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { AppointmentPage } from './pages/AppointmentPage';
import { GalleryPage } from './pages/GalleryPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AppointmentSuccessPage } from './pages/AppointmentSuccessPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageHistory, setPageHistory] = useState<string[]>(['home']);
  const [selectedServiceForApt, setSelectedServiceForApt] = useState<string | undefined>(undefined);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(false);

  // Patient Login / Entry Gate state
  const [patientUser, setPatientUser] = useState<{ name: string; phone: string } | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('maa_janki_patient_user');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return null;
  });
  const [showPatientLoginModal, setShowPatientLoginModal] = useState<boolean>(!patientUser);
  const [patientInputName, setPatientInputName] = useState('');
  const [patientInputPhone, setPatientInputPhone] = useState('');
  const [patientLoginError, setPatientLoginError] = useState('');

  // Live Running Digital Clock
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePatientLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientInputName.trim() || !patientInputPhone.trim()) {
      setPatientLoginError('कृपया अपना नाम और मोबाइल नंबर दोनों दर्ज करें।');
      return;
    }
    if (patientInputPhone.replace(/\D/g, '').length < 10) {
      setPatientLoginError('कृपया वैध 10-अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }
    const userData = { name: patientInputName.trim(), phone: patientInputPhone.trim() };
    setPatientUser(userData);
    localStorage.setItem('maa_janki_patient_user', JSON.stringify(userData));
    setShowPatientLoginModal(false);
    setPatientLoginError('');
  };
  
  // Data states
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  
  // Admin auth
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load all public clinical data & auth status
  const loadClinicalData = async () => {
    try {
      const [setRes, srvRes, facRes, galRes, faqRes, meRes] = await Promise.all([
        api.getSettings(),
        api.getServices(),
        api.getFacilities(),
        api.getGallery(),
        api.getFaqs(),
        api.getMe()
      ]);

      if (setRes.success && setRes.data) setSettings(setRes.data);
      if (srvRes.success && srvRes.data) setServices(srvRes.data);
      if (facRes.success && facRes.data) setFacilities(facRes.data);
      if (galRes.success && galRes.data) setGallery(galRes.data);
      if (faqRes.success && faqRes.data) setFaqs(faqRes.data);
      if (meRes.success && meRes.data) setCurrentUser(meRes.data.user);
    } catch (err) {
      console.error('Failed to load clinic data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClinicalData();

    // Check hash for direct route navigation (e.g. #admin, #appointment, #appointment-success)
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('appointment-success')) {
        setCurrentPage('appointment-success');
      } else if (hash) {
        setCurrentPage(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const getPageHindiTitle = (page: string) => {
    switch (page) {
      case 'home': return 'होम पेज';
      case 'about': return 'क्लिनिक परिचय';
      case 'doctor': return 'डॉक्टर जितेंद्र कुमार';
      case 'radiographer': return 'रेडियोग्राफर उपेंद्र कुमार';
      case 'xray': return 'मैनुअल एक्स-रे';
      case 'physiotherapy': return 'फिजियोथेरेपी यूनिट';
      case 'ctev': return 'CTEV क्लबफुट केयर';
      case 'services': return 'समस्त चिकित्सा सेवाएं';
      case 'facilities': return 'क्लिनिक सुविधाएं';
      case 'appointment': return 'अपॉइंटमेंट बुकिंग';
      case 'gallery': return 'फोटो गैलरी';
      case 'faq': return 'सवाल-जवाब (FAQ)';
      case 'contact': return 'संपर्क एवं पता';
      case 'privacy': return 'गोपनीयता नीति';
      case 'terms': return 'नियम व शर्तें';
      default: return page;
    }
  };

  const handleNavigate = (page: string, serviceName?: string) => {
    if (serviceName) {
      setSelectedServiceForApt(serviceName);
    }
    const cleanPage = page.split('?')[0];
    setPageHistory(prev => {
      if (prev[prev.length - 1] === cleanPage) return prev;
      return [...prev, cleanPage];
    });
    setCurrentPage(cleanPage);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (pageHistory.length > 1) {
      const updatedHistory = [...pageHistory];
      updatedHistory.pop(); // remove current active page
      const prevPage = updatedHistory[updatedHistory.length - 1] || 'home';
      setPageHistory(updatedHistory);
      setCurrentPage(prevPage);
      window.location.hash = prevPage;
    } else {
      setPageHistory(['home']);
      setCurrentPage('home');
      window.location.hash = 'home';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    setCurrentPage('admin-dashboard');
    window.location.hash = 'admin-dashboard';
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setCurrentPage('home');
    window.location.hash = 'home';
  };

  // If page is admin-dashboard but user is not logged in, redirect to login
  const renderCurrentPage = () => {
    if (currentPage === 'admin-dashboard' || currentPage === 'admin-login') {
      if (!currentUser) {
        return <AdminLoginPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
      }
      return (
        <AdminDashboard
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onDataRefresh={loadClinicalData}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            settings={settings}
            services={services}
            facilities={facilities}
            onNavigate={handleNavigate}
          />
        );
      case 'about':
        return <AboutPage settings={settings} onNavigate={handleNavigate} />;
      case 'doctor':
        return <DoctorPage settings={settings} onNavigate={handleNavigate} />;
      case 'radiographer':
        return <RadiographerPage settings={settings} onNavigate={handleNavigate} />;
      case 'xray':
        return <XRayPage settings={settings} onNavigate={handleNavigate} />;
      case 'physiotherapy':
        return <PhysiotherapyPage settings={settings} onNavigate={handleNavigate} />;
      case 'ctev':
        return <CtevPage settings={settings} onNavigate={handleNavigate} />;
      case 'services':
        return (
          <ServicesPage
            services={services}
            onNavigate={handleNavigate}
            primaryPhone={settings?.primary_phone}
          />
        );
      case 'facilities':
        return (
          <FacilitiesPage
            facilities={facilities}
            settings={settings}
            onNavigate={handleNavigate}
          />
        );
      case 'appointment':
        return (
          <AppointmentPage
            settings={settings}
            onNavigate={handleNavigate}
            defaultService={selectedServiceForApt}
          />
        );
      case 'appointment-success':
        return <AppointmentSuccessPage onNavigate={handleNavigate} />;
      case 'gallery':
        return <GalleryPage gallery={gallery} onNavigate={handleNavigate} />;
      case 'faq':
        return <FaqPage faqs={faqs} settings={settings} onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage settings={settings} onNavigate={handleNavigate} />;
      case 'privacy-policy':
        return <PrivacyPolicyPage onNavigate={handleNavigate} />;
      case 'terms':
        return <TermsPage onNavigate={handleNavigate} />;
      case 'admin-login':
        return <AdminLoginPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
      default:
        return (
          <HomePage
            settings={settings}
            services={services}
            facilities={facilities}
            gallery={gallery}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  const isAdminView = (currentPage === 'admin-dashboard' || currentPage === 'admin-login') && !!currentUser;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Grand Medical Welcome Portal on Initial Visit */}
      {showWelcomeScreen && !isAdminView && (
        <MedicalWelcomeScreen
          settings={settings}
          onContinue={() => setShowWelcomeScreen(false)}
          onDirectAppointment={() => {
            setShowWelcomeScreen(false);
            handleNavigate('appointment');
          }}
        />
      )}

      {/* Patient Entry / Login Modal */}
      {showPatientLoginModal && !isAdminView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-teal-200 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-teal-100 text-teal-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <span className="text-2xl font-bold">🩺</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                मां जानकी <span className="text-teal-600">एक्स-रे क्लिनिक</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                कृपया वेबसाइट में प्रवेश करने के लिए अपना नाम और मोबाइल नंबर दर्ज करें। आपका डेटा आपके नंबर से सुरक्षित रहेगा।
              </p>
            </div>

            <form onSubmit={handlePatientLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">आपका पूरा नाम (Full Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. राहुल कुमार"
                  value={patientInputName}
                  onChange={(e) => setPatientInputName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm font-semibold text-slate-800 outline-hidden transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">मोबाइल नंबर (Mobile Number) *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10 अंकों का मोबाइल नंबर"
                  value={patientInputPhone}
                  onChange={(e) => setPatientInputPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm font-semibold text-slate-800 outline-hidden transition-all font-mono"
                />
              </div>

              {patientLoginError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                  {patientLoginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-teal-600/25 active:scale-98 transition-all text-base cursor-pointer flex items-center justify-center gap-2"
              >
                <span>वेबसाइट में प्रवेश करें (Continue) →</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Top Emergency Notice */}
      {!isAdminView && <EmergencyBanner settings={settings} />}

      {/* Main Sticky Navbar */}
      {!isAdminView && (
        <Navbar
          settings={settings}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          currentTime={currentTime}
          patientUser={patientUser}
          onOpenPatientLogin={() => {
            setPatientInputName(patientUser?.name || '');
            setPatientInputPhone(patientUser?.phone || '');
            setShowPatientLoginModal(true);
          }}
        />
      )}

      {/* Universal Step-Back Navigation Bar on all sub-sections/pages */}
      {!isAdminView && currentPage !== 'home' && (
        <div className="bg-white/95 backdrop-blur-md border-b border-teal-100 shadow-2xs py-2.5 px-4 sm:px-8 sticky top-16 sm:top-20 z-30 transition-all relative overflow-hidden">
          {/* Subtle progress bar at the very top of the navigation section */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
            <div 
              className="h-full bg-teal-600 transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(20, (pageHistory.length / 5) * 100))}%` }}
              title={`Navigation depth: ${pageHistory.length} steps`}
            />
          </div>

          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 pt-0.5">
            <button
              id="global-back-step-btn"
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-950 font-bold px-3.5 py-1.5 rounded-xl border border-teal-200 text-xs sm:text-sm shadow-2xs active:scale-95 transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 text-teal-700 group-hover:-translate-x-1 transition-transform" />
              <span>← पीछे जाएं (Go Back)</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="hidden sm:inline">वर्तमान पृष्ठ:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
                {getPageHindiTitle(currentPage)}
              </span>
              <button
                onClick={() => handleNavigate('home')}
                className="text-teal-700 hover:text-teal-800 font-bold hover:underline ml-1"
              >
                (होम)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {renderCurrentPage()}
        </motion.div>
      </main>

      {/* Footer */}
      {!isAdminView && (
        <Footer
          settings={settings}
          onNavigate={handleNavigate}
          onOpenWelcome={() => setShowWelcomeScreen(true)}
        />
      )}

      {/* Desktop & Mobile Floating Call / WhatsApp / ScrollTop */}
      {!isAdminView && <FloatingActions settings={settings} />}

      {/* Sticky Mobile Bottom Navigation Bar (Call, WhatsApp, Appointment, Directions) */}
      {!isAdminView && (
        <MobileBottomNav
          settings={settings}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
