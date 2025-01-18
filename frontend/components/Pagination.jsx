import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    const visiblePages = [];

    if (totalPages <= 7) {
      return pageNumbers.map((number) => (
        <Button
          key={number}
          variant={currentPage === number ? "default" : "outline"}
          onClick={() => onPageChange(number)}
        >
          {number}
        </Button>
      ));
    }

    if (currentPage <= 4) {
      visiblePages.push(...pageNumbers.slice(0, 5), <MoreHorizontal key="more" />, totalPages);
    } else if (currentPage >= totalPages - 3) {
      visiblePages.push(1, <MoreHorizontal key="more" />, ...pageNumbers.slice(totalPages - 5));
    } else {
      visiblePages.push(
        1,
        <MoreHorizontal key="more-start" />,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        <MoreHorizontal key="more-end" />,
        totalPages
      );
    }

    return visiblePages.map((item, index) => {
      if (typeof item === 'number') {
        return (
          <Button
            key={item}
            variant={currentPage === item ? "default" : "outline"}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        );
      }
      return item;
    });
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {renderPageNumbers()}
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

