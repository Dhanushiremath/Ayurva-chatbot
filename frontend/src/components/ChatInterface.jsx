import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Send, User, Bot, Globe, AlertCircle, LogOut, Bell, MapPin, Paperclip, X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from '../i18n/translations';
import NotificationSettings from './NotificationSettings';
import { useVoice } from '../hooks/useVoice';

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
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState('');
  const fileInputRef = useRef(null);

  // Track which message index is currently being spoken
  const [speakingIdx, setSpeakingIdx] = useState(null);

  // Voice hook — STT fills the input box, TTS reads bot messages
  const handleTranscript = useCallback((text) => {
    setInput(text);
  }, []);

  const {
    speak, stopSpeaking, isSpeaking,
    startListening, stopListening, isListening,
    transcript, ttsSupported, sttSupported
  } = useVoice(language, handleTranscript);

  // When interim transcript updates, mirror it into the input
  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // Stop speaking when language changes
  useEffect(() => {
    stopSpeaking();
    setSpeakingIdx(null);
  }, [language]);

  const handleSpeak = (content, idx) => {
    if (isSpeaking && speakingIdx === idx) {
      stopSpeaking();
      setSpeakingIdx(null);
    } else {
      setSpeakingIdx(idx);
      speak(content);
    }
  };

  // Clear speakingIdx when TTS naturally ends
  useEffect(() => {
    if (!isSpeaking) setSpeakingIdx(null);
  }, [isSpeaking]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result); // Base64 data URL
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setSelectedImageName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
    if (!messageToSend.trim() && !selectedImage) return;

    const userMessage = { 
      role: 'user', 
      content: messageToSend || (language === 'hi' ? "इस तस्वीर का विश्लेषण करें" : "Analyze this image"), 
      image: selectedImage,
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    if (!directMessage) setInput('');
    
    const imagePayload = selectedImage;
    handleClearImage();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        message: messageToSend || "Analyze this image",
        language: language,
        userId: user?._id || user?.phone || 'temp_user_123',
        image: imagePayload
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
    <div className="flex flex-col h-full w-full bg-white/50 font-sans overflow-hidden relative isolate">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-[#1e7a6c] to-[#1a6b5e] p-6 flex justify-between items-center shrink-0 z-10 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white/15 border border-white/20 p-3 rounded-2xl shadow-xl backdrop-blur-sm">
            <LotusIcon size={24} className="text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white leading-none serif">{t.appName}</h1>
            <span className="text-[10px] text-accent/80 font-black uppercase tracking-[0.2em] mt-1.5 block">{t.appSubtitle}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/15 shadow-sm hover:bg-white/20 transition-all">
            <Globe size={16} className="text-accent" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-xs font-bold outline-none cursor-pointer text-white appearance-none pr-1"
            >
              <option value="en" className="text-slate-800">English</option>
              <option value="hi" className="text-slate-800">हिन्दी</option>
              <option value="ta" className="text-slate-800">தமிழ்</option>
              <option value="te" className="text-slate-800">తెలుగు</option>
              <option value="bn" className="text-slate-800">বাংলা</option>
              <option value="mr" className="text-slate-800">मराठी</option>
              <option value="kn" className="text-slate-800">ಕನ್ನಡ</option>
            </select>
          </div>
          <button onClick={onOpenMap} className="bg-white/10 hover:bg-red-400/30 text-white p-2 rounded-xl border border-white/15 shadow-sm transition-all hover:border-red-300/40 group" title={t.findHospital || "Find Hospital"}>
            <MapPin size={16} className="group-hover:text-red-200" />
          </button>
          <button onClick={() => setShowNotifications(true)} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl border border-white/15 shadow-sm transition-all relative" title="Notification Settings">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 notif-dot"></span>
          </button>
          <button onClick={onLogout} className="bg-white/10 hover:bg-red-400/30 text-white p-2 rounded-xl border border-white/15 shadow-sm transition-all hover:border-red-300/40" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 min-h-0 overflow-y-auto chat-scroll p-4 sm:p-6 space-y-6 gradient-mesh relative z-0">
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
                <div className={`p-4 rounded-2xl overflow-hidden max-w-full ${
                  msg.role === 'user' 
                    ? 'chat-bubble-user text-white rounded-tr-none shadow-indigo-500/10' 
                    : msg.isError 
                      ? 'bg-red-50 text-red-700 border border-red-100 rounded-tl-none' 
                      : 'chat-bubble-bot text-slate-700 rounded-tl-none shadow-blue-500/5'
                }`}>
                  {msg.image && (
                    <img 
                      src={msg.image} 
                      alt="User health upload" 
                      className="w-full max-w-xs max-h-48 object-cover rounded-xl mb-3 shadow-md border border-white/20 block"
                    />
                  )}
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
                  {/* TTS Read-aloud button — only for assistant messages */}
                  {msg.role === 'assistant' && ttsSupported && (
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleSpeak(msg.content, idx)}
                        title={speakingIdx === idx ? 'Stop reading' : 'Read aloud'}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
                          speakingIdx === idx
                            ? 'bg-secondary/10 text-secondary border-secondary/30'
                            : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-secondary hover:border-secondary/30 hover:bg-secondary/5'
                        }`}
                      >
                        {speakingIdx === idx ? (
                          <>
                            <div className="voice-wave">
                              <span></span><span></span><span></span><span></span>
                            </div>
                            Stop
                          </>
                        ) : (
                          <><Volume2 size={11} /> Read</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-center gap-4 bg-white border border-slate-100 px-5 py-4 rounded-2xl shadow-md rounded-tl-none">
              <div className="flex gap-1.5">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analyzing</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Quick Tags */}
      <div className="px-5 py-3 bg-white/80 backdrop-blur-sm flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-100/60 shrink-0">
        {t.quickTags.map(tag => (
          <button
            key={tag}
            onClick={() => handleSend(null, tag)}
            className="quick-tag"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Input */}
      <footer className="p-5 bg-white border-t border-slate-100 shrink-0">
        {selectedImage && (
          <div className="mb-3 flex items-center gap-3 p-3 bg-gradient-to-r from-teal-50 to-green-50 border border-teal-100 rounded-2xl relative max-w-xs shadow-sm">
            <img src={selectedImage} alt="Selected thumbnail" className="w-12 h-12 object-cover rounded-lg border border-teal-200/50 shadow-sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-700 truncate">{selectedImageName || 'image.jpg'}</p>
              <p className="text-[9px] font-black text-teal-600 uppercase tracking-wider">Ready to analyze</p>
            </div>
            <button type="button" onClick={handleClearImage} className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md transition-all hover:scale-110">
              <X size={10} />
            </button>
          </div>
        )}
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-br from-teal-50 to-green-50 hover:from-teal-100 hover:to-green-100 text-teal-700 border border-teal-200 p-4 rounded-[1.25rem] transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-sm"
            title="Attach health image"
          >
            <Paperclip size={20} />
          </button>
          {sttSupported && (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              title={isListening ? 'Stop listening' : 'Speak your message'}
              className={`p-4 rounded-[1.25rem] transition-all flex items-center justify-center shadow-sm relative border ${
                isListening ? 'mic-active border-red-300' : 'bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 text-orange-600 border-orange-200 hover:scale-105 active:scale-95'
              }`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? '🎤 Listening...' : t.inputPlaceholder}
            className={`flex-1 border-2 rounded-[1.5rem] px-6 py-4 text-[15px] font-medium outline-none transition-all placeholder:text-slate-400 ${
              isListening
                ? 'bg-red-50 border-red-200 focus:border-red-300'
                : 'bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 focus:shadow-[0_0_0_4px_rgba(26,107,94,0.08)]'
            }`}
          />
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="bg-gradient-to-br from-primary to-[#2a8a7a] text-accent p-4 rounded-[1.25rem] hover:scale-105 active:scale-95 disabled:opacity-40 transition-all shadow-lg shadow-primary/20 group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.25rem]" />
            <Send size={20} className="relative group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </form>
        <div className="flex items-center justify-center gap-2 mt-4 text-slate-400 font-bold text-[9px] uppercase tracking-[0.12em]">
          <div className="w-1 h-1 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
          {t.disclaimer}
          <div className="w-1 h-1 rounded-full bg-gradient-to-r from-secondary to-accent"></div>
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
