import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ProfileProvider } from './context/ProfileContext';
import { Layout } from './components/layout/Layout';

import { Dashboard } from './pages/Dashboard';
import { ProfilePage } from './pages/ProfilePage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { ConflictTimelinePage } from './pages/ConflictTimelinePage';
import { BestPlanPage } from './pages/BestPlanPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { SavedOpportunitiesPage } from './pages/SavedOpportunitiesPage';
import { NoticeReaderPage } from './pages/NoticeReaderPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <LanguageProvider>
      <ProfileProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route
                path="higher-studies"
                element={
                  <OpportunitiesPage
                    type="HIGHER_STUDIES"
                    title="Higher Studies & Postgraduate Entrances"
                    subtitle="M.Tech, MS Research, IIM CAT & Premier Engineering Entrances (GATE, IIIT PGEE, BITS HD)"
                    colorScheme="indigo"
                  />
                }
              />
              <Route
                path="scholarships"
                element={
                  <OpportunitiesPage
                    type="SCHOLARSHIP"
                    title="Scholarships & Financial Aid Grants"
                    subtitle="MP Medhavi Vidyarthi Yojana (MMVY), Central Sector CSSS, AICTE PG Allowances & Merit Schemes"
                    colorScheme="teal"
                  />
                }
              />
              <Route
                path="government-exams"
                element={
                  <OpportunitiesPage
                    type="GOVT_EXAM"
                    title="Government Examinations & PSU Technical Services"
                    subtitle="UPSC CSE, MPPSC State Services, SSC CGL, Banking (IBPS/SBI), ISRO, DRDO & MP Vyapam"
                    colorScheme="orange"
                  />
                }
              />
              <Route path="simulator" element={<SimulatorPage />} />
              <Route path="timeline" element={<ConflictTimelinePage />} />
              <Route path="planner" element={<BestPlanPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="saved" element={<SavedOpportunitiesPage />} />
              <Route path="notice-reader" element={<NoticeReaderPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProfileProvider>
    </LanguageProvider>
  );
}

export default App;
