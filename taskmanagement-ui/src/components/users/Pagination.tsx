import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}: PaginationProps) => {
  // Spring Boot uses 0-indexed pages, but UI usually shows 1-indexed.
  const displayPage = currentPage + 1;
  const startElement = currentPage * pageSize + 1;
  const endElement = Math.min(startElement + pageSize - 1, totalElements);

  if (totalElements === 0) return null;

  return (
    <div className="flex items-center justify-between border-t border-surface-200 dark:border-surface-700/50 bg-white dark:bg-surface-800/30 px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="relative inline-flex items-center rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-4 py-2 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={displayPage >= totalPages}
          className="relative ml-3 inline-flex items-center rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-4 py-2 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-surface-700 dark:text-surface-400">
            Showing <span className="font-medium text-surface-900 dark:text-surface-100">{startElement}</span> to{' '}
            <span className="font-medium text-surface-900 dark:text-surface-100">{endElement}</span> of{' '}
            <span className="font-medium text-surface-900 dark:text-surface-100">{totalElements}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="relative inline-flex items-center rounded-l-xl px-2 py-2 text-surface-400 dark:text-surface-500 ring-1 ring-inset ring-surface-300 dark:ring-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white dark:bg-surface-800"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-surface-900 dark:text-surface-100 ring-1 ring-inset ring-surface-300 dark:ring-surface-600 focus:z-20 focus:outline-offset-0 bg-white dark:bg-surface-800">
              Page {displayPage} of {totalPages}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={displayPage >= totalPages}
              className="relative inline-flex items-center rounded-r-xl px-2 py-2 text-surface-400 dark:text-surface-500 ring-1 ring-inset ring-surface-300 dark:ring-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white dark:bg-surface-800"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
