import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Activity, Bell, History, TrendingUp } from 'lucide-react';
import { useTranslation } from '../i18n/translations';

const HealthSidebar = ({ language = 'en' }) => {
    const t = useTranslation(language);
    const dailyTips = [
        "Begin your day with warm lemon water to awaken your agni (digestive fire).",
        "Practicing pranayama for 10 minutes daily can restore your vital prana.",
        "Include more tri-dosha balancing foods like mung dal and basmati rice.",
        "Massage your feet with warm sesame oil before sleep for deep relaxation.",
        "Seasonal eating aligns your internal rhythm with nature's flow."
    ];

    const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:flex flex-col gap-6 p-6 h-full border-r border-slate-100 bg-white/50 backdrop-blur-sm overflow-y-auto"
        >
            {/* Health Score / Header */}
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-secondary/10 p-2.5 rounded-xl">
                    <Activity size={20} className="text-secondary" />
                </div>
                <h3 className="font-bold text-primary text-xl serif">{t.healthInsights}</h3>
            </div>

            {/* Daily Tip Card */}
            <div className="bg-secondary rounded-[2.5rem] p-7 text-white shadow-2xl shadow-secondary/10 relative overflow-hidden group min-h-[140px] flex flex-col">
                <Sparkles size={40} className="absolute -right-2 -top-2 opacity-20 group-hover:rotate-12 transition-transform" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-3 relative z-10">{t.dailyHealthTip}</h4>
                <p className="text-base font-medium leading-relaxed italic serif relative z-10 flex-1">"{randomTip}"</p>
            </div>

            {/* Stats/Alerts */}
            <div className="space-y-4">
                <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{t.airQuality}</span>
                        <TrendingUp size={14} className="text-green-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary serif">42</span>
                        <span className="text-[9px] font-black text-green-600 px-2.5 py-1 bg-green-50 rounded-full uppercase tracking-widest">{t.pristine}</span>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <Bell size={16} className="text-secondary" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{t.localHealthAlerts}</span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed serif italic">
                        {t.pollenAlert}
                    </p>
                </div>
            </div>

            {/* Recent History Preview */}
            <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <History size={16} className="text-slate-400" />
                        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">{t.history}</h4>
                    </div>
                    <button className="text-[10px] font-bold text-primary hover:underline">{t.viewAll}</button>
                </div>
                <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                        <div className="text-[10px] text-slate-400 font-bold mb-1">{t.yesterday}</div>
                        <div className="text-xs font-bold text-slate-700">{t.persistentFeverQuery}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                        <div className="text-[10px] text-slate-400 font-bold mb-1">2 {t.daysAgo}</div>
                        <div className="text-xs font-bold text-slate-700">{t.medicineDosageHelp}</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default HealthSidebar;
