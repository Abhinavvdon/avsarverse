import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

export const Layout = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
