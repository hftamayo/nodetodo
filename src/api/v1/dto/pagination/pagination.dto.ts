export class PaginationDTO {
  nextCursor?: string;
  prevCursor?: string;
  limit!: number;
  totalCount!: number;
  hasMore!: boolean;
  currentPage!: number;
  totalPages!: number;
  order!: 'asc' | 'desc';
  hasPrev!: boolean;
  isFirstPage!: boolean;
  isLastPage!: boolean;

  constructor(options: {
    nextCursor?: string;
    prevCursor?: string;
    limit: number;
    totalCount: number;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
    order: 'asc' | 'desc';
    hasPrev: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;
  }) {
    Object.assign(this, options);
  }
}

export class PaginatedResponseDTO<T> {
  data!: T[];
  pagination!: PaginationDTO;
  etag?: string;
  lastModified?: string;

  constructor(options: {
    data: T[];
    pagination: PaginationDTO;
    etag?: string;
    lastModified?: string;
  }) {
    Object.assign(this, options);
  }
} 