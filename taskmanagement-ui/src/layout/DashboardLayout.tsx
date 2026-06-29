import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { GlobalSearchModal } from '../components/layout/GlobalSearchModal';
import { useRealTimeSync } from '../hooks/useRealTimeSync';

/**
 * Main application shell for authenticated users.
 * Composes the global Sidebar navigation, Topbar header,
 * and an Outlet for nested route pages.
 */
export default function DashboardLayout() {
  useRealTimeSync();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Global CMD+K / CTRL+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-surface-50 dark:bg-surface-950">
      {/* Mobile backdrop overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        }`}
      >
        <Topbar 
          onMobileMenuToggle={() => setMobileSidebarOpen(true)} 
          onSearchClick={() => setSearchOpen(true)}
        />

        {/* Scrollable Page Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl page-enter">
            <Outlet />
          </div>
        </main>
      </div>

      <GlobalSearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />
    </div>
  );
}
