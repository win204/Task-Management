import { Breadcrumb } from './Breadcrumb';
import { ProfileDropdown } from './ProfileDropdown';

export const Topbar = () => {
  return (
    <header className="sticky top-0 z-10 w-full bg-white border-b border-slate-200 shadow-sm h-16 flex items-center justify-between px-6 lg:px-8">
      {/* Left side: Breadcrumbs */}
      <div className="flex items-center">
        <Breadcrumb />
      </div>

      {/* Right side: User Profile & Global Actions */}
      <div className="flex items-center gap-4">
        <ProfileDropdown />
      </div>
    </header>
  );
};
