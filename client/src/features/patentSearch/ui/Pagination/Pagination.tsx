import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@shared/utils/hooks.ts";
import './pagination.scss'
import {setPage} from "@features/patentSearch";

export const Pagination: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = useAppSelector(state => state.searchReducer.totalPages) || 1
  const searchQuery = useAppSelector(state => state.searchReducer.searchQuery)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setPage(currentPage))
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const createPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  if (searchQuery || totalPages === 1) {
    return null;
  }

  return (
    <div data-testid="pagination" className="pagination">
      <button onClick={handlePreviousPage} disabled={currentPage === 1}>
        ⬅
      </button>
      {createPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && setCurrentPage(page)}
          className={currentPage === page ? 'active' : ''}
        >
          {page}
        </button>
      ))}
      <button onClick={handleNextPage} disabled={currentPage === totalPages}>
        ⮕
      </button>
    </div>
  );
};
