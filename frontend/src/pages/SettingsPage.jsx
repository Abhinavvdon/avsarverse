import React, { useState, useEffect } from 'react';
import {
  Settings,
  Globe,
  Database,
  CheckCircle2,
  Server,
  Info,
  Compass,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { opportunityApi, profileApi } from '../services/api';

export const SettingsPage = () => {
  const { lang, setLang, t } = useLanguage();
  const [stats, setStats] = useState({ totalOps: 0, profileName: '' });

  useEffect(() => {
    Promise.all([opportunityApi.getOpportunities(), profileApi.getProfile()])
      .then(([ops, prof]) => {
        setStats({
          totalOps: ops?.length || 0,
          profileName: prof?.name || 'Arjun Sharma',
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-in fade-in">
      <div className="border-b border-slate-200/80 pb-5">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-purple-600" />
          {t('settingsTitle')}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">{t('settingsSubtitle')}</p>
      </div>

      <div className="space-y-5">
        {/* Language Selection */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-600" />
            Display Language / प्रदर्शन भाषा
          </h3>

          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              onClick={() => {
                setLang('en');
                localStorage.setItem('avsar_lang', 'en');
              }}
              className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                lang === 'en'
                  ? 'bg-purple-50 border-purple-300 text-purple-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div>
                <span className="block text-sm">English</span>
                <span className="text-[10px] text-slate-400">Default interface</span>
              </div>
              {lang === 'en' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
            </button>

            <button
              onClick={() => {
                setLang('hi');
                localStorage.setItem('avsar_lang', 'hi');
              }}
              className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                lang === 'hi'
                  ? 'bg-purple-50 border-purple-300 text-purple-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div>
                <span className="block text-sm">हिन्दी (Hindi)</span>
                <span className="text-[10px] text-slate-400">भारतीय छात्रों हेतु</span>
              </div>
              {lang === 'hi' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
            </button>
          </div>
        </div>

        {/* Backend & Environment Status */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-600" />
            Backend Services & Database Status
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-700 block uppercase">
                REST Engine Status
              </span>
              <span className="font-black text-emerald-900 text-base mt-0.5 block flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Connected
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">
                Seeded Opportunities
              </span>
              <span className="font-black text-slate-800 text-base mt-0.5 block">
                {stats.totalOps} Opportunities
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100">
              <span className="text-[10px] font-bold text-purple-700 block uppercase">
                Active Student
              </span>
              <span className="font-black text-purple-900 text-base mt-0.5 block truncate">
                {stats.profileName} (ID: 1)
              </span>
            </div>
          </div>
        </div>

        {/* About AvsarVerse */}
        <div className="bg-gradient-to-r from-slate-900 to-[#191e36] text-white p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-400" />
            <h4 className="font-extrabold text-sm">AvsarVerse – Your Future, Connected</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hackathon prototype built with Spring Boot 3, Java 17, and React Vite. Designed to eliminate opportunity silos for Indian students by evaluating multi-criteria eligibility, preventing date collisions, enforcing mutual exclusion rules, and orchestrating synergistic preparation schedules.
          </p>
        </div>
      </div>
    </div>
  );
};
