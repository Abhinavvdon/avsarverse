import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { documentApi, profileApi } from '../services/api';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';

export const DocumentsPage = () => {
  const { profile, toggleDocument, refreshProfile } = useProfile();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState(null);

  const fetchChecklist = async () => {
    try {
      setLoading(true);
      const data = await documentApi.getChecklist();
      setChecklist(data);
    } catch (err) {
      console.error('Failed to load document checklist', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, [profile]);

  const handleToggle = async (docKey) => {
    try {
      await toggleDocument(docKey);
      fetchChecklist();
    } catch (err) {
      console.error('Error toggling document', err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-in fade-in">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold uppercase tracking-wider">
            Buffer & Lead-Time Manager
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-teal-600" />
          {t('documentsTitle')}
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl">
          {t('documentsSubtitle')} We compute a strict <strong className="text-slate-800">"Start By"</strong> date for every certificate (Application Deadline minus processing days minus 3 days buffer).
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            {t('urgentDocuments')}
          </span>
          <p className="text-2xl font-black text-rose-900 mt-1">
            {checklist?.urgentCount || 0}
          </p>
          <p className="text-[11px] text-rose-600 mt-0.5">Start-by date past or within 7 days</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {t('pendingDocuments')}
          </span>
          <p className="text-2xl font-black text-amber-900 mt-1">
            {checklist?.pendingCount || 0}
          </p>
          <p className="text-[11px] text-amber-600 mt-0.5">Need procurement / renewal</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {t('readyDocuments')}
          </span>
          <p className="text-2xl font-black text-emerald-900 mt-1">
            {checklist?.readyCount || 0}
          </p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Verified in your student profile</p>
        </div>
      </div>

      {/* Aggregated Checklist List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-sm">
            Certificate Lead-Time Checklist (Ranked by Urgency)
          </h3>
          <span className="text-xs text-slate-400">
            {checklist?.totalDocuments || 0} Documents Tracked
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">
            Evaluating document buffers...
          </div>
        ) : (
          <div className="space-y-3">
            {checklist?.items?.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleToggle(item.key)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  item.alreadyPossessed
                    ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
                    : item.isUrgent
                    ? 'bg-rose-50/70 border-rose-200 text-rose-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={item.alreadyPossessed}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 mt-1 pointer-events-none cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm">{item.label}</span>
                      {item.isUrgent && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded-full bg-rose-200 text-rose-900 animate-pulse">
                          CRITICAL: START IMMEDIATELY
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Targeted for: <strong className="text-slate-700">{item.opportunityTitle}</strong>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-600">
                      <span>Processing Time: ~{item.processingDays} days</span>
                      <span>App Deadline: {item.deadline}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right sm:shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Calculated Start By Date
                  </span>
                  <span
                    className={`text-sm font-mono font-black ${
                      item.isUrgent ? 'text-rose-700' : 'text-slate-800'
                    }`}
                  >
                    {item.startByDate}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {item.alreadyPossessed
                      ? '✓ Document ready'
                      : item.daysUntilStartBy < 0
                      ? '⚠️ Overdue for submission'
                      : `~${item.daysUntilStartBy} days to begin`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
