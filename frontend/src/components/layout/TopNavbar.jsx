import React, { useState, useEffect } from 'react';
import { Search, Bell, Globe, Sparkles, AlertTriangle, Calendar, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useProfile } from '../../context/ProfileContext';
import { deadlineApi, conflictApi } from '../../services/api';

export const TopNavbar = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { profile, savedIds } = useProfile();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [deadlines, setDeadlines] = useState([]);
  const [clashCount, setClashCount] = useState(0);

  useEffect(() => {
    deadlineApi.getUpcoming().then((data) => {
      setDeadlines(data ? data.slice(0, 4) : []);
    }).catch(() => {});

    conflictApi.detectConflicts().then((res) => {
      if (res) {
        setClashCount(res.totalClashes + res.totalExclusions);
      }
    }).catch(() => {});
  }, [savedIds]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/higher-studies?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative w-96 max-w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm rounded-xl border border-transparent focus:border-purple-300 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200/60 transition-colors shadow-2xs"
          title="Switch Language / भाषा बदलें"
        >
          <Globe className="w-3.5 h-3.5 text-purple-600" />
          <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
            aria-label={t('notifications')}
          >
            <Bell className="w-5 h-5" />
            {(deadlines.length > 0 || clashCount > 0) && (
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 absolute top-1.5 right-1.5 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                  Opportunity Alerts
                </h4>
                {clashCount > 0 && (
                  <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                    {clashCount} Clashes
                  </span>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {deadlines.map((dl) => (
                  <div key={dl.opportunityId} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg shrink-0 ${dl.daysLeft <= 7 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{dl.title}</p>
                        <p className="text-[11px] text-slate-500">
                          Deadline: {dl.applicationDeadline} ({dl.daysLeft} days left)
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 px-3 border-t border-slate-100 text-center">
                <Link
                  to="/timeline"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-purple-600 hover:text-purple-700 font-semibold"
                >
                  View Conflict Timeline & Clashes →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 pl-2 pr-3 py-1 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200/80 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {profile?.name ? profile.name.charAt(0) : 'A'}
          </div>
          <div className="text-left text-xs">
            <span className="font-semibold text-slate-800 block leading-tight">
              {profile?.name || 'Arjun Sharma'}
            </span>
            <span className="text-[10px] text-slate-500 block leading-none">
              {profile?.category || 'OBC'} • {profile?.state || 'MP'}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};
