import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Sparkles,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  RefreshCw,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { simulatorApi } from '../services/api';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { OpportunityDetailModal } from '../components/OpportunityDetailModal';

export const SimulatorPage = () => {
  const { profile } = useProfile();
  const { t } = useLanguage();

  const [overrides, setOverrides] = useState({
    percentage: 78.5,
    familyIncome: 280000,
    age: 21,
    graduationYear: 2027,
    category: 'OBC',
    state: 'Madhya Pradesh',
    yearOfStudy: 4,
  });

  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);

  // Sync with profile when profile loads
  useEffect(() => {
    if (profile) {
      setOverrides({
        percentage: profile.percentage || 78.5,
        familyIncome: profile.familyIncome || 280000,
        age: profile.age || 21,
        graduationYear: profile.graduationYear || 2027,
        category: profile.category || 'OBC',
        state: profile.state || 'Madhya Pradesh',
        yearOfStudy: profile.yearOfStudy || 4,
      });
    }
  }, [profile]);

  const runSimulation = async (params) => {
    try {
      setLoading(true);
      const res = await simulatorApi.run(params || overrides);
      setSimResult(res);
    } catch (err) {
      console.error('Failed to run simulation', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      runSimulation(overrides);
    }, 250);
    return () => clearTimeout(timer);
  }, [overrides]);

  const handleSliderChange = (field, value) => {
    setOverrides((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    if (profile) {
      const resetState = {
        percentage: profile.percentage || 78.5,
        familyIncome: profile.familyIncome || 280000,
        age: profile.age || 21,
        graduationYear: profile.graduationYear || 2027,
        category: profile.category || 'OBC',
        state: profile.state || 'Madhya Pradesh',
        yearOfStudy: profile.yearOfStudy || 4,
      };
      setOverrides(resetState);
      runSimulation(resetState);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in">
      {/* Page Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider">
            Predictive Decision Engine
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-purple-600" />
          {t('simulatorTitle')}
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl">
          {t('simulatorSubtitle')}
        </p>
      </div>

      {/* Grid: Controls on Left, Live Diff Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" />
                {t('adjustParameters')}
              </h3>
              <button
                onClick={handleReset}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t('resetSimulation')}
              </button>
            </div>

            {/* Percentage Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">{t('percentageMarks')}</label>
                <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200">
                  {overrides.percentage}%
                </span>
              </div>
              <input
                type="range"
                min={45}
                max={95}
                step={0.5}
                value={overrides.percentage}
                onChange={(e) => handleSliderChange('percentage', parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>45%</span>
                <span>60% (1st Div)</span>
                <span>75% (Distinction)</span>
                <span>95%</span>
              </div>
            </div>

            {/* Family Income Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">{t('annualIncome')}</label>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  ₹{(overrides.familyIncome / 100000).toFixed(2)} Lakhs
                </span>
              </div>
              <input
                type="range"
                min={100000}
                max={1200000}
                step={25000}
                value={overrides.familyIncome}
                onChange={(e) => handleSliderChange('familyIncome', parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>₹1 Lakh</span>
                <span>₹2.5L (EWS)</span>
                <span>₹6L (MMVY)</span>
                <span>₹12 Lakhs</span>
              </div>
            </div>

            {/* Age Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">{t('currentAge')}</label>
                <span className="text-xs font-extrabold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-200">
                  {overrides.age} Years
                </span>
              </div>
              <input
                type="range"
                min={18}
                max={42}
                step={1}
                value={overrides.age}
                onChange={(e) => handleSliderChange('age', parseInt(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>18</span>
                <span>26 (BARC)</span>
                <span>30 (IBPS/SBI)</span>
                <span>40 (MPPSC)</span>
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('socialCategory')}
              </label>
              <select
                value={overrides.category}
                onChange={(e) => handleSliderChange('category', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
              >
                <option value="General">General (Unreserved)</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
              </select>
            </div>

            {/* Domicile State */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('domicileState')}
              </label>
              <select
                value={overrides.state}
                onChange={(e) => handleSliderChange('state', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
              >
                <option value="Madhya Pradesh">Madhya Pradesh (MP Domicile)</option>
                <option value="Other">Other Non-MP State</option>
              </select>
            </div>

            {/* Year of study */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('studyYear')}
              </label>
              <select
                value={overrides.yearOfStudy}
                onChange={(e) => handleSliderChange('yearOfStudy', parseInt(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
              >
                <option value={1}>1st Year (Siemens eligible)</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year (GATE eligible)</option>
                <option value={4}>4th Year / Final Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Summary Metric Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {t('unlockedOpportunities')}
              </span>
              <p className="text-2xl font-black text-emerald-800 mt-1">
                +{simResult?.unlockedCount || 0}
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl">
              <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" /> {t('lostOpportunities')}
              </span>
              <p className="text-2xl font-black text-rose-800 mt-1">
                -{simResult?.lostCount || 0}
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl">
              <span className="text-[11px] font-bold text-purple-700">Simulated Eligible</span>
              <p className="text-2xl font-black text-purple-900 mt-1">
                {simResult?.totalSimulatedEligible || 0}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500">Current Base</span>
              <p className="text-2xl font-black text-slate-700 mt-1">
                {simResult?.totalCurrentEligible || 0}
              </p>
            </div>
          </div>

          {/* Differential Change Feed */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Live Opportunity Transition Differential
              </h3>
              <span className="text-xs text-slate-400">
                {simResult?.diffs?.length || 0} Impacted Schemes
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center">
                <RefreshCw className="w-6 h-6 text-purple-600 animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-500">Evaluating differential rules...</p>
              </div>
            ) : simResult?.diffs?.length === 0 ? (
              <div className="py-10 text-center text-slate-400 space-y-1">
                <Info className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-600">No eligibility state shifts</p>
                <p className="text-[11px]">
                  Adjust the sliders on the left (e.g. increase percentage to 85% or change category to SC/ST) to unlock new opportunities!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {simResult?.diffs?.map((diff) => (
                  <div
                    key={diff.opportunityId}
                    onClick={() => setSelectedOpportunityId(diff.opportunityId)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      diff.changeType === 'UNLOCKED'
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 hover:bg-emerald-50'
                        : 'bg-rose-50/70 border-rose-200 text-rose-950 hover:bg-rose-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        {diff.changeType === 'UNLOCKED' ? (
                          <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="p-1 rounded-lg bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                            <TrendingDown className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                diff.changeType === 'UNLOCKED'
                                  ? 'bg-emerald-200 text-emerald-900'
                                  : 'bg-rose-200 text-rose-900'
                              }`}
                            >
                              {diff.changeType}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">
                              {diff.type?.replace('_', ' ')}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm mt-1 text-slate-900 leading-snug">
                            {diff.title}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1">{diff.reason}</p>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-purple-600 shrink-0">
                        Details →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
