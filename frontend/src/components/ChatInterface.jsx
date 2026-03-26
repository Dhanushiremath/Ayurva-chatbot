import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, User, Bot, Globe, AlertCircle, LogOut, Bell, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from '../i18n/translations';
import NotificationSettings from './NotificationSettings';

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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ChatInterface = ({ user, onLogout, onOpenMap, language, onLanguageChange }) => {
  const t = useTranslation(language);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t.initialGreeting, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages.length > 0 && newMessages[0].role === 'assistant') {
        newMessages[0] = { ...newMessages[0], content: t.initialGreeting };
      }
      return newMessages;
    });
  }, [language]);

  const handleSend = async (e, directMessage) => {
    if (e) e.preventDefault();
    const messageToSend = directMessage || input;
    if (!messageToSend.trim()) return;

    const userMessage = { role: 'user', content: messageToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    if (!directMessage) setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        message: messageToSend,
        language: language,
        userId: user?._id || user?.phone || 'temp_user_123'
      });

      const botMessage = {
        role: 'assistant',
        content: response.data.response,
        intent: response.data.intent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: t.errorMessage,
        isError: true,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white/50 font-sans transition-all duration-500">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-md p-6 flex justify-between items-center border-b border-slate-100 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-3 rounded-2xl shadow-xl shadow-primary/10">
            <LotusIcon size={24} className="text-[#E8B67D]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary leading-none serif">{t.appName}</h1>
            <span className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] mt-1.5 block opacity-80">{t.appSubtitle}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-100/80 px-4 py-2 rounded-2xl border border-white/50 shadow-sm transition-all hover:bg-white">
            <Globe size={16} className="text-accent" />
            <select 
              value={language} 
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-xs font-bold outline-none cursor-pointer text-slate-600 appearance-none pr-1"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>
          <button
            onClick={onOpenMap}
            className="bg-slate-100/80 p-2 rounded-xl border border-white/50 shadow-sm transition-all hover:bg-red-50 hover:border-red-200 group"
            title={t.findHospital || "Find Hospital"}
          >
            <MapPin size={16} className="text-slate-600 group-hover:text-red-500" />
          </button>
          <button
            onClick={() => setShowNotifications(true)}
            className="bg-slate-100/80 p-2 rounded-xl border border-white/50 shadow-sm transition-all hover:bg-accent/10 hover:border-accent/30 group relative"
            title="Notification Settings"
          >
            <Bell size={16} className="text-slate-600 group-hover:text-accent" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </button>
          <button
            onClick={onLogout}
            className="bg-slate-100/80 p-2 rounded-xl border border-white/50 shadow-sm transition-all hover:bg-red-50 hover:border-red-200 group"
            title="Logout"
          >
            <LogOut size={16} className="text-slate-600 group-hover:text-red-500" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 gradient-mesh">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`p-2.5 rounded-2xl shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-secondary' : 'bg-white border border-slate-100'}`}>
                  {msg.role === 'user' ? <User size={18} className="text-white" /> : <LotusIcon size={18} className="text-secondary" />}
                </div>
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'chat-bubble-user text-white rounded-tr-none shadow-indigo-500/10' 
                    : msg.isError 
                      ? 'bg-red-50 text-red-700 border border-red-100 rounded-tl-none' 
                      : 'chat-bubble-bot text-slate-700 rounded-tl-none shadow-blue-500/5'
                }`}>
                  <div className="prose prose-sm max-w-none text-inherit leading-relaxed">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  {msg.intent && (
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-accent">
                        {t.analysisLabel}: {t.intents[msg.intent] || msg.intent.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-md flex gap-1.5">
              <div className="w-2.5 h-2.5 bg-accent/40 rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-accent/70 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Quick Tags */}
      <div className="px-6 py-3 bg-white/50 flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-100/30 shrink-0">
        {t.quickTags.map(tag => (
          <button
            key={tag}
            onClick={() => handleSend(null, tag)}
            className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-primary hover:text-accent hover:border-primary transition-all shadow-sm active:scale-95"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Input */}
      <footer className="p-6 bg-white border-t border-slate-100/50 shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="flex-1 bg-background/50 border-2 border-transparent rounded-[1.5rem] px-6 py-4 text-[15px] font-medium focus:bg-white focus:border-secondary/20 outline-none transition-all placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-primary text-white p-4 rounded-[1.25rem] hover:scale-105 active:scale-95 disabled:opacity-40 transition-all shadow-xl shadow-primary/10 group"
          >
            <Send size={22} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </form>
        <div className="flex items-center justify-center gap-2 mt-5 text-slate-400 font-bold text-[9px] uppercase tracking-[0.1em]">
          <div className="w-1 h-1 rounded-full bg-secondary"></div>
          {t.disclaimer}
        </div>
      </footer>

      {/* Notification Settings Modal */}
      <AnimatePresence>
        {showNotifications && (
          <NotificationSettings 
            user={user}
            onClose={() => setShowNotifications(false)}
            t={t}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatInterface;
