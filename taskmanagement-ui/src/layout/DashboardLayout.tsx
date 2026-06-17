import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';

/**
 * Main application shell for authenticated users.
 * Composes the global Sidebar navigation, Topbar header, 
 * and an Outlet for nested route pages.
 */
export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 ml-64 transition-all duration-300">
        <Topbar />
        
        {/* Scrollable Page Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
