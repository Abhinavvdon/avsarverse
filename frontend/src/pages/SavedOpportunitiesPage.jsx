import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Calendar,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { savedApi, conflictApi, eligibilityApi } from '../services/api';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { OpportunityDetailModal } from '../components/OpportunityDetailModal';

export const SavedOpportunitiesPage = () => {
  const { profile, savedIds, toggleSaved } = useProfile();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [savedOps, setSavedOps] = useState([]);
  const [eligibilityMap, setEligibilityMap] = useState(new Map());
  const [conflicts, setConflicts] = useState(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ops, elig] = await Promise.all([
          savedApi.getSaved(),
          eligibilityApi.checkAll(profile),
        ]);
        setSavedOps(ops || []);
        if (elig) {
          setEligibilityMap(new Map(elig.map((item) => [item.opportunityId, item])));
        }

        if (ops && ops.length > 0) {
          const conflictData = await conflictApi.detectConflicts(ops.map((o) => o.id));
          setConflicts(conflictData);
        } else {
          setConflicts(null);
        }
      } catch (err) {
        console.error('Failed to load saved opportunities', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [savedIds, profile]);

  const handleRemove = async (id, e) => {
    e.stopPropagation();
    await toggleSaved(id);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider">
              Personal Watchlist
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-purple-600 fill-current" />
            {t('savedOpportunities')} ({savedOps.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track and compare your selected opportunities, monitor collisions, and plan your study focus.
          </p>
        </div>

        {savedOps.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/timeline')}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              Inspect on Timeline
            </button>
            <button
              onClick={() => navigate('/planner')}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-900/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Build Best Combination →
            </button>
          </div>
        )}
      </div>

      {/* Collision Alert Banner if saved items collide */}
      {conflicts && (conflicts.totalClashes > 0 || conflicts.totalExclusions > 0) && (
        <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 text-rose-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-200 text-rose-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-rose-900">
                Action Required: Conflicts Detected in Your Saved List
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Your saved shortlist contains {conflicts.totalClashes} date clash(es) and {conflicts.totalExclusions} regulatory exclusion(s). Use the Combination Planner to resolve them into a realistic strategy.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/planner')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 shadow-sm transition-colors cursor-pointer"
          >
            Resolve Conflicts Now
          </button>
        </div>
      )}

      {/* Saved Opportunities Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 font-medium">
          Loading saved opportunities...
        </div>
      ) : savedOps.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 space-y-3">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Your watchlist is currently empty</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Browse Higher Studies, Scholarships, or Government Exams and click the bookmark icon on any card to add it to your intelligence workspace.
          </p>
          <div className="pt-2">
            <Link
              to="/higher-studies"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl inline-block"
            >
              Explore Opportunities →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedOps.map((op) => {
            const elig = eligibilityMap.get(op.id);
            return (
              <div
                key={op.id}
                onClick={() => setSelectedOpportunityId(op.id)}
                className="bg-white rounded-3xl border border-slate-200/80 hover:border-purple-300 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        op.type === 'HIGHER_STUDIES'
                          ? 'bg-indigo-50 text-indigo-700'
                          : op.type === 'SCHOLARSHIP'
                          ? 'bg-teal-50 text-teal-700'
                          : 'bg-orange-50 text-orange-700'
                      }`}
                    >
                      {op.type.replace('_', ' ')}
                    </span>

                    <button
                      onClick={(e) => handleRemove(op.id, e)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-purple-600 transition-colors line-clamp-2 leading-tight">
                      {op.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{op.subtitle}</p>
                  </div>

                  {elig && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          elig.eligible
                            ? 'bg-emerald-100 text-emerald-800'
                            : elig.status === 'ALMOST_ELIGIBLE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {elig.matchScore}% Match
                      </span>
                      {op.exclusivityGroup && (
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                          Group: {op.exclusivityGroup}
                        </span>
                      )}
                    </div>
                  )}

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
                        Exam Date
                      </span>
                      <span className="font-bold text-slate-700">
                        {op.examDate || 'Merit / None'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    {op.applicationFee === 0 ? 'Free' : `₹${op.applicationFee}`}
                  </span>
                  <span className="font-bold text-purple-600 group-hover:translate-x-0.5 transition-transform">
                    {t('viewDetails')} →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedOpportunityId && (
        <OpportunityDetailModal
          opportunityId={selectedOpportunityId}
          onClose={() => setSelectedOpportunityId(null)}
        />
      )}
    </div>
  );
};
