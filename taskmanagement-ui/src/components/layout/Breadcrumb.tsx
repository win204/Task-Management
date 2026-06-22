import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const routeNameMap: Record<string, string> = {
    dashboard: 'Dashboard',
    users: 'Users',
    projects: 'Projects',
    tasks: 'Tasks',
    reports: 'Reports',
  };

  return (
    <nav className="flex items-center text-sm font-medium text-surface-500 dark:text-surface-400" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1.5">
        <li>
          <Link
            to="/dashboard"
            className="text-surface-400 dark:text-surface-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const isLast = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label =
            routeNameMap[value.toLowerCase()] ||
            value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

          if (index === 0 && value.toLowerCase() === 'dashboard') {
            return null;
          }

          return (
            <li key={to} className="flex items-center">
              <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-600 mx-1 flex-shrink-0" />
              {isLast ? (
                <span className="text-surface-800 dark:text-surface-100 font-semibold" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link
                  to={to}
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
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
