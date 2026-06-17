// Breadcrumb component
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map route segments to human-readable names if needed
  const routeNameMap: Record<string, string> = {
    dashboard: 'Dashboard',
    users: 'Users',
    projects: 'Projects',
    tasks: 'Tasks',
    reports: 'Reports',
  };

  return (
    <nav className="flex items-center text-sm font-medium text-slate-500" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/dashboard" className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center">
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {pathnames.map((value, index) => {
          const isLast = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Format the value: use map or capitalize
          const label = routeNameMap[value.toLowerCase()] || 
            (value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' '));

          // If the first item is dashboard and we are rendering it, we can skip it
          // since the Home icon already represents the root of the workspace.
          if (index === 0 && value.toLowerCase() === 'dashboard') {
            return null; // Skip redundant text next to home icon
          }

          return (
            <li key={to} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-slate-300 mx-1 flex-shrink-0" />
              {isLast ? (
                <span className="text-slate-900 font-semibold" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link to={to} className="hover:text-indigo-600 transition-colors">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
