import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Award,
  Landmark,
  Sparkles,
  ArrowRight,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Compass,
  Sliders,
  Network,
  Banknote,
  Hourglass
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import {
  opportunityApi,
  eligibilityApi,
  deadlineApi,
  conflictApi
} from '../services/api';
import { OpportunityDetailModal } from '../components/OpportunityDetailModal';

export const Dashboard = () => {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState([]);
  const [eligibilityResults, setEligibilityResults] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [clashSummary, setClashSummary] = useState(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ops, elig, dls, conflicts] = await Promise.all([
          opportunityApi.getOpportunities(),
          eligibilityApi.checkAll(profile),
          deadlineApi.getUpcoming(),
          conflictApi.detectConflicts()
        ]);
        setOpportunities(ops || []);
        setEligibilityResults(elig || []);
        setDeadlines(dls || []);
        setClashSummary(conflicts);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profile]);

  // Counts by category
  const higherStudiesOps = opportunities.filter((o) => o.type === 'HIGHER_STUDIES');
  const scholarshipOps = opportunities.filter((o) => o.type === 'SCHOLARSHIP');
  const govtExamOps = opportunities.filter((o) => o.type === 'GOVT_EXAM');

  const eligMap = new Map(eligibilityResults.map((e) => [e.opportunityId, e]));

  const countEligible = (list) =>
    list.filter((o) => eligMap.get(o.id)?.eligible).length;

  // Top recommendations (eligible or almost eligible with high match score)
  const recommendations = [...eligibilityResults]
    .filter((e) => e.matchScore >= 60)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

  // Profile completion calculation
  const profileFields = [
    profile?.name,
    profile?.course,
    profile?.percentage,
    profile?.familyIncome,
    profile?.state,
    profile?.category,
    profile?.age,
    profile?.graduationYear,
    profile?.completedDocuments?.length > 0
  ];
  const completedFieldsCount = profileFields.filter(Boolean).length;
  const profilePercent = Math.round((completedFieldsCount / profileFields.length) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* 1. Greeting Banner */}
      <div className="bg-gradient-to-r from-[#171b30] via-[#211a3d] to-[#121629] text-white p-7 rounded-3xl shadow-lg border border-slate-800/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
                {profile?.state || 'Madhya Pradesh'} Domicile
              </span>
              <span className="text-xs text-slate-400">
                {profile?.category || 'OBC'} • Class of {profile?.graduationYear || 2027}
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              {t('welcomeBack')}, {profile?.name || 'Arjun'} 👋
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              {profile?.course || 'B.Tech Computer Science'} (Year {profile?.yearOfStudy || 4}) • Current Percentage: {profile?.percentage || 78.5}%
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/simulator"
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-2"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              {t('exploreSimulator')}
            </Link>
            <Link
              to="/planner"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/40 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {t('analyzeMyOptions')}
            </Link>
          </div>
        </div>
      </div>

      {/* 2. PROMINENT HERO: Cross-Opportunity Intelligence Engine (Most Prominent Feature) */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-7 shadow-xl border border-purple-800/40 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-400/20 text-purple-200 text-xs font-bold uppercase tracking-wider border border-purple-400/30 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-purple-300" />
                Core Innovation
              </span>
              {clashSummary?.totalClashes > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {clashSummary.totalClashes} Clashes Flagged
                </span>
              )}
            </div>

            <h3 className="text-2xl font-black tracking-tight text-white">
              {t('intelligenceHeroTitle')}
            </h3>

            <p className="text-sm text-purple-100/90 leading-relaxed">
              {t('intelligenceHeroDesc')}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-purple-200">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Exam Clashes</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Exclusion Scheme Guard</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Shared Syllabus Synergy</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => navigate('/planner')}
              className="px-6 py-3.5 bg-white hover:bg-purple-50 text-purple-950 font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{t('analyzeMyOptions')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/timeline')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-purple-300" />
              <span>Inspect Calendar Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Three Category Count Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Higher Studies Card */}
        <Link
          to="/higher-studies"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
              {countEligible(higherStudiesOps)} {t('eligibleText')}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
              {t('higherStudies')}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{t('higherStudiesDesc')}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400">
              {higherStudiesOps.length} Active Entrances
            </span>
            <span className="font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              {t('viewAll')} →
            </span>
          </div>
        </Link>

        {/* Scholarships Card (Teal) */}
        <Link
          to="/scholarships"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-teal-300 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
              {countEligible(scholarshipOps)} {t('eligibleText')}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-teal-600 transition-colors">
              {t('scholarships')}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{t('scholarshipsDesc')}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400">
              {scholarshipOps.length} Active Schemes
            </span>
            <span className="font-bold text-teal-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              {t('viewAll')} →
            </span>
          </div>
        </Link>

        {/* Government Exams Card (Orange) */}
        <Link
          to="/government-exams"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-orange-300 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all shadow-xs">
              <Landmark className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full">
              {countEligible(govtExamOps)} {t('eligibleText')}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-orange-600 transition-colors">
              {t('govtExams')}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{t('govtExamsDesc')}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400">
              {govtExamOps.length} Active Exams
            </span>
            <span className="font-bold text-orange-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              {t('viewAll')} →
            </span>
          </div>
        </Link>
      </div>

      {/* 4. Main Two Column Section: Recommended For You + Upcoming Deadlines & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recommended For You */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              {t('recommendedForYou')}
            </h3>
            <Link to="/higher-studies" className="text-xs font-bold text-purple-600 hover:text-purple-700">
              Browse Full Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.map((rec) => {
              const op = rec.opportunity;
              return (
                <div
                  key={rec.opportunityId}
                  className="bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-purple-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          op.type === 'HIGHER_STUDIES'
                            ? 'bg-indigo-50 text-indigo-600'
                            : op.type === 'SCHOLARSHIP'
                            ? 'bg-teal-50 text-teal-600'
                            : 'bg-orange-50 text-orange-600'
                        }`}
                      >
                        {op.type.replace('_', ' ')}
                      </span>

                      <span
                        className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                          rec.eligible
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rec.matchScore}% Match
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                      {op.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{op.subtitle}</p>

                    <div className="pt-2 text-xs text-slate-600 flex items-center justify-between border-t border-slate-100">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {op.applicationDeadline}
                      </span>
                      <span className="font-bold text-slate-700">
                        {op.applicationFee === 0 ? 'Free' : `₹${op.applicationFee}`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOpportunityId(rec.opportunityId)}
                    className="mt-4 w-full py-2 bg-slate-100 hover:bg-purple-600 hover:text-white text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>{t('viewDetails')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Upcoming Deadlines + Profile Completion */}
        <div className="space-y-6">
          {/* Upcoming Deadlines Widget */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                {t('upcomingDeadlines')}
              </h3>
              <Link to="/timeline" className="text-xs font-semibold text-purple-600 hover:text-purple-700">
                View All
              </Link>
            </div>

            <div className="space-y-2.5">
              {deadlines.slice(0, 4).map((dl) => (
                <div
                  key={dl.opportunityId}
                  onClick={() => setSelectedOpportunityId(dl.opportunityId)}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 truncate">{dl.title}</p>
                    <p className="text-[11px] text-slate-500">{dl.applicationDeadline}</p>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2 py-1 rounded-full shrink-0 ${
                      dl.urgencyColor === 'RED'
                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                        : dl.urgencyColor === 'YELLOW'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {dl.daysLeft}d left
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Completion Ring & Progress */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              {t('profileCompletion')}
            </h3>

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-purple-600"
                    strokeDasharray={`${profilePercent}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-black text-slate-800">
                  {profilePercent}%
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">Ready for Intelligence Analysis</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {t('profileCompleteDesc')}
                </p>
                <Link to="/profile" className="text-[11px] font-bold text-purple-600 hover:text-purple-700 mt-1 block">
                  Edit Profile Records →
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">{t('quickActions')}</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/planner"
                className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold transition-colors flex items-center gap-2"
              >
                <Network className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="truncate">Plan Trajectory</span>
              </Link>
              <Link
                to="/documents"
                className="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold transition-colors flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="truncate">Check Documents</span>
              </Link>
              <Link
                to="/timeline"
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">Exam Clashes</span>
              </Link>
              <Link
                to="/notice-reader"
                className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">AI Notice Reader</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunity Details Modal */}
      {selectedOpportunityId && (
        <OpportunityDetailModal
          opportunityId={selectedOpportunityId}
          onClose={() => setSelectedOpportunityId(null)}
        />
      )}
    </div>
  );
};
