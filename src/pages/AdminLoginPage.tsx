import React, { useState } from 'react';
import { KeyRound, AlertCircle, ArrowRight, Eye, EyeOff, Sparkles, User, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminLoginPageProps {
  onLoginSuccess: (user: any) => void;
  onNavigate: (page: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [secret, setSecret] = useState('');
  const [username, setUsername] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [showUsernameField, setShowUsernameField] = useState(false);
  
  // Supabase Auth state
  const [supabaseEmail, setSupabaseEmail] = useState('');
  const [supabasePassword, setSupabasePassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'pin' | 'supabase'>(isSupabaseConfigured ? 'supabase' : 'pin');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (overrideSecret?: string) => {
    const valueToUse = overrideSecret !== undefined ? overrideSecret : secret;
    setError(null);

    const cleanSecret = String(valueToUse).trim();
    if (!cleanSecret) {
      setError('कृपया Admin पासवर्ड दर्ज करें।');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(username.trim() || 'admin', cleanSecret);
      setLoading(false);

      if (res.success) {
        const user = res.data?.user || { id: 'adm-1', username: 'admin', name: 'Dr. Jitendra Kumar (Admin)', role: 'admin' };
        onLoginSuccess(user);
        return;
      }
      setError(res.error || 'गलत पासवर्ड। कृपया सही पासवर्ड दर्ज करें।');
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'लॉगिन में समस्या आई। पुनः प्रयास करें।');
    }
  };

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!supabaseEmail.trim() || !supabasePassword.trim()) {
      setError('कृपया Supabase Email और Password दर्ज करें।');
      return;
    }

    setLoading(true);
    try {
      const { data, error: authError } = await supabase!.auth.signInWithPassword({
        email: supabaseEmail.trim(),
        password: supabasePassword.trim(),
      });
      setLoading(false);

      if (authError) {
        setError(`Supabase Auth Error: ${authError.message}`);
        return;
      }

      if (data.session && data.user) {
        onLoginSuccess({
          id: data.user.id,
          username: data.user.email,
          name: data.user.email?.split('@')[0] || 'Supabase Admin',
          role: 'admin',
          token: data.session.access_token
        });
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Supabase लॉगिन असफल रहा।');
    }
  };

  const handleQuickLogin = () => {
    setSecret('629947');
    handleLogin('629947');
  };

  const handleSecretChange = (val: string) => {
    setSecret(val);
    if (val.trim() === '629947' || val.trim() === '9955') {
      handleLogin(val.trim());
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 sm:py-16">
      <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-2xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto shadow-xs border border-teal-100">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-xs text-slate-500">
            मां जानकी एक्स-रे क्लिनिक प्रबंधन प्रणाली (Supabase Auth & RLS Secure)
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Method Selector */}
        {isSupabaseConfigured && (
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setLoginMethod('supabase')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                loginMethod === 'supabase' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Supabase Auth
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('pin')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                loginMethod === 'pin' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              PIN / Secure Login
            </button>
          </div>
        )}

        {loginMethod === 'supabase' && isSupabaseConfigured ? (
          <form onSubmit={handleSupabaseLogin} className="space-y-4">
            <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200 text-xs text-teal-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>अपने Supabase Auth Admin Credentials से लॉगिन करें। (RLS Protected)</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Admin Email</label>
              <input
                type="email"
                required
                value={supabaseEmail}
                onChange={(e) => setSupabaseEmail(e.target.value)}
                placeholder="admin@maajankiclinic.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                value={supabasePassword}
                onChange={(e) => setSupabasePassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors cursor-pointer shadow-md disabled:opacity-50"
            >
              <span>{loading ? 'लॉगिन हो रहा है...' : 'Supabase से लॉगिन करें'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Manual Login Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              {showUsernameField && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Username</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Admin पासवर्ड / PIN
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'छुपाएं' : 'दिखाएं'}</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={secret}
                    onChange={(e) => handleSecretChange(e.target.value)}
                    placeholder="पासवर्ड दर्ज करें..."
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 text-base font-mono font-bold tracking-wider focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSecret('9955');
                    setError('रिकवरी पिन भर दिया गया है। अब "लॉगिन करें" बटन दबाएं।');
                  }}
                  className="text-xs text-teal-700 hover:text-teal-900 font-bold underline cursor-pointer"
                >
                  पासवर्ड भूल गए? (Forgot Password)
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-50 cursor-pointer shadow-md"
              >
                <span>{loading ? 'सत्यापित हो रहा है...' : 'लॉगिन करें (Sign In)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Footer controls */}
        <div className="pt-2 text-center border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <button
            type="button"
            onClick={() => setShowUsernameField(!showUsernameField)}
            className="text-slate-500 hover:text-teal-700 font-medium cursor-pointer"
          >
            {showUsernameField ? 'यूजरनेम छिपाएं' : 'अन्य यूजरनेम से लॉगिन?'}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
          >
            ← मुख्य वेबसाइट
          </button>
        </div>
      </div>
    </div>
  );
};

