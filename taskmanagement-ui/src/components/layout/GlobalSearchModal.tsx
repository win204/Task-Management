import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTasksQuery } from '../../hooks/useTasks';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal = ({ isOpen, onClose }: GlobalSearchModalProps) => {
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  const { data, isLoading } = useTasksQuery({
    page: 0,
    size: 5,
    keyword: debouncedKeyword,
  });

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setKeyword('');
    }
  }, [isOpen]);

  // Handle escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-6">
      <div 
        className="fixed inset-0 bg-surface-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-surface-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-3 border-b border-surface-100 dark:border-surface-700">
          <Search className="w-5 h-5 text-surface-400 dark:text-surface-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none px-4 text-surface-900 dark:text-surface-100 placeholder:text-surface-400 dark:placeholder:text-surface-500 sm:text-lg"
            placeholder="Search tasks..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword && (
            <button onClick={() => setKeyword('')} className="p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300">
              <X className="w-5 h-5" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 ml-2 text-xs font-medium text-surface-500 bg-surface-100 dark:bg-surface-700 dark:text-surface-400 rounded-md border border-surface-200 dark:border-surface-600">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading && keyword ? (
            <div className="p-8 flex justify-center items-center">
              <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
            </div>
          ) : !keyword ? (
            <div className="p-8 text-center">
              <p className="text-sm text-surface-500 dark:text-surface-400">Type a keyword to start searching...</p>
            </div>
          ) : data?.content && data.content.length > 0 ? (
            <div className="p-2">
              <h3 className="px-3 py-2 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                Tasks
              </h3>
              <div className="space-y-1">
                {data.content.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      onClose();
                      navigate('/dashboard/tasks');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-surface-50 dark:hover:bg-surface-700/50 rounded-xl transition-colors group"
                  >
                    <div className="p-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-100 line-clamp-1">
                        {task.title}
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 line-clamp-1">
                        {task.projectName} • {task.status.replace('_', ' ')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-surface-50 dark:bg-surface-700 rounded-full flex items-center justify-center mb-3">
                <Search className="w-6 h-6 text-surface-300 dark:text-surface-500" />
              </div>
              <p className="text-sm font-medium text-surface-900 dark:text-surface-100">No results found</p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">We couldn't find anything matching "{keyword}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
