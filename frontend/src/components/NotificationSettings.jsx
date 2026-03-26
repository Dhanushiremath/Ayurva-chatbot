import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, MessageCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const NotificationSettings = ({ user, onClose, t }) => {
  const [preferences, setPreferences] = useState({
    whatsappEnabled: false,
    vaccinationReminders: true,
    healthAlerts: true,
    followUpMessages: true,
    emergencyAlerts: true
  });
  const [testStatus, setTestStatus] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTestWhatsApp = async () => {
    if (!user?.phone) {
      setTestStatus({ type: 'error', message: t.noPhoneNumber || 'No phone number found' });
      return;
    }

    // Ensure phone number has country code
    let phoneNumber = user.phone;
    if (!phoneNumber.startsWith('+')) {
      // If no country code, assume India (+91)
      phoneNumber = '+91' + phoneNumber.replace(/^0+/, ''); // Remove leading zeros
    }

    console.log('=== WhatsApp Test Debug ===');
    console.log('User object:', user);
    console.log('Original phone:', user.phone);
    console.log('Corrected phone:', phoneNumber);
    console.log('API URL:', API_URL);

    setIsSending(true);
    setTestStatus(null);

    try {
      const payload = {
        phone: phoneNumber,
        message: t.testWhatsAppMessage || 'Namaste! This is a test notification from Ayurva. Your health alerts are now active! 🌿'
      };
      
      console.log('Sending payload:', payload);
      console.log('To endpoint:', `${API_URL}/test/whatsapp`);

      const response = await axios.post(`${API_URL}/test/whatsapp`, payload);

      console.log('Response:', response.data);

      if (response.data.success) {
        setTestStatus({ 
          type: 'success', 
          message: t.testWhatsAppSuccess || 'Test message sent! Check your WhatsApp.' 
        });
        setPreferences(prev => ({ ...prev, whatsappEnabled: true }));
      }
    } catch (error) {
      console.error('WhatsApp test error:', error);
      console.error('Error response:', error.response?.data);
      const errorMsg = error.response?.data?.error || error.message || t.testWhatsAppError || 'Failed to send test message.';
      setTestStatus({ 
        type: 'error', 
        message: `❌ ${errorMsg}\n\n📱 Phone: ${user.phone}\n\nMake sure you joined the WhatsApp sandbox with this exact number.`
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/60 backdrop-blur-md p-7 border-b border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl shadow-xl shadow-primary/10">
              <Bell size={20} className="text-[#E8B67D]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary serif">
                {t.notificationSettings || 'Notification Settings'}
              </h2>
              <p className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] opacity-80 mt-1">
                {t.manageAlerts || 'Manage your health alerts'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* WhatsApp Setup */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <MessageCircle size={24} className="text-green-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-green-900 mb-1">
                  {t.whatsappNotifications || 'WhatsApp Notifications'}
                </h3>
                <p className="text-sm text-green-700 mb-3">
                  {t.whatsappDescription || 'Get instant health alerts and reminders on WhatsApp'}
                </p>
                
                {user?.phone && (
                  <div className="text-xs text-green-600 mb-3 font-medium bg-green-50 p-2 rounded-lg">
                    📱 Sending to: {user.phone}
                  </div>
                )}

                <button
                  onClick={handleTestWhatsApp}
                  disabled={isSending}
                  className="w-full bg-primary text-white py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {isSending 
                    ? (t.sending || 'Sending...') 
                    : preferences.whatsappEnabled 
                      ? (t.sendTestAgain || 'Send Test Again') 
                      : (t.sendTestMessage || 'Send Test Message')}
                </button>

                {testStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-3 p-3 rounded-xl text-sm ${
                      testStatus.type === 'success' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                  >
                    {testStatus.message}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">
              {t.alertPreferences || 'Alert Preferences'}
            </h3>

            {[
              { 
                key: 'vaccinationReminders', 
                label: t.vaccinationReminders || 'Vaccination Reminders',
                description: t.vaccinationDesc || 'Get notified about upcoming vaccinations',
                icon: '💉'
              },
              { 
                key: 'healthAlerts', 
                label: t.healthAlerts || 'Health Alerts',
                description: t.healthAlertsDesc || 'Disease outbreaks and preventive tips',
                icon: '🏥'
              },
              { 
                key: 'followUpMessages', 
                label: t.followUpMessages || 'Follow-up Messages',
                description: t.followUpDesc || 'Care instructions after consultations',
                icon: '💊'
              },
              { 
                key: 'emergencyAlerts', 
                label: t.emergencyAlerts || 'Emergency Alerts',
                description: t.emergencyDesc || 'Critical health warnings',
                icon: '🚨'
              }
            ].map(({ key, label, description, icon }) => (
              <div
                key={key}
                className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 hover:border-accent/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-2xl pt-1">{icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-primary text-base serif mb-1">
                        {label}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                        {description}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(key)}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      preferences[key] ? 'bg-secondary' : 'bg-slate-200'
                    }`}
                  >
                    <motion.div
                      animate={{ x: preferences[key] ? 28 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center"
                    >
                      {preferences[key] && <Check size={12} className="text-secondary" />}
                    </motion.div>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong className="block mb-1">ℹ️ {t.note || 'Note'}:</strong>
              {t.sandboxNote || 'WhatsApp notifications use Twilio Sandbox. Make sure you\'ve joined the sandbox by sending the join code to the Twilio WhatsApp number.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/60 backdrop-blur-md p-7 border-t border-white/20">
          <button
            onClick={onClose}
            className="w-full bg-secondary text-white py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-secondary/20"
          >
            {t.saveSettings || 'Save Settings'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotificationSettings;
