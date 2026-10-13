import React, { useState, useEffect } from 'react';
import {
  Network,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Banknote,
  Hourglass,
  Calendar,
  AlertTriangle,
  Layers,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  CheckSquare
} from 'lucide-react';
import { planApi, opportunityApi, costApi, ageClockApi } from '../services/api';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { OpportunityDetailModal } from '../components/OpportunityDetailModal';

export const BestPlanPage = () => {
  const { profile, savedIds } = useProfile();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [maxPick, setMaxPick] = useState(3);
  const [planResult, setPlanResult] = useState(null);
  const [costResult, setCostResult] = useState(null);
  const [ageClockItems, setAgeClockItems] = useState([]);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);

  // Load catalog opportunities initially
  useEffect(() => {
    opportunityApi.getOpportunities().then((ops) => {
      setAllOpportunities(ops || []);
      // Initially select either saved opportunities or a sensible top batch
      if (savedIds && savedIds.size > 0) {
        setSelectedCandidateIds(Array.from(savedIds));
      } else if (ops && ops.length > 0) {
        // Select first 8
        setSelectedCandidateIds(ops.slice(0, 8).map((o) => o.id));
      }
    });

    ageClockApi.getClock().then((data) => {
      setAgeClockItems(data || []);
    });
  }, [savedIds]);

  // Run planner algorithm
  const handleGeneratePlan = async () => {
    if (selectedCandidateIds.length === 0) return;
    try {
      setLoading(true);
      const res = await planApi.getBestCombination(selectedCandidateIds, maxPick);
      setPlanResult(res);

      if (res && res.chosenOpportunities?.length > 0) {
        const chosenIds = res.chosenOpportunities.map((o) => o.id);
        const costs = await costApi.estimate(chosenIds);
        setCostResult(costs);
      } else {
        setCostResult(null);
      }
    } catch (err) {
      console.error('Failed to synthesize best plan combination', err);
    } finally {
      setLoading(false);
    }
  };

  // Run on first load once candidate IDs are set
  useEffect(() => {
    if (selectedCandidateIds.length > 0 && !planResult) {
      handleGeneratePlan();
    }
  }, [selectedCandidateIds]);

  const toggleCandidateSelection = (id) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedCandidateIds(allOpportunities.map((o) => o.id));
  };

  const selectSavedOnly = () => {
    if (savedIds && savedIds.size > 0) {
      setSelectedCandidateIds(Array.from(savedIds));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider">
            Weighted Optimization Engine
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Network className="w-6 h-6 text-purple-600" />
          {t('plannerTitle')}
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl">
          {t('plannerSubtitle')}
        </p>
      </div>

      {/* Configuration & Selection Panel */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Candidate Pool Selection ({selectedCandidateIds.length} Selected)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select which opportunities the optimization engine should evaluate.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Capacity Pick:</span>
              <select
                value={maxPick}
                onChange={(e) => setMaxPick(parseInt(e.target.value))}
                className="px-2.5 py-1 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
              >
                <option value={2}>2 Opportunities</option>
                <option value={3}>3 Opportunities</option>
                <option value={4}>4 Opportunities</option>
                <option value={5}>5 Opportunities</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={selectSavedOnly}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition-colors"
              >
                Saved Only
              </button>
              <button
                onClick={selectAll}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition-colors"
              >
                Select All ({allOpportunities.length})
              </button>
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={loading || selectedCandidateIds.length === 0}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-900/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {loading ? 'Synthesizing...' : 'Run Optimization'}
            </button>
          </div>
        </div>

        {/* Candidate Pills Selector */}
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
          {allOpportunities.map((op) => {
            const isSelected = selectedCandidateIds.includes(op.id);
            return (
              <button
                key={op.id}
                onClick={() => toggleCandidateSelection(op.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-2xs'
                    : 'bg-slate-50 border-slate-200/80 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    op.type === 'HIGHER_STUDIES'
                      ? 'bg-indigo-500'
                      : op.type === 'SCHOLARSHIP'
                      ? 'bg-teal-500'
                      : 'bg-orange-500'
                  }`}
                />
                <span className="truncate max-w-[220px]">{op.title}</span>
                {isSelected && <span className="text-purple-600">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Plan Results Container */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-800">Synthesizing Optimal Trajectory...</p>
          <p className="text-xs text-slate-400 mt-1">Pruning date collisions and checking exclusivity groups</p>
        </div>
      ) : planResult && (
        <div className="space-y-6">
          {/* Executive Summary Banner */}
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl border border-purple-800/40 shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Optimal Non-Conflicting Trajectory Synthesized
                </span>
                <p className="text-sm text-purple-100 font-medium leading-relaxed mt-2">
                  {planResult.executiveSummary}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-xs">
                <div>
                  <span className="text-[10px] text-purple-200 block uppercase font-bold">
                    Composite Score
                  </span>
                  <span className="text-2xl font-black text-white">
                    {planResult.compositeScore}
                  </span>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div>
                  <span className="text-[10px] text-purple-200 block uppercase font-bold">
                    Target Set
                  </span>
                  <span className="text-2xl font-black text-emerald-400">
                    {planResult.chosenCount}/{planResult.totalOpportunitiesEvaluated}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chosen Trajectory + Rejected Candidates */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chosen Trajectory (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  {t('recommendedCombination')} ({planResult.chosenOpportunities?.length})
                </h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  100% Conflict Free
                </span>
              </div>

              <div className="space-y-3">
                {planResult.chosenOpportunities?.map((op, idx) => (
                  <div
                    key={op.id}
                    onClick={() => setSelectedOpportunityId(op.id)}
                    className="bg-white p-5 rounded-3xl border border-emerald-200 hover:border-purple-300 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-xs shrink-0 mt-0.5">
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                op.type === 'HIGHER_STUDIES'
                                  ? 'bg-indigo-50 text-indigo-700'
                                  : op.type === 'SCHOLARSHIP'
                                  ? 'bg-teal-50 text-teal-700'
                                  : 'bg-orange-50 text-orange-700'
                              }`}
                            >
                              {op.type.replace('_', ' ')}
                            </span>
                            {op.exclusivityGroup && (
                              <span className="text-[10px] bg-amber-50 text-amber-800 font-semibold px-2 py-0.5 rounded">
                                Group: {op.exclusivityGroup}
                              </span>
                            )}
                          </div>

                          <h4 className="font-extrabold text-slate-900 text-base mt-1 group-hover:text-purple-600 transition-colors">
                            {op.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">{op.subtitle}</p>

                          <div className="flex flex-wrap items-center gap-3 pt-2 mt-2 border-t border-slate-100 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              Deadline: {op.applicationDeadline}
                            </span>
                            {op.examDate && (
                              <span className="flex items-center gap-1 font-semibold text-slate-700">
                                <Clock className="w-3.5 h-3.5 text-orange-500" />
                                Exam: {op.examDate}
                              </span>
                            )}
                            <span className="font-bold text-slate-800">
                              Fee: {op.applicationFee === 0 ? 'Free' : `₹${op.applicationFee}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rejected Candidates & Reasons (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  {t('rejectedWithReasons')} ({planResult.rejectedOpportunities?.length})
                </h3>
              </div>

              {planResult.rejectedOpportunities?.length === 0 ? (
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
                  No opportunities were rejected from candidate set.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[480px] overflow-y-auto">
                  {planResult.rejectedOpportunities?.map((rej) => (
                    <div
                      key={rej.opportunityId}
                      className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            rej.rejectionType === 'DATE_CLASH'
                              ? 'bg-rose-100 text-rose-700'
                              : rej.rejectionType === 'EXCLUSION_CONFLICT'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {rej.rejectionType?.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-snug">{rej.title}</p>
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug">{rej.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Combined Preparation Syllabus by Shared Topic */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  {t('combinedStudyPlan')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Unified curriculum roadmap maximizing syllabus overlap across your selected {planResult.chosenCount} target opportunities.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-slate-400 block">Total Est. Preparation</span>
                <span className="text-base font-black text-purple-700">
                  ~{planResult.estimatedTotalHours} Hours
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {planResult.combinedStudyPlan?.map((planItem, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-purple-50/40 border border-purple-100 hover:border-purple-200 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-purple-950 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-purple-200 text-purple-800 text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      {planItem.topic}
                    </h4>
                    <span className="text-xs font-black text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                      ~{planItem.hoursSuggested} hrs
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">
                      Covers Selected Targets:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {planItem.coveredOpportunities?.map((opTitle, oIdx) => (
                        <span
                          key={oIdx}
                          className="text-[11px] bg-white font-medium text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                        >
                          {opTitle}
                        </span>
                      ))}
                    </div>
                  </div>

                  {planItem.coreSubtopics && planItem.coreSubtopics.length > 0 && (
                    <div className="pt-2 border-t border-purple-100/80">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">
                        Core Focus Units:
                      </span>
                      <ul className="text-xs text-slate-600 space-y-0.5 list-disc list-inside">
                        {planItem.coreSubtopics.map((sub, sIdx) => (
                          <li key={sIdx}>{sub}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-white border border-purple-100/60 text-[11px] text-purple-800 font-medium">
                    💡 {planItem.strategyTip}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Estimate & Fee Waiver Matrix */}
          {costResult && (
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    Combined Financial Investment & Waiver Analysis
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Estimated fees, category waiver discounts ({profile?.category || 'General'}), and travel budget.
                  </p>
                </div>
                <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Net Investment: ₹{costResult.totalNetCost?.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block">Base Application Fees</span>
                  <span className="text-lg font-black text-slate-800">
                    ₹{costResult.totalBaseFee?.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <span className="text-[11px] font-bold text-emerald-700 block">Waiver Savings</span>
                  <span className="text-lg font-black text-emerald-800">
                    -₹{costResult.totalWaiverSavings?.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block">Estimated Travel/Test Center</span>
                  <span className="text-lg font-black text-slate-800">
                    +₹{costResult.totalTravelCost?.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                  <span className="text-[11px] font-bold text-purple-700 block">Total Net Budget</span>
                  <span className="text-lg font-black text-purple-900">
                    ₹{costResult.totalNetCost?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Cost Breakdown per item */}
              <div className="space-y-2">
                {costResult.breakdowns?.map((item) => (
                  <div
                    key={item.opportunityId}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs border border-slate-100"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block">{item.title}</span>
                      <span className="text-[11px] text-slate-500">{item.waiverNote}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-800 block">
                        ₹{item.netCost}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        (Fee: ₹{item.waivedFee} + Travel: ₹{item.estimatedTravelCost})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Age & Attempt Clock Widget */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Hourglass className="w-5 h-5 text-orange-600" />
                  Government Exam Age & Attempt Horizon Clock
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calculates your exact age-out year and remaining attempt allowance based on current age ({profile?.age || 21} years).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {ageClockItems.map((item) => (
                <div
                  key={item.opportunityId}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.urgencyLevel === 'CRITICAL'
                      ? 'bg-rose-50/70 border-rose-200'
                      : item.urgencyLevel === 'MODERATE'
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-slate-50/80 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-800 truncate pr-2">{item.title}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        item.urgencyLevel === 'CRITICAL'
                          ? 'bg-rose-200 text-rose-900 animate-pulse'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      Max Age: {item.maxAge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 font-medium">{item.statusMessage}</p>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      Attempts:{' '}
                      <strong className="text-slate-800">
                        {item.attemptsRemaining !== null ? `${item.attemptsRemaining} remaining` : 'Unlimited'}
                      </strong>
                    </span>
                    <span className="font-bold text-purple-700">Horizon: {item.ageLimitYear}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
