import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Plus,
  Calendar,
  Clock,
  Banknote,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { aiNoticeApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const NoticeReaderPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [noticeText, setNoticeText] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [extractedDraft, setExtractedDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const sampleNotice = `MADHYA PRADESH PUBLIC SERVICE COMMISSION, INDORE
ADVERTISEMENT NO. 04/2027/EXAM - STATE ENGINEERING SERVICE EXAMINATION 2027
Online applications are invited from Indian citizens with domicile of Madhya Pradesh for recruitment to the posts of Assistant Engineer (Civil/Electrical/Mechanical/Computer Science) in the Water Resources Department, Public Works Department (PWD), and Panchayat & Rural Development Department.
1. Essential Eligibility Qualification:
Candidate must hold a Bachelor's Degree in Engineering or Technology (B.Tech / B.E.) with at least 60% marks from a recognized university.
2. Age Criteria:
Minimum age 21 years and maximum age 30 years as of 1st January 2027. (Relaxation applicable for reserved categories).
3. Important Dates:
Online application opens on: 15-11-2026.
Last date for submission of online application: 30-12-2026.
Date of Preliminary Written Examination: 14-03-2027.
4. Application Fee:
Unreserved / General candidates: ₹500. Domiciled SC/ST/OBC (NCL) candidates: ₹250.
5. Mandatory Documents:
MP Domicile Certificate, Class 10 Certificate for date of birth, Engineering Degree Marksheet, Valid MP Employment Portal (Rojgar Panjiyan) registration card.`;

  const handleExtract = async () => {
    if (!noticeText.trim()) return;
    try {
      setExtracting(true);
      const draft = await aiNoticeApi.extractNotice(noticeText);
      setExtractedDraft(draft);
    } catch (err) {
      console.error('Extraction error', err);
    } finally {
      setExtracting(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!extractedDraft) return;
    try {
      setSaving(true);
      await aiNoticeApi.saveDraft(extractedDraft);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        navigate('/government-exams');
      }, 1500);
    } catch (err) {
      console.error('Failed to save drafted opportunity', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDraftChange = (field, value) => {
    setExtractedDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-in fade-in">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Powered by Gemini API & NLP
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-600" />
          {t('noticeReaderTitle')}
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl">
          {t('noticeReaderSubtitle')}
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-purple-600" /> Paste Official Gazette / PDF Notification Text
          </label>
          <button
            onClick={() => setNoticeText(sampleNotice)}
            className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200 cursor-pointer"
          >
            {t('loadSample')}
          </button>
        </div>

        <textarea
          rows={7}
          value={noticeText}
          onChange={(e) => setNoticeText(e.target.value)}
          placeholder={t('pasteNoticeHere')}
          className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/60 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 resize-y leading-relaxed"
        />

        <div className="flex justify-end">
          <button
            onClick={handleExtract}
            disabled={extracting || !noticeText.trim()}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-900/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {extracting ? t('extracting') : t('extractButton')}
          </button>
        </div>
      </div>

      {/* Extracted Draft Section */}
      {extractedDraft && (
        <div className="bg-white p-7 rounded-3xl border border-purple-200 shadow-md space-y-5 animate-in fade-in">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Ready For Human Review
                </span>
                {extractedDraft.note && (
                  <span className="text-[10px] text-slate-400 italic">
                    {extractedDraft.note}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {t('extractedDraft')}
              </h3>
            </div>

            <button
              onClick={handleSaveToDatabase}
              disabled={saving}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />
              {saving ? 'Adding...' : t('addToOpportunities')}
            </button>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Successfully saved to opportunity database! Redirecting...
            </div>
          )}

          {/* Editable Fields Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Title</label>
              <input
                type="text"
                value={extractedDraft.title || ''}
                onChange={(e) => handleDraftChange('title', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Subtitle / Department</label>
              <input
                type="text"
                value={extractedDraft.subtitle || ''}
                onChange={(e) => handleDraftChange('subtitle', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Opportunity Type</label>
              <select
                value={extractedDraft.type || 'GOVT_EXAM'}
                onChange={(e) => handleDraftChange('type', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
              >
                <option value="GOVT_EXAM">Government Exam</option>
                <option value="HIGHER_STUDIES">Higher Studies</option>
                <option value="SCHOLARSHIP">Scholarship</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Official Portal URL</label>
              <input
                type="text"
                value={extractedDraft.sourceUrl || ''}
                onChange={(e) => handleDraftChange('sourceUrl', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Application Deadline</label>
              <input
                type="date"
                value={extractedDraft.applicationDeadline || ''}
                onChange={(e) => handleDraftChange('applicationDeadline', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Exam Date (Optional)</label>
              <input
                type="date"
                value={extractedDraft.examDate || ''}
                onChange={(e) => handleDraftChange('examDate', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Application Fee (₹)</label>
              <input
                type="number"
                value={extractedDraft.applicationFee || 0}
                onChange={(e) => handleDraftChange('applicationFee', parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Exclusivity Group (Optional)</label>
              <input
                type="text"
                value={extractedDraft.exclusivityGroup || ''}
                onChange={(e) => handleDraftChange('exclusivityGroup', e.target.value)}
                placeholder="e.g. MP_STATE_SCHOLARSHIP"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={extractedDraft.description || ''}
              onChange={(e) => handleDraftChange('description', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {/* Extracted Eligibility Rules Preview */}
          {extractedDraft.rules && extractedDraft.rules.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2">
                Parsed Eligibility Rules ({extractedDraft.rules.length})
              </h4>
              <div className="space-y-1.5">
                {extractedDraft.rules.map((rule, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{rule.label}</span>
                      <span className="text-[11px] text-slate-500 ml-2 font-mono">
                        ({rule.field} {rule.operator} {rule.value})
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      Parsed Rule
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Required Documents Preview */}
          {extractedDraft.requiredDocuments && extractedDraft.requiredDocuments.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2">
                Parsed Required Documents ({extractedDraft.requiredDocuments.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {extractedDraft.requiredDocuments.map((doc, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-xl border border-slate-200 font-medium"
                  >
                    📄 {doc.label} (~{doc.processingDays}d)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
