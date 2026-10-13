import React, { useState, useEffect } from 'react';
import {
  User,
  Save,
  CheckCircle2,
  FileCheck,
  Shield,
  GraduationCap,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Banknote
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';

export const ProfilePage = () => {
  const { profile, updateProfile, toggleDocument } = useProfile();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    course: '',
    yearOfStudy: 4,
    age: 21,
    state: 'Madhya Pradesh',
    category: 'OBC',
    familyIncome: 280000,
    percentage: 78.5,
    graduationYear: 2027,
    preferredLanguage: 'en',
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        course: profile.course || '',
        yearOfStudy: profile.yearOfStudy || 4,
        age: profile.age || 21,
        state: profile.state || 'Madhya Pradesh',
        category: profile.category || 'OBC',
        familyIncome: profile.familyIncome || 280000,
        percentage: profile.percentage || 78.5,
        graduationYear: profile.graduationYear || 2027,
        preferredLanguage: profile.preferredLanguage || 'en',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'yearOfStudy' || name === 'age' || name === 'graduationYear'
          ? parseInt(value) || 0
          : name === 'percentage' || name === 'familyIncome'
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile', err);
    } finally {
      setSaving(false);
    }
  };

  const documentCatalogue = [
    { key: 'aadhaar', label: 'Aadhaar Card (Linked with Mobile)', days: 2 },
    { key: 'marksheet_10', label: 'Class 10th Board Certificate / Marksheet', days: 2 },
    { key: 'marksheet_12', label: 'Class 12th Board Marksheet', days: 2 },
    { key: 'domicile_mp', label: 'Madhya Pradesh Domicile / Mool Niwas Patra', days: 15 },
    { key: 'income_cert', label: 'Income Certificate (Revenue Authority / Tehsildar)', days: 15 },
    { key: 'caste_cert', label: 'Digital Caste / Reservation Certificate (SC/ST/OBC/EWS)', days: 20 },
    { key: 'samagra_id', label: 'MP Samagra Social Security Member ID', days: 7 },
    { key: 'mp_employment_portal_reg', label: 'MP Rojgar Panjiyan (State Employment Portal)', days: 2 },
    { key: 'engg_marksheet', label: 'Engineering Semester Grade Cards / Transcripts', days: 10 },
    { key: 'gate_scorecard', label: 'Official GATE Exam Scorecard', days: 5 },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-purple-600" />
            {t('myProfile')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your academic credentials, social background, and verified documents for accurate rule validation.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Profile Updated Successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Profile Attributes Card */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            Student Academic & Demographic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Course / Degree Program
              </label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Year of Study</label>
              <select
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200 font-medium cursor-pointer"
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year (Final Year)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min={16}
                max={50}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                State Domicile (Permanent Residence)
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200 font-medium cursor-pointer"
              >
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Delhi">Delhi</option>
                <option value="Other">Other State</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Social Category (Quota / Reservation)
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200 font-medium cursor-pointer"
              >
                <option value="General">General (Unreserved)</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Annual Family Income (INR ₹)
              </label>
              <input
                type="number"
                name="familyIncome"
                value={formData.familyIncome}
                onChange={handleChange}
                step={5000}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200 font-medium"
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                ₹{(formData.familyIncome / 100000).toFixed(2)} Lakhs per annum
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Academic Percentage (%)
              </label>
              <input
                type="number"
                name="percentage"
                value={formData.percentage}
                onChange={handleChange}
                step={0.1}
                min={0}
                max={100}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expected Graduation Year
              </label>
              <input
                type="number"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                min={2024}
                max={2030}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Language
              </label>
              <select
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200 font-medium cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-md shadow-purple-900/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </div>

        {/* Document Readiness Checklist Interactive Section */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-600" />
                Completed Documents Repository
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Check off documents you already have ready in hardcopy or digital format.
              </p>
            </div>
            <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              {profile?.completedDocuments?.length || 0} Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documentCatalogue.map((doc) => {
              const isChecked = profile?.completedDocuments?.includes(doc.key);
              return (
                <div
                  key={doc.key}
                  onClick={() => toggleDocument(doc.key)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isChecked
                      ? 'bg-teal-50/60 border-teal-200 text-teal-950 font-medium'
                      : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked || false}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 pointer-events-none cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold block">{doc.label}</span>
                      <span className="text-[11px] text-slate-400">~{doc.days} days processing</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isChecked ? 'bg-teal-200 text-teal-800' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isChecked ? 'Ready' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
};
