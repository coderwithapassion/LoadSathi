import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BackendStatusBanner } from './BackendStatusBanner';
import { ToastContainer } from './Toast';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Backend Status Top Notification Bar */}
      <BackendStatusBanner />

      {/* Main Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex">
        {/* Role-specific Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 flex flex-col justify-between overflow-x-hidden min-h-[calc(100vh-64px)]">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>

          {/* Simple Dashboard Footer */}
          <footer className="py-4 px-6 border-t border-slate-200 text-center text-xs text-slate-400 bg-white">
            <p>
              LoadSaathi Logistics Portal &bull; "Your Goods, Our Responsibility." &bull; 24x7 Support: 1800-LOAD-SAATHI
            </p>
          </footer>
        </main>
      </div>

      {/* Floating Toasts */}
      <ToastContainer />
    </div>
  );
};

