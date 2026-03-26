import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, MapPin, Calendar, Globe, Shield } from 'lucide-react';
import { useTranslation } from '../i18n/translations';

const LotusIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" />
    <path d="M12 22C12 22 16 18 16 13C16 8 12 5 12 5C12 5 8 8 8 13C8 18 12 22 12 22Z" />
    <path d="M12 22C12 22 8 20 5 16C2 12 3 7 3 7C3 7 7 6 11 9" />
    <path d="M12 22C12 22 16 20 19 16C22 12 21 7 21 7C21 7 17 6 13 9" />
  </svg>
);

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [language, setLanguage] = useState('en');
  const [countryCode, setCountryCode] = useState('+91'); // Default to India
  const t = useTranslation(language);
  
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    location: '',
    age_group: '',
    language: 'en'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Combine country code with phone number
    let phoneWithCode = formData.phone;
    if (!phoneWithCode.startsWith('+')) {
      phoneWithCode = countryCode + phoneWithCode.replace(/^0+/, ''); // Remove leading zeros
    }
    
    if (isLogin) {
      // For login, just need phone number
      onLogin({ phone: phoneWithCode, language });
    } else {
      // For signup, send all data with corrected phone
      onLogin({ ...formData, phone: phoneWithCode, language });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 gradient-mesh">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/50 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden glass">
          {/* Header */}
            <div className="bg-white/60 backdrop-blur-md p-8 border-b border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary p-3 rounded-2xl shadow-xl shadow-primary/10">
                    <LotusIcon size={32} className="text-[#E8B67D]" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary leading-none serif">
                      {t.appName}
                    </h1>
                    <span className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] mt-2 block opacity-80">
                      {t.appSubtitle}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-background/80 px-4 py-2 rounded-2xl border border-secondary/10 shadow-sm">
                  <Globe size={14} className="text-secondary" />
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-xs font-bold outline-none cursor-pointer text-slate-600 appearance-none"
                >
                  <option value="en">EN</option>
                  <option value="hi">हिं</option>
                  <option value="ta">த</option>
                  <option value="te">తె</option>
                  <option value="bn">বা</option>
                  <option value="mr">म</option>
                  <option value="kn">ಕ</option>
                </select>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 text-center">
              {t.authWelcome}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="p-8 pb-4">
            <div className="bg-background/80 p-1.5 rounded-[1.5rem] flex gap-2">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  isLogin 
                    ? 'bg-primary text-white shadow-xl shadow-primary/10' 
                    : 'text-slate-400 hover:text-primary'
                }`}
              >
                {t.loginButton}
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  !isLogin 
                    ? 'bg-primary text-white shadow-xl shadow-primary/10' 
                    : 'text-slate-400 hover:text-primary'
                }`}
              >
                {t.signupButton}
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                      {t.phonePlaceholder}
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-slate-100/80 border-2 border-transparent rounded-2xl px-4 py-4 text-[15px] font-bold focus:bg-white focus:border-accent/30 focus:ring-4 focus:ring-accent/5 outline-none transition-all text-slate-700 cursor-pointer"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+61">🇦🇺 +61</option>
                        <option value="+971">🇦🇪 +971</option>
                      </select>
                      <div className="relative flex-1">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="9876543210"
                          required
                          className="w-full bg-slate-100/80 border-2 border-transparent rounded-2xl pl-12 pr-5 py-4 text-[15px] font-medium focus:bg-white focus:border-accent/30 focus:ring-4 focus:ring-accent/5 outline-none transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.namePlaceholder}
                      required
                      className="w-full bg-slate-100/80 border-2 border-transparent rounded-2xl pl-12 pr-5 py-4 text-[15px] font-medium focus:bg-white focus:border-accent/30 focus:ring-4 focus:ring-accent/5 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                      {t.phonePlaceholder}
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-slate-100/80 border-2 border-transparent rounded-2xl px-4 py-4 text-[15px] font-bold focus:bg-white focus:border-accent/30 focus:ring-4 focus:ring-accent/5 outline-none transition-all text-slate-700 cursor-pointer"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+61">🇦🇺 +61</option>
                        <option value="+971">🇦🇪 +971</option>
                      </select>
                      <div className="relative flex-1">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="9876543210"
                          required
                          className="w-full bg-slate-100/80 border-2 border-transparent rounded-2xl pl-12 pr-5 py-4 text-[15px] font-medium focus:bg-white focus:border-accent/30 focus:ring-4 focus:ring-accent/5 outline-none transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder={t.locationPlaceholder}
                      className="w-full bg-slate-100/80 border-2 border-transparent rounded-2xl pl-12 pr-5 py-4 text-[15px] font-medium focus:bg-white focus:border-accent/30 focus:ring-4 focus:ring-accent/5 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="relative">
                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
                    <select
                      name="age_group"
                      value={formData.age_group}
                      onChange={handleChange}
                      className="w-full bg-slate-100/80 border-2 border-transparent rounded-2xl pl-12 pr-5 py-4 text-[15px] font-medium focus:bg-white focus:border-accent/30 focus:ring-4 focus:ring-accent/5 outline-none transition-all text-slate-600 appearance-none cursor-pointer"
                    >
                      <option value="">{t.ageGroupPlaceholder}</option>
                      <option value="0-5">{t.ageGroup1}</option>
                      <option value="6-17">{t.ageGroup2}</option>
                      <option value="18-40">{t.ageGroup3}</option>
                      <option value="41-60">{t.ageGroup4}</option>
                      <option value="60+">{t.ageGroup5}</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full bg-secondary text-white py-5 rounded-[1.5rem] font-bold text-[15px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-secondary/20 mt-8 uppercase tracking-[0.2em]"
            >
              {isLogin ? t.loginButton : t.signupButton}
            </button>
          </form>

          {/* Footer */}
          <div className="px-6 pb-6">
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <Shield size={12} className="text-accent" />
              <span className="font-medium">{t.privacyNote}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
