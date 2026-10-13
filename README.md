# AvsarVerse – Your Future, Connected
### Student Opportunity Intelligence Platform for Indian Students

> Built for Indian engineering, degree, and postgraduate aspirants pursuing **Higher Studies** (GATE, CAT, IITs), **Scholarships** (State MMVY, National CSSS, AICTE grants), and **Government Examinations** (UPSC, MPPSC, SSC CGL, Banking, PSUs).

---

## 🌟 What Makes AvsarVerse Unique

Existing portals (like National Scholarship Portal, Sarkari Result, or college boards) list opportunities in isolated silos. Students are left to figure out the complex interactions on their own.

**AvsarVerse explains how opportunities interact:**
1. **Explainable Eligibility**: Evaluates multi-criteria rules independently and explains *exactly why* a student qualifies or fails with human-friendly variances (e.g., *"Family income is ₹40,000 above the limit"* or *"You need 5.0% more marks"*).
2. **Collision & Clash Radar**: Detects same-day exam collisions (e.g., MPPSC Prelims & UPSC CSE on May 23, 2027), high-risk back-to-back testing stress (e.g., IBPS PO & SBI PO 1 day apart), and tight application deadline windows.
3. **Mutual Exclusivity Enforcement**: Flags regulatory conflicts across schemes that cannot be combined (e.g., Central Sector Scholarship vs State MMVY).
4. **Shared Preparation Synergy**: Discovers overlapping syllabus topics (Quantitative Aptitude, Logical Reasoning, Core Engineering) across selected opportunities.
5. **Optimal Trajectory Planner**: Synthesizes the highest-value non-conflicting subset using weighted interval optimization, rejects infeasible targets with explicit reasons, and generates a unified study plan.
6. **Certificate Lead-Time Manager**: Calculates strict "Start By" dates (`deadline - processingDays - 3 days buffer`) and flags urgent documents.
7. **Age & Attempt Horizon Clock**: Projects exact age-out dates and remaining attempt windows for administrative exams.
8. **Net Investment Calculator**: Computes base application fees, applies category fee waivers (SC/ST/OBC/Female), adds estimated travel expenses, and calculates net expenditure.
9. **AI Notice Extractor**: Uses the Google Gemini API (with resilient offline fallback) to parse raw government gazettes into structured opportunity records.
10. **Bilingual Support**: Instant toggle between English and हिन्दी (Hindi).

---

## 🛠️ Tech Stack

- **Backend**:
  - Java 17 / 21
  - Spring Boot 3.3.4
  - Spring Web & Spring Data JPA
  - H2 In-Memory Database (seeded on startup with 30 opportunities & sample profile)
  - Lombok
  - Maven
  - CORS enabled for `http://localhost:5173`
- **Frontend**:
  - React 18 (Vite)
  - Tailwind CSS 3
  - React Router 6
  - Axios
  - Lucide React icons
  - Bilingual i18n dictionary (en / hi)

---

## 🚀 Quick Run Instructions

### 1. Prerequisites
- **Java 17 or higher** installed (`java -version`)
- **Node.js 18 or higher** and **npm** installed (`node -v`, `npm -v`)
- Maven (a Maven wrapper `mvnw` / `mvnw.cmd` is included in the backend directory)

---

### 2. Running the Backend
From the project root:

```bash
cd backend

# On Windows:
.\mvnw.cmd spring-boot:run

# On Linux / macOS:
./mvnw spring-boot:run
```

- **Backend URL**: `http://localhost:8081`
  *(Note: Configured to port 8081 by default to prevent port conflicts with pre-installed background services on port 8080. If port 8080 is free in your environment, you can set `server.port=8080` in `backend/src/main/resources/application.properties`)*
- **H2 Console**: `http://localhost:8081/h2-console`
  - JDBC URL: `jdbc:h2:mem:avsarversedb`
  - User: `sa`
  - Password: *(leave blank)*

---

