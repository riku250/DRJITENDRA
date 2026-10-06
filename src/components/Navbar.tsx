import React, { useState } from 'react';
import { 
  Menu, X, Calendar, Phone, Activity, Lock, 
  Search, MessageSquare, Clock, User
} from 'lucide-react';
import { ClinicSettings } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  settings: ClinicSettings | null;
  onOpenTrackModal: () => void;
  currentTime?: string;
  patientUser?: { name: string; phone: string } | null;
  onOpenPatientLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  settings,
  onOpenTrackModal,
  currentTime,
  patientUser,
  onOpenPatientLogin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', labelHi: 'होम' },
    { id: 'doctor', label: 'Doctor', labelHi: 'डॉक्टर' },
    { id: 'radiographer', label: 'Radiographer (Upendra)', labelHi: 'रेडियोग्राफर' },
    { id: 'services', label: 'Services', labelHi: 'सेवाएं' },
    { id: 'xray', label: 'X-Ray', labelHi: 'एक्स-रे' },
    { id: 'facilities', label: 'Facilities', labelHi: 'सुविधाएं' },
    { id: 'appointment', label: 'Appointment', labelHi: 'अपॉइंटमेंट' },
    { id: 'gallery', label: 'Gallery', labelHi: 'गैलरी' },
    { id: 'faq', label: 'FAQ', labelHi: 'प्रश्न' },
    { id: 'contact', label: 'Contact', labelHi: 'संपर्क' }
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const primaryPhone = settings?.primary_phone || '9525719654';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Clinic Branding */}
          <div 
            id="brand-logo-button"
            onClick={() => handleLinkClick('home')}
            className="flex items-center space-x-3 cursor-pointer select-none group py-2"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight leading-none group-hover:text-teal-700 transition-colors">
                  मां जानकी <span className="text-teal-600">एक्स-रे</span>
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 tracking-wide mt-0.5">
                हड्डी, जोड़ एवं नस रोग क्लिनिक
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-1.5">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-teal-700 bg-teal-50 shadow-xs border border-teal-200/60'
                      : 'text-slate-600 hover:text-teal-700 hover:bg-slate-100/80'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Live Clock */}
            {currentTime && (
              <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-2 rounded-lg border border-teal-200">
                <Clock className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                <span>{currentTime}</span>
              </div>
            )}

            {/* Patient User Info */}
            {patientUser && (
              <button
                onClick={onOpenPatientLogin}
                title="मरीज प्रोफाइल / नंबर बदलाएं"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg border border-slate-300 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span className="max-w-[90px] truncate">{patientUser.name}</span>
                <span className="text-[10px] text-slate-500">({patientUser.phone})</span>
              </button>
            )}

            {/* Track appointment status */}
            <button
              id="track-appointment-button"
              onClick={onOpenTrackModal}
              title="अपनी अपॉइंटमेंट का स्टेटस चेक करें"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 px-3 py-2 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-teal-600" />
              <span>Status</span>
            </button>

            {/* Quick Call */}
            <a
              id="header-call-button"
              href={`tel:${primaryPhone}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-teal-700 px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>{primaryPhone}</span>
            </a>

            {/* Book Appointment CTA */}
            <button
              id="header-book-appointment-button"
              onClick={() => handleLinkClick('appointment')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-teal-600/20 active:scale-98 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            {/* Admin Portal Link */}
            <button
              id="nav-admin-login-button"
              onClick={() => handleLinkClick('admin-login')}
              title="Admin Panel Login"
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Right Controls: Hamburger + Call + Book */}
          <div className="flex xl:hidden items-center space-x-1.5">
            <button
              id="mobile-book-cta-btn"
              onClick={() => handleLinkClick('appointment')}
              className="bg-teal-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book</span>
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`mobile-nav-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-slate-400">{link.labelHi}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>🕐 प्रतिदिन 8:00 AM – 7:00 PM</span>
              <span className="text-red-600 font-bold">24hr Emergency</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${primaryPhone}`}
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-lg transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span>Call: {primaryPhone}</span>
              </a>

              <a
                href={`https://wa.me/91${primaryPhone}?text=${encodeURIComponent('नमस्ते, मुझे मां जानकी एक्स-रे में appointment लेना है।')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>

            <button
              onClick={() => handleLinkClick('admin-login')}
              className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-slate-800 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Login / व्यवस्थापक पोर्टल</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
