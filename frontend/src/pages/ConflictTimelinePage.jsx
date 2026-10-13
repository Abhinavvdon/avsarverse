import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Bookmark,
  Calendar,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { conflictApi, savedApi, opportunityApi } from '../services/api';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { OpportunityDetailModal } from '../components/OpportunityDetailModal';

export const ConflictTimelinePage = () => {
  const { profile, savedIds } = useProfile();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState([]);
  const [conflicts, setConflicts] = useState(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL_SAVED'); // ALL_SAVED or ALL_OPPORTUNITIES

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        let targetOps;
        if (activeTab === 'ALL_SAVED') {
          targetOps = await savedApi.getSaved();
          if (!targetOps || targetOps.length === 0) {
            // fallback if no saved items
            targetOps = await opportunityApi.getOpportunities();
            targetOps = targetOps.slice(0, 8);
          }
        } else {
          targetOps = await opportunityApi.getOpportunities();
        }

        setOpportunities(targetOps || []);
        const targetIds = targetOps.map((o) => o.id);
        const conflictData = await conflictApi.detectConflicts(targetIds);
        setConflicts(conflictData);
      } catch (err) {
        console.error('Failed to load conflict timeline data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [activeTab, savedIds]);

  // Months timeline scale (from Nov 2026 through Oct 2027)
  const timelineMonths = [
    { label: 'Nov 26', year: 2026, month: 11 },
    { label: 'Dec 26', year: 2026, month: 12 },
    { label: 'Jan 27', year: 2027, month: 1 },
    { label: 'Feb 27', year: 2027, month: 2 },
    { label: 'Mar 27', year: 2027, month: 3 },
    { label: 'Apr 27', year: 2027, month: 4 },
    { label: 'May 27', year: 2027, month: 5 },
    { label: 'Jun 27', year: 2027, month: 6 },
    { label: 'Jul 27', year: 2027, month: 7 },
    { label: 'Aug 27', year: 2027, month: 8 },
    { label: 'Sep 27', year: 2027, month: 9 },
    { label: 'Oct 27', year: 2027, month: 10 },
  ];

  // Helper to place item on 12-month timeline percentage
  const getTimelinePosition = (dateStr) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    // Find index in timelineMonths
    const idx = timelineMonths.findIndex((tm) => tm.year === y && tm.month === m);
    if (idx === -1) return null;
    const monthWidth = 100 / timelineMonths.length;
    const dayRatio = (d - 1) / 30;
    return (idx * monthWidth) + (dayRatio * monthWidth);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
              Collision & Overlap Radar
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-purple-600" />
            {t('timelineTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            {t('timelineSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab(activeTab === 'ALL_SAVED' ? 'ALL_OPPORTUNITIES' : 'ALL_SAVED')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
          >
            {activeTab === 'ALL_SAVED' ? 'Inspect All Catalog Opportunities' : 'Show Only Saved Opportunities'}
          </button>
          <button
            onClick={() => navigate('/planner')}
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-900/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Resolve with Planner →
          </button>
        </div>
      </div>

      {/* Collision Metrics & Exclusivity Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Clashes Metric */}
        <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              {t('detectedClashes')}
            </span>
            <span className="text-lg font-black text-rose-900">
              {conflicts?.totalClashes || 0}
            </span>
          </div>
          <p className="text-[11px] text-rose-700 mt-1">
            Same-day exam collisions or coinciding application deadlines detected.
          </p>
        </div>

        {/* Exclusivity Conflicts Metric */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-600" />
              {t('exclusivityAlerts')}
            </span>
            <span className="text-lg font-black text-amber-900">
              {conflicts?.totalExclusions || 0}
            </span>
          </div>
          <p className="text-[11px] text-amber-700 mt-1">
            Mutually exclusive schemes that cannot be drawn concurrently by government rule.
          </p>
        </div>

        {/* Shared Preparation Synergy Metric */}
        <div className="bg-purple-50 border border-purple-200/80 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-800 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-600" />
              {t('sharedPrepSynergy')}
            </span>
            <span className="text-lg font-black text-purple-900">
              {conflicts?.totalSharedTopics || 0} Topics
            </span>
          </div>
          <p className="text-[11px] text-purple-700 mt-1">
            Syllabus areas whose single preparation yields compound scoring across multiple exams.
          </p>
        </div>
      </div>

      {/* Gantt-Style Timeline Visualization */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5 overflow-hidden">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            Gantt Schedule & Collision Windows (Nov 2026 – Oct 2027)
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
              Higher Studies
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-3 h-3 rounded-full bg-teal-500 inline-block" />
              Scholarships
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
              Govt Exams
            </span>
            <span className="flex items-center gap-1 text-red-600 font-bold">
              <span className="w-3 h-3 rounded-full bg-red-600 inline-block animate-ping" />
              Clash Pin
            </span>
          </div>
        </div>

        {/* Timeline Table Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[850px]">
            {/* Header Months */}
            <div className="grid grid-cols-12 border-b border-slate-200 text-center py-2 text-[11px] font-bold text-slate-500 bg-slate-50 rounded-xl mb-3">
              {timelineMonths.map((m, idx) => (
                <div key={idx} className="border-r border-slate-200/60 last:border-r-0">
                  {m.label}
                </div>
              ))}
            </div>

            {/* Opportunities Gantt Rows */}
            <div className="space-y-3">
              {opportunities.map((op) => {
                const deadlinePos = getTimelinePosition(op.applicationDeadline);
                const examPos = getTimelinePosition(op.examDate);

                // Check if this opportunity is involved in any date clash
                const isClashing = conflicts?.dateClashes?.some(
                  (c) => c.opportunity1Id === op.id || c.opportunity2Id === op.id
                );

                return (
                  <div
                    key={op.id}
                    onClick={() => setSelectedOpportunityId(op.id)}
                    className="p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/70 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            op.type === 'HIGHER_STUDIES'
                              ? 'bg-indigo-500'
                              : op.type === 'SCHOLARSHIP'
                              ? 'bg-teal-500'
                              : 'bg-orange-500'
                          }`}
                        />
                        <span className="font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                          {op.title}
                        </span>
                        {isClashing && (
                          <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Clash Warning
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span>Deadline: {op.applicationDeadline || 'Rolling'}</span>
                        {op.examDate && (
                          <span className="font-semibold text-slate-700">Exam: {op.examDate}</span>
                        )}
                      </div>
                    </div>

                    {/* Bar visualization */}
                    <div className="relative h-6 bg-slate-200/60 rounded-xl overflow-hidden">
                      {/* Window between deadline and exam if both present */}
                      {deadlinePos !== null && examPos !== null && examPos >= deadlinePos && (
                        <div
                          className="absolute top-1 bottom-1 rounded bg-purple-200/60"
                          style={{
                            left: `${deadlinePos}%`,
                            width: `${Math.max(2, examPos - deadlinePos)}%`,
                          }}
                        />
                      )}

                      {/* Application Deadline Marker */}
                      {deadlinePos !== null && (
                        <div
                          className="absolute top-0 bottom-0 w-3 -ml-1.5 bg-blue-600 rounded-sm shadow z-10 flex items-center justify-center text-[9px] text-white font-bold"
                          style={{ left: `${deadlinePos}%` }}
                          title={`Deadline: ${op.applicationDeadline}`}
                        >
                          D
                        </div>
                      )}

                      {/* Exam Date Marker */}
                      {examPos !== null && (
                        <div
                          className={`absolute top-0 bottom-0 w-3 -ml-1.5 rounded-sm shadow z-20 flex items-center justify-center text-[9px] text-white font-bold ${
                            isClashing ? 'bg-red-600 ring-2 ring-red-300 animate-pulse' : 'bg-orange-600'
                          }`}
                          style={{ left: `${examPos}%` }}
                          title={`Exam Date: ${op.examDate}`}
                        >
                          E
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Clashes Details & Exclusions Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Date Clashes List */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            Detected Date & Exam Collisions ({conflicts?.totalClashes || 0})
          </h3>

          {conflicts?.dateClashes?.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No date collisions found in the currently loaded selection!
            </p>
          ) : (
            <div className="space-y-3">
              {conflicts?.dateClashes?.map((clash, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border ${
                    clash.severity === 'CRITICAL'
                      ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                      : clash.severity === 'HIGH'
                      ? 'bg-orange-50/70 border-orange-200 text-orange-950'
                      : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        clash.severity === 'CRITICAL'
                          ? 'bg-rose-200 text-rose-900'
                          : clash.severity === 'HIGH'
                          ? 'bg-orange-200 text-orange-900'
                          : 'bg-amber-200 text-amber-900'
                      }`}
                    >
                      {clash.severity} • {clash.clashType?.replace('_', ' ')}
                    </span>
                    <span className="font-mono font-bold">
                      {clash.daysApart === 0 ? 'Same Day (0d apart)' : `${clash.daysApart} day(s) apart`}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 mt-1">
                    {clash.opportunity1Title} <span className="text-rose-600">vs</span> {clash.opportunity2Title}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">{clash.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exclusivity Conflicts List */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            Regulatory Exclusivity Collisions ({conflicts?.totalExclusions || 0})
          </h3>

          {conflicts?.exclusionConflicts?.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No exclusivity conflicts found in current selection.
            </p>
          ) : (
            <div className="space-y-3">
              {conflicts?.exclusionConflicts?.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                      MUTUALLY EXCLUSIVE
                    </span>
                    <span className="font-mono text-[11px] font-bold text-amber-800">
                      {ex.exclusivityGroup}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 mt-1">
                    {ex.opportunity1Title} <span className="text-amber-700">&</span> {ex.opportunity2Title}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">{ex.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shared Preparation Synergy Panel */}
      <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              {t('sharedPrepSynergy')} Across Selected Opportunities
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These shared syllabus modules offer high return-on-investment because studying them prepares you for 2 or more tests simultaneously.
            </p>
          </div>
          <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            {conflicts?.totalSharedTopics || 0} Synergies Found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conflicts?.sharedPrep?.map((topic, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 hover:border-purple-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-extrabold text-purple-950">{topic.topic}</span>
                <span className="text-xs font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                  Overlaps in {topic.opportunityCount} Exams
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Applicable Opportunities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {topic.opportunityTitles.map((title, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] font-semibold bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs"
                    >
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedOpportunityId && (
        <OpportunityDetailModal
          opportunityId={selectedOpportunityId}
          onClose={() => setSelectedOpportunityId(null)}
        />
      )}
    </div>
  );
};
