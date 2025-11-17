'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { generatePagination } from '@/app/lib/utils';

export default function Pagination({ totalPages, currentPage, onPageChange }: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const allPages = generatePagination(currentPage, totalPages);

  const createPageURL = (page: number | string) => {
    // No cambia la URL, solo llama a onPageChange
    return '#';
  };

  return (
    <div className="inline-flex">
      <PaginationArrow
        direction="left"
        href="#"
        isDisabled={currentPage <= 1}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      />
      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          let position: 'first' | 'last' | 'single' | 'middle' | undefined;
          if (index === 0) position = 'first';
          if (index === allPages.length - 1) position = 'last';
          if (allPages.length === 1) position = 'single';
          if (page === '...') position = 'middle';
          return (
            <PaginationNumber
              key={`${page}-${index}`}
              href="#"
              page={page}
              position={position}
              isActive={currentPage === page}
              onClick={() => typeof page === 'number' && onPageChange(page)}
            />
          );
        })}
      </div>
      <PaginationArrow
        direction="right"
        href="#"
        isDisabled={currentPage >= totalPages}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
      />
    </div>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
  onClick,
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
  onClick?: () => void;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center text-sm border',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 bg-blue-600 border-blue-600 text-white': isActive,
      'hover:bg-gray-100': !isActive && position !== 'middle',
      'text-gray-300': position === 'middle',
    },
  );

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <button className={className} onClick={onClick} type="button">
      {page}
    </button>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
  onClick,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
  onClick?: () => void;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border',
    {
      'pointer-events-none text-gray-300': isDisabled,
      'hover:bg-gray-100': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    },
  );

  const icon =
    direction === 'left' ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <button className={className} onClick={onClick} type="button">
      {icon}
    </button>
  );
}
