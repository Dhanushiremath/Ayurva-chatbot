import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatInterface from './components/ChatInterface';
import AuthPage from './components/AuthPage';
import HealthSidebar from './components/HealthSidebar';
import ActionHub from './components/ActionHub';
import HospitalMap from './components/HospitalMap';
import ImageAnalyzer from './components/ImageAnalyzer';
import { useTranslation } from './i18n/translations';
import { useKeepAlive } from './hooks/useKeepAlive';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('chatbot');
  const t = useTranslation(language);

  // Keep Render backend warm — prevents cold start delays
  useKeepAlive();

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('ayurva_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setLanguage(parsedUser.language || 'en'); // Set language from saved user
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (userData) => {
    try {
      setIsLoading(true);
      
      // Check if it's login (only phone) or signup (full data)
      if (userData.name) {
        // Signup - register new user
        const response = await axios.post(`${API_URL}/users/register`, userData);
        const { user: newUser, token } = response.data;
        
        // Store user and token
        setUser(newUser);
        localStorage.setItem('ayurva_user', JSON.stringify(newUser));
        localStorage.setItem('ayurva_token', token);
      } else {
        // Login - find existing user by phone
        try {
          const response = await axios.post(`${API_URL}/users/login`, { phone: userData.phone });
          const { user: existingUser, token } = response.data;
          const userWithLang = { ...existingUser, language: userData.language };
          
          setUser(userWithLang);
          localStorage.setItem('ayurva_user', JSON.stringify(userWithLang));
          localStorage.setItem('ayurva_token', token);
        } catch (loginError) {
          // If user not found, create a temporary session
          const tempUser = {
            phone: userData.phone,
            language: userData.language,
            _id: `temp_${userData.phone}`,
            isTemp: true
          };
          setUser(tempUser);
          localStorage.setItem('ayurva_user', JSON.stringify(tempUser));
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      // If registration fails (user exists), try to login
      if (error.response?.status === 400 && error.response?.data?.error?.includes('duplicate')) {
        try {
          const response = await axios.post(`${API_URL}/users/login`, { phone: userData.phone });
          const { user: existingUser, token } = response.data;
          const userWithLang = { ...existingUser, language: userData.language };
          
          setUser(userWithLang);
          localStorage.setItem('ayurva_user', JSON.stringify(userWithLang));
          localStorage.setItem('ayurva_token', token);
        } catch (loginError) {
          console.error('Login after duplicate error:', loginError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ayurva_user');
    localStorage.removeItem('ayurva_token');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen auth-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center shadow-lg animate-pop-in">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" />
              <path d="M12 22C12 22 16 18 16 13C16 8 12 5 12 5C12 5 8 8 8 13C8 18 12 22 12 22Z" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary/60">Ayurva is Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-0 lg:p-6 auth-bg">
      {user ? (
        <div className="app-shell w-full h-screen lg:h-[95vh] max-w-[1600px] flex flex-col bg-white lg:rounded-[3rem] shadow-[0_40px_100px_rgba(15,74,63,0.18)] overflow-hidden border border-white/60">
          {/* Tab Navigation */}
          <div className="tab-bar flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`tab-btn flex-1 py-4 px-4 text-sm transition-all ${activeTab === 'chatbot' ? 'active' : ''}`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="hidden sm:inline">{t.chatbot || 'Chatbot'}</span>
                <span className="sm:hidden">Chat</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('scan')}
              className={`tab-btn flex-1 py-4 px-4 text-sm transition-all ${activeTab === 'scan' ? 'active' : ''}`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                </svg>
                <span className="hidden sm:inline">Image Scan</span>
                <span className="sm:hidden">Scan</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`tab-btn flex-1 py-4 px-4 text-sm transition-all ${activeTab === 'location' ? 'active' : ''}`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden sm:inline">{t.location || 'Location'}</span>
                <span className="sm:hidden">Map</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`tab-btn flex-1 py-4 px-4 text-sm transition-all ${activeTab === 'insights' ? 'active' : ''}`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="hidden sm:inline">{t.healthInsights || 'Insights'}</span>
                <span className="sm:hidden">More</span>
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'chatbot' && (
              <div className="h-full flex flex-col">
                <ChatInterface 
                  user={user} 
                  onLogout={handleLogout} 
                  onOpenMap={() => setActiveTab('location')}
                  language={language}
                  onLanguageChange={setLanguage}
                />
              </div>
            )}

            {activeTab === 'location' && (
              <div className="h-full">
                <HospitalMap 
                  onClose={() => setActiveTab('chatbot')} 
                  language={language}
                  isEmbedded={true}
                />
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="h-full overflow-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                  <div className="lg:col-span-1">
                    <HealthSidebar language={language} />
                  </div>
                  <div className="lg:col-span-1">
                    <ActionHub onFindHospital={() => setActiveTab('location')} language={language} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'scan' && (
              <div className="h-full">
                <ImageAnalyzer language={language} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <AuthPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
