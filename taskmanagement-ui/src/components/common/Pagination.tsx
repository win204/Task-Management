import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;   // 0-indexed (Spring Boot convention)
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
  // Spring uses 0-indexed pages; display is 1-indexed for the user
  const displayPage = currentPage + 1;
  const startElement = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endElement = Math.min(currentPage * pageSize + pageSize, totalElements);

  const isFirstPage = currentPage === 0;
  // BUG FIX: last page is when 0-indexed currentPage equals (totalPages - 1)
  const isLastPage = currentPage >= totalPages - 1;

  if (totalElements === 0) return null;

  // Build visible page numbers (show at most 5 around current page)
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    const delta = 2;
    const left = Math.max(0, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    if (left > 0) {
      pages.push(0);
      if (left > 1) pages.push('...');
    }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) {
      if (right < totalPages - 2) pages.push('...');
      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t border-surface-200 dark:border-surface-700/50 bg-white dark:bg-surface-800/30 px-4 py-3 sm:px-6">
      {/* Mobile: simple prev/next */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          className="relative inline-flex items-center rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-4 py-2 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="self-center text-sm text-surface-600 dark:text-surface-400">
          {displayPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          className="relative ml-3 inline-flex items-center rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-4 py-2 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>

      {/* Desktop: full pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-surface-700 dark:text-surface-400">
            Showing{' '}
            <span className="font-medium text-surface-900 dark:text-surface-100">{startElement}</span>
            {' '}to{' '}
            <span className="font-medium text-surface-900 dark:text-surface-100">{endElement}</span>
            {' '}of{' '}
            <span className="font-medium text-surface-900 dark:text-surface-100">{totalElements}</span>
            {' '}results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm" aria-label="Pagination">
            {/* Previous */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={isFirstPage}
              className="relative inline-flex items-center rounded-l-xl px-2 py-2 text-surface-400 dark:text-surface-500 ring-1 ring-inset ring-surface-300 dark:ring-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white dark:bg-surface-800"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Page number buttons */}
            {getPageNumbers().map((pg, idx) =>
              pg === '...' ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-surface-700 dark:text-surface-400 ring-1 ring-inset ring-surface-300 dark:ring-surface-600 bg-white dark:bg-surface-800"
                >
                  …
                </span>
              ) : (
                <button
                  key={pg}
                  onClick={() => onPageChange(pg as number)}
                  aria-current={pg === currentPage ? 'page' : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-surface-300 dark:ring-surface-600 focus:z-20 focus:outline-offset-0 transition-colors ${
                    pg === currentPage
                      ? 'z-10 bg-primary-600 text-white ring-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                      : 'bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 hover:bg-surface-50 dark:hover:bg-surface-700'
                  }`}
                >
                  {(pg as number) + 1}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={isLastPage}
              className="relative inline-flex items-center rounded-r-xl px-2 py-2 text-surface-400 dark:text-surface-500 ring-1 ring-inset ring-surface-300 dark:ring-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white dark:bg-surface-800"
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
