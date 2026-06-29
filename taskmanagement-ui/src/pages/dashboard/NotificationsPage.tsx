import React from 'react';
import { useAllNotifications, useMarkNotificationRead } from '../../hooks/useNotifications';
import { Bell, Check, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { formatDistanceToNowVN } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '../../types/notification';

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useAllNotifications();
  const { mutate: markAsRead, isPending: isMarking } = useMarkNotificationRead();
  const navigate = useNavigate();

  const getIconForType = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'WARNING':
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case 'SUCCESS':
        return <Check className="w-6 h-6 text-emerald-500" />;
      default:
        return <Info className="w-6 h-6 text-primary-500" />;
    }
  };

  const handleMarkAsRead = (id: number) => {
    markAsRead(id);
  };

  const handleNotificationClick = (notif: Notification) => {
    if (!notif.isRead) {
      markAsRead(notif.id);
    }
    if (notif.relatedEntityId) {
      if (notif.type.startsWith('TASK_')) {
        navigate(`/dashboard/tasks/${notif.relatedEntityId}`);
      } else if (notif.type.startsWith('PROJECT_')) {
        navigate(`/dashboard/projects/${notif.relatedEntityId}`);
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Notification History</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            View all your past and current notifications.
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
            {unreadCount} unread
          </span>
        )}
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-surface-500">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p>Loading your notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface-50 dark:bg-surface-700 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-surface-300 dark:text-surface-500" />
            </div>
            <h3 className="text-lg font-medium text-surface-900 dark:text-surface-50 mb-1">
              No notifications yet
            </h3>
            <p className="text-surface-500 dark:text-surface-400 max-w-sm">
              When you receive updates about your tasks or projects, they will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-100 dark:divide-surface-700/50">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => handleNotificationClick(notif)}
                className={`p-6 flex items-start gap-4 transition-colors cursor-pointer ${
                  notif.isRead 
                    ? 'bg-white dark:bg-surface-800' 
                    : 'bg-primary-50/50 dark:bg-primary-900/10'
                }`}
              >
                <div className="flex-shrink-0 mt-1 bg-white dark:bg-surface-800 p-2 rounded-xl shadow-sm border border-surface-100 dark:border-surface-700">
                  {getIconForType(notif.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className={`text-base font-semibold ${notif.isRead ? 'text-surface-700 dark:text-surface-200' : 'text-surface-900 dark:text-surface-50'}`}>
                        {notif.title}
                      </h4>
                      <p className={`mt-1 text-sm ${notif.isRead ? 'text-surface-500 dark:text-surface-400' : 'text-surface-600 dark:text-surface-300'}`}>
                        {notif.message}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notif.id);
                        }}
                        disabled={isMarking}
                        className="flex-shrink-0 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 p-2 rounded-lg transition-colors font-medium text-xs flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark as read
                      </button>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs font-medium text-surface-400 dark:text-surface-500 bg-surface-100 dark:bg-surface-700 px-2 py-0.5 rounded-md">
                      {notif.type}
                    </span>
                    <span className="text-xs text-surface-400 dark:text-surface-500">
                      • {notif.createdAt ? formatDistanceToNowVN(notif.createdAt) : 'Unknown date'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
