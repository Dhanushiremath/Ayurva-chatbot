import React from 'react';
import { motion } from 'framer-motion';
import { Phone, AlertCircle, MapPin, Navigation, Info } from 'lucide-react';
import { useTranslation } from '../i18n/translations';

const ActionHub = ({ onFindHospital, language = 'en' }) => {
    const t = useTranslation(language);
    const emergencyContacts = [
        { name: t.ambulance, number: "108", icon: Phone },
        { name: t.emergencyCenter, number: "112", icon: AlertCircle },
        { name: t.bloodBank, number: "1910", icon: Info }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:flex flex-col gap-6 p-6 h-full border-l border-slate-100 bg-white/50 backdrop-blur-sm overflow-y-auto"
        >
            {/* SOS Section */}
            <div>
                <button className="w-full bg-secondary hover:opacity-95 text-white p-7 rounded-[3rem] shadow-2xl shadow-secondary/20 flex flex-col items-center justify-center gap-3 group transition-all active:scale-95">
                    <div className="bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform">
                        <Phone size={32} />
                    </div>
                    <span className="text-xl font-black uppercase tracking-[0.2em] serif">{t.emergencySos}</span>
                </button>
                <p className="text-center text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-[0.1em] opacity-80">{t.immediateHolisticSupport}</p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">{t.quickActions}</h4>
                
                <button 
                    onClick={onFindHospital}
                    className="w-full bg-white border border-slate-100 p-5 rounded-[2rem] flex items-center gap-5 hover:shadow-xl transition-all group text-left"
                >
                    <div className="bg-primary/5 p-4 rounded-2xl text-primary group-hover:rotate-6 transition-transform">
                        <MapPin size={22} />
                    </div>
                    <div>
                        <div className="text-base font-bold text-primary serif">{t.findHospital}</div>
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{t.ayurvedicCentersNearby}</div>
                    </div>
                </button>

                <div className="bg-primary rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-2xl shadow-primary/10">
                    <Navigation size={60} className="absolute -right-4 -bottom-4 opacity-10" />
                    <h5 className="text-[10px] font-black uppercase opacity-60 mb-5 tracking-[0.2em]">{t.nearestVaidyashala}</h5>
                    <div className="text-lg font-bold mb-1 serif">{t.ayurVedaWellness}</div>
                    <div className="text-[10px] opacity-80 mb-6 font-bold uppercase tracking-widest">1.8 {t.kmAway} • {t.openUntilSunset}</div>
                    <button className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/10">{t.navigateNow}</button>
                </div>
            </div>

            {/* Essential Contacts */}
            <div className="mt-auto">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">{t.essentialContacts}</h4>
                <div className="grid grid-cols-1 gap-2">
                    {emergencyContacts.map((contact, idx) => (
                        <a 
                            key={idx} 
                            href={`tel:${contact.number}`}
                            className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-50 hover:border-slate-200 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <contact.icon size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
                                <span className="text-xs font-bold text-slate-700">{contact.name}</span>
                            </div>
                            <span className="text-xs font-black text-primary">{contact.number}</span>
                        </a>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ActionHub;
