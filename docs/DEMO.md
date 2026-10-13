# AvsarVerse: 3-Minute Hackathon Demo Script

> **Theme**: "AvsarVerse – Your Future, Connected"  
> **Target Audience**: Indian engineering students navigating higher studies (GATE/CAT), state/central scholarships, and competitive government exams.  
> **Demo Duration**: Exactly 3 minutes.

---

## 🎬 Minute 0:00 – 0:30 | The Problem & The Student Profile

1. **Open the App**:
   - Navigate to `http://localhost:5173`.
   - Highlight the dark navy/indigo sidebar, purple primary branding, teal for Scholarships, and orange for Government Exams.
   - Point out the active user profile: **Arjun Sharma**, final year B.Tech Computer Science student in **Madhya Pradesh** (OBC category, 78.5% marks, ₹2.8L annual family income).

2. **Navigate to "My Profile" (`/profile`)**:
   - Show how the student's profile is fully editable.
   - Point out the **Completed Documents Repository**: Aadhaar, Class 10/12 marksheets, and MP Domicile are already checked off.
   - Toggle on the **Income Certificate** checkbox to show instant real-time persistence.

---

## 🎬 Minute 0:30 – 1:15 | Eligibility Intelligence with Exact Gap Explanations

1. **Open "Higher Studies" or "Government Exams" (`/higher-studies` / `/government-exams`)**:
   - Point out that opportunities are not just listed—they display dynamic eligibility badges: **Eligible**, **Almost Eligible**, and **Not Eligible** with calculated **Match Scores**.
   - Click on **IIT Bombay M.Tech RA Computer Science**:
     - See **Pass** on Percentage (78.5% >= 70%) and Course.
   - Click on **BARC OCES/DGFS 2027**:
     - Show the **exact gap explanation**: *Age 21 qualifies within 26 years*.
   - Click on **MP Mukhya Mantri Medhavi Vidyarthi Yojana (MMVY)** in Scholarships:
     - Show how all criteria (70% marks, MP domicile, income <= ₹6,00,000) pass with clear checkmarks and student vs required value comparisons.
   - Click **"Save Opportunity"** (bookmark icon) on:
     1. **GATE 2027**
     2. **CAT 2027**
     3. **MP MMVY Scholarship 2026-27**
     4. **UPSC CSE 2027**

---

## 🎬 Minute 1:15 – 1:45 | What-If Simulator (Interactive Decision Sandbox)

1. **Navigate to "Simulator" (`/simulator`)**:
   - Explain the concept: *"Students wonder: What if I score 82%? What if I apply under EWS or turn 27?"*
   - Drag the **Academic Percentage Slider** from 78.5% to **85.0%**:
     - Watch the live **Newly Unlocked** counter increase.
     - See **Central Sector Scholarship (CSSS)** immediately unlock with the explanation: *"Unlocked: Score 85.0% exceeds 80.0% threshold"*.
   - Drag the **Family Income Slider** up to **₹8,00,000**:
     - Watch the **Lost Opportunities** counter update instantly as MMVY and OBC Post-Matric schemes fail the income ceiling with exact rupee variance.
   - Click **"Reset to Profile"** to return to Arjun's baseline.

---

## 🎬 Minute 1:45 – 2:20 | Conflict Timeline & Mutual Exclusivity Radar

1. **Navigate to "Conflict Timeline" (`/timeline`)**:
   - View the **Gantt Schedule Calendar** spanning November 2026 to October 2027.
   - Show the **Collision Radar**:
     - **Critical Collision (Same Day)**: **UPSC CSE Prelims** and **MPPSC State Services** are scheduled on the exact same date (**May 23, 2027**)! Marked in red alert.
     - **High Risk Proximity**: **IBPS PO** (Oct 17, 2027) and **SBI PO** (Oct 18, 2027) are only 1 day apart.
     - **Deadline Window Collision**: **GATE 2027** (Nov 20) and **CAT 2027** (Nov 18) close within 48 hours.
   - Show the **Regulatory Exclusivity Banner**:
     - Schemes under `MP_STATE_MERIT_OR_CENTRAL_SCHOLARSHIP` (MMVY vs Central Sector) cannot be claimed concurrently.
   - Highlight the **Shared Preparation Synergy Panel**:
     - *Quantitative Aptitude* and *Logical Reasoning* overlap across 4 saved exams.

---

## 🎬 Minute 2:20 – 3:00 | Best Combination Planner, Documents, Costs & Age Clock

1. **Navigate to "Best Combination Planner" (`/planner`)**:
   - Set **Capacity Pick** to **3 Opportunities** and click **"Run Optimization"**.
   - Show the synthesized output:
     - **Optimal Non-Conflicting Trajectory**: The engine automatically picks the highest-value combination with **zero exam collisions** and **zero exclusivity violations**.
     - **Rejected Candidates with Human-Readable Reasons**:
       - e.g., MPPSC rejected because *"Exam date clashes with chosen UPSC CSE"*.
       - Central Sector rejected because *"Mutually exclusive with MMVY (Single scholarship rule)"*.
     - **Combined Preparation Syllabus**:
       - Shared topics (Quantitative Aptitude, Core Engineering) grouped with estimated study hours (e.g., ~55 hrs) and specific subtopic drills.
     - **Financial Investment Matrix**:
       - Base fees: ₹2,400, OBC Category Waiver savings: ₹500, Travel: ₹2,100 -> Net Investment: ₹4,000.
     - **Government Exam Age Horizon Clock**:
       - UPSC CSE: 11 years remaining (Horizon: 2037).
       - BARC: 5 years remaining (Horizon: 2031).

2. **Navigate to "Documents" (`/documents`)**:
   - Point out the **Urgent Action Required** bucket calculated from application deadlines minus processing days and buffers.
   - Check off a document and watch the counter update live!

3. **Navigate to "Notice Reader (AI)" (`/notice-reader`)**:
   - Click **"Load Sample Notification"** to paste official MPPSC gazette text.
   - Click **"Extract Intelligence with AI"** (using Gemini API with fallback).
   - Show the structured draft with extracted rules, dates, and documents, then click **"Add to Opportunities Database"**.

4. **Toggle Language**:
   - Click **"हिन्दी"** in the top navbar. All navigation and UI elements instantly switch to Hindi!
