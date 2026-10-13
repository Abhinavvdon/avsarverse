import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Calendar,
  Clock,
  FileCheck,
  Bookmark,
  Flag,
  Sparkles,
  Layers,
  Banknote
} from 'lucide-react';
import { eligibilityApi, opportunityApi } from '../services/api';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';

export const OpportunityDetailModal = ({ opportunityId, onClose, onReportOutdated }) => {
  const { profile, savedIds, toggleSaved } = useProfile();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [outdatedReported, setOutdatedReported] = useState(false);

  useEffect(() => {
    if (!opportunityId) return;
    setLoading(true);
    eligibilityApi
      .checkSingle(opportunityId)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error('Failed to load opportunity eligibility details', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [opportunityId, profile]);

  if (!opportunityId) return null;

  const isSaved = savedIds?.has(Number(opportunityId));
  const op = data?.opportunity;

  const handleReportOutdated = async () => {
    if (!op || outdatedReported) return;
    try {
      await opportunityApi.reportOutdated(op.id);
      setOutdatedReported(true);
      if (onReportOutdated) onReportOutdated(op.id);
    } catch (err) {
      console.error('Error reporting outdated', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  op?.type === 'HIGHER_STUDIES'
                    ? 'bg-indigo-100 text-indigo-700'
                    : op?.type === 'SCHOLARSHIP'
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {op?.type ? op.type.replace('_', ' ') : 'OPPORTUNITY'}
              </span>

              {data && (
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    data.eligible
                      ? 'bg-emerald-100 text-emerald-700'
                      : data.status === 'ALMOST_ELIGIBLE'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {data.eligible ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {data.status === 'ALMOST_ELIGIBLE'
                    ? t('almostEligible')
                    : data.eligible
                    ? t('eligible')
                    : t('notEligible')}{' '}
                  • {data.matchScore}% Match
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{op?.title}</h3>
            <p className="text-xs text-slate-500">{op?.subtitle}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500">Evaluating eligibility rules with your profile...</p>
            </div>
          ) : (
            <>
              {/* Description */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-600 leading-relaxed">{op?.description}</p>
                {op?.lastVerified && (
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">
                    Verified on: {op.lastVerified} • Sample data – verify on official site
                  </p>
                )}
              </div>

              {/* Eligibility Criteria Breakdown */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Rule-by-Rule Eligibility Verification
                  </h4>
                  <span className="text-xs font-semibold text-slate-500">
                    {data?.criteria?.filter((c) => c.passed).length} of {data?.criteria?.length} passed
                  </span>
                </div>

                <div className="space-y-2.5">
                  {data?.criteria?.map((c, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-2xl border transition-colors ${
                        c.passed
                          ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
                          : 'bg-rose-50/50 border-rose-200/80 text-rose-950'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          {c.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="text-xs font-bold leading-snug">{c.label}</p>
                            <p
                              className={`text-xs mt-1 font-medium ${
                                c.passed ? 'text-emerald-700' : 'text-rose-700 font-semibold'
                              }`}
                            >
                              {c.gapExplanation}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                            Your Record
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-700">
                            {c.studentValue}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline & Fees Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" /> Application Deadline
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {op?.applicationDeadline || 'Rolling'}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-600" /> Exam Date
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {op?.examDate || 'No written test / Merit based'}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1 flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5 text-emerald-600" /> Application Fee
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {op?.applicationFee === 0 ? 'Free (₹0)' : `₹${op?.applicationFee}`}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" /> Exclusivity Group
                  </span>
                  <span className="text-xs font-bold text-slate-800 truncate block">
                    {op?.exclusivityGroup ? (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono text-[11px]">
                        {op.exclusivityGroup}
                      </span>
                    ) : (
                      'None (Can combine freely)'
                    )}
                  </span>
                </div>
              </div>

              {/* Fee Waiver Information */}
              {op?.feeWaiverCategories && op.feeWaiverCategories.length > 0 && (
                <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 text-xs text-purple-900">
                  <span className="font-bold">Fee Waiver Categories: </span>
                  {op.feeWaiverCategories.join(', ')}
                  {profile && op.feeWaiverCategories.includes(profile.category) && (
                    <span className="ml-2 font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                      Qualifies for full waiver!
                    </span>
                  )}
                </div>
              )}

              {/* Required Documents */}
              {op?.requiredDocuments && op.requiredDocuments.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-purple-600" />
                    Required Documents Checklist
                  </h4>
                  <div className="space-y-2">
                    {op.requiredDocuments.map((doc, idx) => {
                      const hasDoc = profile?.completedDocuments?.includes(doc.key);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                hasDoc ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {hasDoc ? '✓' : '•'}
                            </span>
                            <span className="font-medium text-slate-800">{doc.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400">
                              ~{doc.processingDays} days processing
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                hasDoc ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {hasDoc ? 'In Profile' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReportOutdated}
              disabled={outdatedReported}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors flex items-center gap-1.5 disabled:opacity-60"
            >
              <Flag className="w-3.5 h-3.5" />
              {outdatedReported ? 'Reported (Thank you)' : t('reportOutdated')}
            </button>

            {op?.sourceUrl && (
              <a
                href={op.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl text-xs font-semibold text-purple-700 hover:bg-purple-50 border border-purple-200 transition-colors flex items-center gap-1.5"
              >
                Official Site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaved(opportunityId)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                isSaved
                  ? 'bg-slate-800 text-white hover:bg-slate-900'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? t('saved') : t('saveOpportunity')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
