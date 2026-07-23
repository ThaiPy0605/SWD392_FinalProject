import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="pagination">
      <button
        type="button"
        className="pagination__button pagination__button--edge"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
        Previous
      </button>
      <div className="pagination__pages">
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;
          return (
            <button
              type="button"
              key={page}
              className="pagination__button"
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="pagination__button pagination__button--edge"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        Next
        <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
      </button>
    </nav>
  );
};

export default Pagination;
