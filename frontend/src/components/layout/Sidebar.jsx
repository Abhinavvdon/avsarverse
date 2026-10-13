import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Award,
  Landmark,
  Sliders,
  CalendarDays,
  Bookmark,
  FileText,
  Sparkles,
  Settings,
  Compass,
  CheckSquare,
  Network
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProfile } from '../../context/ProfileContext';

export const Sidebar = () => {
  const { t } = useLanguage();
  const { profile, savedIds } = useProfile();

  const navItems = [
    { to: '/', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/profile', label: t('myProfile'), icon: User },
    { to: '/higher-studies', label: t('higherStudies'), icon: GraduationCap, color: 'text-indigo-400' },
    { to: '/scholarships', label: t('scholarships'), icon: Award, color: 'text-teal-400' },
    { to: '/government-exams', label: t('govtExams'), icon: Landmark, color: 'text-orange-400' },
    { to: '/simulator', label: t('simulator'), icon: Sliders },
    { to: '/timeline', label: t('conflictTimeline'), icon: CalendarDays },
    { to: '/planner', label: t('actionPlan'), icon: Network, highlight: true },
    { to: '/saved', label: t('savedOpportunities'), icon: Bookmark, badge: savedIds?.size },
    { to: '/documents', label: t('documentsTitle'), icon: CheckSquare },
    { to: '/notice-reader', label: t('noticeReader'), icon: Sparkles, aiBadge: true },
    { to: '/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0d1222] text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-screen">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/30">
          <Compass className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-white text-lg tracking-tight flex items-center gap-1.5">
            AvsarVerse
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              PRO
            </span>
          </h1>
          <p className="text-xs text-slate-400">{t('appTagline')}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-purple-600 text-white font-medium shadow-md shadow-purple-900/40'
                    : item.highlight
                    ? 'text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 hover:text-white border border-purple-800/30 font-medium'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${item.color || ''}`} />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1">
                {item.aiBadge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-400/20 text-purple-300 font-semibold border border-purple-400/30">
                    AI
                  </span>
                )}
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-purple-300 font-bold border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* User Mini Profile Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 m-3 rounded-2xl">
        <Link to="/profile" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow">
            {profile?.name ? profile.name.charAt(0) : 'A'}
          </div>
          <div className="truncate flex-1">
            <p className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
              {profile?.name || 'Arjun Sharma'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {profile?.course || 'B.Tech CS'} • {profile?.category || 'OBC'}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
};