### 3. Running the Frontend
In a separate terminal window:

```bash
cd frontend
npm install
npm run dev
```

- **Frontend URL**: `http://localhost:5173`
- The Vite development server automatically proxies all `/api/*` calls to the Spring Boot backend.

---

## 📁 Project Structure

```text
avsarverse/
├── backend/
│   ├── src/
│   │   ├── main/java/com/avsarverse/backend/
│   │   │   ├── bootstrap/          # DataSeeder (~30 opportunities, profile id=1)
│   │   │   ├── config/             # CorsConfig (CORS for localhost:5173)
│   │   │   ├── controller/         # REST Controllers (Profile, Opp, Eligibility, Conflicts, Plan, etc.)
│   │   │   ├── dto/                # Request & Response Transfer Objects
│   │   │   ├── engine/             # RuleEvaluator, ConflictEngine, PlanOptimizer
│   │   │   ├── entity/             # StudentProfile, Opportunity, Rule, RequiredDocument
│   │   │   ├── repository/         # JPA Repositories
│   │   │   └── service/            # Business Logic & Gemini AI Integration
│   │   └── test/java/com/avsarverse/backend/engine/
│   │       ├── RuleEvaluatorTest.java
│   │       ├── ConflictEngineTest.java
│   │       └── PlanOptimizerTest.java
│   ├── pom.xml
│   └── mvnw.cmd
│
├── frontend/
│   ├── src/
│   │   ├── components/layout/      # Sidebar, TopNavbar, Layout
│   │   ├── context/                # ProfileContext, LanguageContext
│   │   ├── i18n/                   # translations.js (en / hi)
│   │   ├── pages/                  # Dashboard, Opportunities, Profile, Simulator, Timeline, Planner, Documents, Saved, NoticeReader, Settings
│   │   ├── services/api.js         # Axios API endpoints
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── docs/
    └── DEMO.md                     # 3-Minute Walkthrough Hackathon Demo Script
```

---

## 📡 Backend REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/profile` | Retrieve student profile (id=1) |
| `PUT` | `/api/profile` | Update profile attributes |
| `POST` | `/api/profile/documents/toggle` | Toggle possessed document checkmark |
| `GET` | `/api/opportunities?type=&q=` | Search opportunities by category or query |
| `GET` | `/api/opportunities/{id}` | Opportunity details |
| `POST` | `/api/opportunities/{id}/report-outdated`| Increment outdated report flag |
| `POST` | `/api/eligibility/check` | Evaluate rules independently with human gap analysis |
| `POST` | `/api/simulator` | Perform what-if differential analysis (unlocked/lost) |
| `POST` | `/api/conflicts` | Detect date collisions, exclusions, and shared syllabus |
| `POST` | `/api/plan/best-combination` | Synthesize optimal trajectory with reasons & study plan |
| `GET` | `/api/deadlines` | Upcoming deadlines sorted by urgency color |
| `GET` | `/api/documents/checklist` | Aggregated checklist with computed Start-By dates |
| `GET` | `/api/age-clock` | Age limit and attempt horizon tracker for govt exams |
| `POST` | `/api/cost/estimate` | Estimate fees, category waivers, and travel costs |
| `POST` | `/api/ai/extract-notice` | Parse notification text using Google Gemini (with mock fallback) |
| `POST` | `/api/ai/save-draft` | Save verified draft into the live opportunity database |
| `GET` | `/api/saved` | List saved opportunities |
| `POST` | `/api/saved/{id}` | Save an opportunity |
| `DELETE`| `/api/saved/{id}` | Remove saved opportunity |

---

## 🧪 Unit Tests
Run backend test suite:
```bash
cd backend
.\mvnw.cmd test
```
All tests for `RuleEvaluator` (percentage gaps, income thresholds, age ceilings, reservation rules) and `ConflictEngine` (same-day clashes, proximity clashes, exclusivity groups) pass out-of-the-box.
