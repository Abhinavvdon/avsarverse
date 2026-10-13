import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  Calendar,
  Clock,
  Bookmark,
  Flag,
  Sparkles,
  ArrowUpDown,
  FileCheck
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { opportunityApi, eligibilityApi } from '../services/api';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { OpportunityDetailModal } from '../components/OpportunityDetailModal';

export const OpportunitiesPage = ({ type, title, subtitle, colorScheme }) => {
  const { profile, savedIds, toggleSaved } = useProfile();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState([]);
  const [eligibilityMap, setEligibilityMap] = useState(new Map());
  const [filterQuery, setFilterQuery] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ELIGIBLE, ALMOST_ELIGIBLE, NOT_ELIGIBLE
  const [sortBy, setSortBy] = useState('MATCH'); // MATCH, DEADLINE, FEE
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ops, elig] = await Promise.all([
          opportunityApi.getOpportunities(type, filterQuery),
          eligibilityApi.checkAll(profile)
        ]);
        setOpportunities(ops || []);
        if (elig) {
          const map = new Map(elig.map((item) => [item.opportunityId, item]));
          setEligibilityMap(map);
        }
      } catch (err) {
        console.error('Failed to fetch opportunities', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, filterQuery, profile]);

  const handleReportOutdated = async (id, e) => {
    e.stopPropagation();
    try {
      await opportunityApi.reportOutdated(id);
      setOpportunities((prev) =>
        prev.map((op) =>
          op.id === id ? { ...op, isOutdatedReports: (op.isOutdatedReports || 0) + 1 } : op
        )
      );
    } catch (err) {
      console.error('Failed to report outdated info', err);
    }
  };

  // Filter & sort list
  const filteredList = opportunities.filter((op) => {
    const elig = eligibilityMap.get(op.id);
    if (statusFilter === 'ELIGIBLE' && !elig?.eligible) return false;
    if (statusFilter === 'ALMOST_ELIGIBLE' && elig?.status !== 'ALMOST_ELIGIBLE') return false;
    if (statusFilter === 'NOT_ELIGIBLE' && (elig?.eligible || elig?.status === 'ALMOST_ELIGIBLE')) return false;
    return true;
  });

  const sortedList = [...filteredList].sort((a, b) => {
    const eligA = eligibilityMap.get(a.id);
    const eligB = eligibilityMap.get(b.id);
    if (sortBy === 'MATCH') {
      return (eligB?.matchScore || 0) - (eligA?.matchScore || 0);
    } else if (sortBy === 'DEADLINE') {
      return (a.applicationDeadline || '').localeCompare(b.applicationDeadline || '');
    } else if (sortBy === 'FEE') {
      return (a.applicationFee || 0) - (b.applicationFee || 0);
    }
    return 0;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in">
      {/* Category Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                type === 'HIGHER_STUDIES'
                  ? 'bg-indigo-100 text-indigo-700'
                  : type === 'SCHOLARSHIP'
                  ? 'bg-teal-100 text-teal-700'
                  : 'bg-orange-100 text-orange-700'
              }`}
            >
              Category Hub
            </span>
            <span className="text-xs text-slate-400">
              {opportunities.length} opportunities available
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search in this category..."
              className="pl-8 pr-3 py-1.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200 w-52"
            />
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 text-xs">
            <span className="text-slate-400 pl-2 text-[11px] font-semibold flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none px-2 py-0.5 cursor-pointer text-xs"
            >
              <option value="MATCH">Match Score</option>
              <option value="DEADLINE">Deadline</option>
              <option value="FEE">Application Fee</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'ALL', label: t('all'), count: opportunities.length },
          {
            key: 'ELIGIBLE',
            label: t('eligible'),
            count: opportunities.filter((o) => eligibilityMap.get(o.id)?.eligible).length,
            color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          },
          {
            key: 'ALMOST_ELIGIBLE',
            label: t('almostEligible'),
            count: opportunities.filter((o) => eligibilityMap.get(o.id)?.status === 'ALMOST_ELIGIBLE').length,
            color: 'text-amber-700 bg-amber-50 border-amber-200',
          },
          {
            key: 'NOT_ELIGIBLE',
            label: t('notEligible'),
            count: opportunities.filter(
              (o) =>
                eligibilityMap.get(o.id) &&
                !eligibilityMap.get(o.id).eligible &&
                eligibilityMap.get(o.id).status !== 'ALMOST_ELIGIBLE'
            ).length,
            color: 'text-rose-700 bg-rose-50 border-rose-200',
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                statusFilter === tab.key ? 'bg-purple-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Opportunity Cards Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-9 h-9 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Filtering opportunities with rule evaluator...</p>
        </div>
      ) : sortedList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <p className="text-base font-bold text-slate-700">No matching opportunities found</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting the status filter or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedList.map((op) => {
            const elig = eligibilityMap.get(op.id);
            const isSaved = savedIds?.has(op.id);

            return (
              <div
                key={op.id}
                onClick={() => setSelectedOpportunityId(op.id)}
                className="bg-white rounded-3xl border border-slate-200/80 hover:border-purple-300 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-3">
                  {/* Card Header: Eligibility & Save */}
                  <div className="flex items-start justify-between gap-2">
                    {elig && (
                      <span
                        className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                          elig.eligible
                            ? 'bg-emerald-100 text-emerald-800'
                            : elig.status === 'ALMOST_ELIGIBLE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {elig.eligible ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5" />
                        )}
                        {elig.status === 'ALMOST_ELIGIBLE'
                          ? t('almostEligible')
                          : elig.eligible
                          ? t('eligible')
                          : t('notEligible')}{' '}
                        ({elig.matchScore}%)
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaved(op.id);
                      }}
                      className={`p-1.5 rounded-xl border transition-colors ${
                        isSaved
                          ? 'bg-purple-50 text-purple-600 border-purple-200'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700'
                      }`}
                      title={isSaved ? 'Unsave' : 'Save opportunity'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-purple-600 transition-colors line-clamp-2 leading-tight">
                      {op.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{op.subtitle}</p>
                  </div>

                  {/* Primary Gap Preview if ineligible */}
                  {!elig?.eligible && elig?.primaryGap && (
                    <div className="p-2.5 bg-rose-50/70 border border-rose-100 rounded-xl text-[11px] text-rose-800 leading-snug">
                      <span className="font-bold">Variance: </span>
                      {elig.primaryGap}
                    </div>
                  )}

                  {/* Exclusivity pill if present */}
                  {op.exclusivityGroup && (
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                      <span>Group: {op.exclusivityGroup}</span>
                    </div>
                  )}

                  {/* Dates & Fee Snippet */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Deadline
                      </span>
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {op.applicationDeadline}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Fee
                      </span>
                      <span className="font-bold text-slate-700">
                        {op.applicationFee === 0 ? 'Free' : `₹${op.applicationFee}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    {op.lastVerified && (
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-medium">
                        ✓ {t('lastVerified')}
                      </span>
                    )}
                    <button
                      onClick={(e) => handleReportOutdated(op.id, e)}
                      className="text-[11px] text-slate-400 hover:text-red-500 transition-colors p-1"
                      title={t('reportOutdated')}
                    >
                      <Flag className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-xs font-bold text-purple-600 group-hover:translate-x-0.5 transition-transform">
                    {t('viewDetails')} →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedOpportunityId && (
        <OpportunityDetailModal
          opportunityId={selectedOpportunityId}
          onClose={() => setSelectedOpportunityId(null)}
          onReportOutdated={(id) => {
            setOpportunities((prev) =>
              prev.map((op) =>
                op.id === id ? { ...op, isOutdatedReports: (op.isOutdatedReports || 0) + 1 } : op
              )
            );
          }}
        />
      )}
    </div>
  );
};
