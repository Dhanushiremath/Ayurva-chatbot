import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatInterface from './components/ChatInterface';
import AuthPage from './components/AuthPage';
import HealthSidebar from './components/HealthSidebar';
import ActionHub from './components/ActionHub';
import HospitalMap from './components/HospitalMap';
import { useTranslation } from './i18n/translations';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState('en'); // Add language state here
  const [activeTab, setActiveTab] = useState('chatbot'); // Tab state: 'chatbot', 'location', 'insights'
  const t = useTranslation(language);

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
      <div className="min-h-screen bg-background flex items-center justify-center gradient-mesh">
        <div className="animate-pulse text-primary font-bold tracking-[0.3em] uppercase text-xs serif">Ayurva is Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-0 lg:p-6 gradient-mesh">
      {user ? (
        <div className="w-full h-screen lg:h-[95vh] max-w-[1600px] flex flex-col bg-white lg:rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden border border-white/40">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                activeTab === 'chatbot'
                  ? 'bg-white text-primary border-b-2 border-primary'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {t.chatbot || 'Chatbot'}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                activeTab === 'location'
                  ? 'bg-white text-primary border-b-2 border-primary'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t.location || 'Location'}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                activeTab === 'insights'
                  ? 'bg-white text-primary border-b-2 border-primary'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {t.healthInsights || 'Health Insights'}
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
          </div>
        </div>
      ) : (
        <AuthPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
