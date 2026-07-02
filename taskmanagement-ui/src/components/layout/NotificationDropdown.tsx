import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { useUnreadNotifications, useMarkNotificationRead } from '../../hooks/useNotifications';
import { formatDistanceToNowVN } from '../../utils/dateUtils';

import { Link, useNavigate } from 'react-router-dom';
import type { Notification } from '../../types/notification';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: notifications = [], isLoading } = useUnreadNotifications();
  const { mutate: markAsRead, isPending: isMarking } = useMarkNotificationRead();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIconForType = (type: string) => {
    switch ((type || '').toUpperCase()) {
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'SUCCESS':
        return <Check className="w-5 h-5 text-emerald-500" />;
      default:
        return <Info className="w-5 h-5 text-primary-500" />;
    }
  };

  const handleMarkAsRead = (id: number) => {
    markAsRead(id);
  };

  const handleNotificationClick = (notif: Notification) => {
    markAsRead(notif.id);
    setIsOpen(false);
    
    if (notif.relatedEntityId) {
      if ((notif.type || '').startsWith('TASK_')) {
        navigate(`/dashboard/tasks/${notif.relatedEntityId}`);
      } else if ((notif.type || '').startsWith('PROJECT_')) {
        navigate(`/dashboard/projects/${notif.relatedEntityId}`);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-surface-900">
            {notifications.length > 99 ? '99+' : notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-surface-800 rounded-xl shadow-xl dark:shadow-2xl border border-surface-100 dark:border-surface-700 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right overflow-hidden flex flex-col max-h-[400px]">
          <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-700 flex justify-between items-center bg-surface-50/50 dark:bg-surface-800/50">
            <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100">
              Notifications
            </h3>
            {notifications.length > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                {notifications.length} new
              </span>
            )}
          </div>

          <div className="overflow-y-auto flex-1 p-0">
            {isLoading ? (
              <div className="p-8 flex justify-center items-center">
                <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-surface-50 dark:bg-surface-700 rounded-full flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-surface-300 dark:text-surface-500" />
                </div>
                <p className="text-sm font-medium text-surface-600 dark:text-surface-300">You're all caught up!</p>
                <p className="text-xs text-surface-400 mt-1">No new notifications.</p>
              </div>
            ) : (
              <div className="divide-y divide-surface-100 dark:divide-surface-700/50">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    onClick={() => handleNotificationClick(notif)}
                    className="p-4 hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors flex gap-3 group relative cursor-pointer"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getIconForType(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                        {notif.title}
                      </p>
                      <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-xs text-surface-400 dark:text-surface-500 mt-1.5">
                        {notif.createdAt ? formatDistanceToNowVN(notif.createdAt) : 'Just now'}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notif.id);
                      }}
                      disabled={isMarking}
                      className="absolute right-4 top-4 p-1.5 text-surface-300 hover:text-primary-600 dark:text-surface-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-surface-100 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/50">
            <Link 
              to="/dashboard/notifications" 
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-2 text-xs font-medium text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
            >
              View all history
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
