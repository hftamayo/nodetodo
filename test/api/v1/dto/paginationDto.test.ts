import { PaginationDTO } from '../../../../src/api/v1/dto/pagination/pagination.dto';
import { examplePagination } from '../../../mocks/pagination.mock';

describe('PaginationDTO', () => {
  it('should create a PaginationDTO with all required fields', () => {
    const dto = new PaginationDTO({
      nextCursor: examplePagination.nextCursor,
      prevCursor: examplePagination.prevCursor,
      limit: examplePagination.limit,
      totalCount: examplePagination.totalCount,
      hasMore: examplePagination.hasMore,
      currentPage: examplePagination.currentPage,
      totalPages: examplePagination.totalPages,
      order: examplePagination.order as 'asc' | 'desc',
      hasPrev: examplePagination.hasPrev,
      isFirstPage: examplePagination.isFirstPage,
      isLastPage: examplePagination.isLastPage
    });
    
    expect(dto.nextCursor).toBe(examplePagination.nextCursor);
    expect(dto.prevCursor).toBe(examplePagination.prevCursor);
    expect(dto.limit).toBe(examplePagination.limit);
    expect(dto.totalCount).toBe(examplePagination.totalCount);
    expect(dto.hasMore).toBe(examplePagination.hasMore);
    expect(dto.currentPage).toBe(examplePagination.currentPage);
    expect(dto.totalPages).toBe(examplePagination.totalPages);
    expect(dto.order).toBe(examplePagination.order);
    expect(dto.hasPrev).toBe(examplePagination.hasPrev);
    expect(dto.isFirstPage).toBe(examplePagination.isFirstPage);
    expect(dto.isLastPage).toBe(examplePagination.isLastPage);
  });

  it('should serialize to JSON correctly', () => {
    const dto = new PaginationDTO({
      nextCursor: examplePagination.nextCursor,
      prevCursor: examplePagination.prevCursor,
      limit: examplePagination.limit,
      totalCount: examplePagination.totalCount,
      hasMore: examplePagination.hasMore,
      currentPage: examplePagination.currentPage,
      totalPages: examplePagination.totalPages,
      order: examplePagination.order as 'asc' | 'desc',
      hasPrev: examplePagination.hasPrev,
      isFirstPage: examplePagination.isFirstPage,
      isLastPage: examplePagination.isLastPage
    });
    
    const json = JSON.stringify(dto);
    const expectedJson = JSON.stringify(examplePagination);
    expect(json).toBe(expectedJson);
  });

  it('should allow missing optional fields', () => {
    const dto = new PaginationDTO({
      limit: 10,
      totalCount: 100,
      hasMore: true,
      currentPage: 1,
      totalPages: 10,
      order: 'desc',
      hasPrev: false,
      isFirstPage: true,
      isLastPage: false
    });
    
    expect(dto.nextCursor).toBeUndefined();
    expect(dto.prevCursor).toBeUndefined();
    expect(dto.limit).toBe(10);
    expect(dto.totalCount).toBe(100);
  });

  it('should handle first page pagination', () => {
    const dto = new PaginationDTO({
      nextCursor: 'next-cursor',
      limit: 10,
      totalCount: 100,
      hasMore: true,
      currentPage: 1,
      totalPages: 10,
      order: 'desc',
      hasPrev: false,
      isFirstPage: true,
      isLastPage: false
    });
    
    expect(dto.isFirstPage).toBe(true);
    expect(dto.hasPrev).toBe(false);
    expect(dto.hasMore).toBe(true);
  });

  it('should handle last page pagination', () => {
    const dto = new PaginationDTO({
      prevCursor: 'prev-cursor',
      limit: 10,
      totalCount: 100,
      hasMore: false,
      currentPage: 10,
      totalPages: 10,
      order: 'desc',
      hasPrev: true,
      isFirstPage: false,
      isLastPage: true
    });
    
    expect(dto.isLastPage).toBe(true);
    expect(dto.hasPrev).toBe(true);
    expect(dto.hasMore).toBe(false);
  });

  it('should handle single page pagination', () => {
    const dto = new PaginationDTO({
      limit: 10,
      totalCount: 5,
      hasMore: false,
      currentPage: 1,
      totalPages: 1,
      order: 'desc',
      hasPrev: false,
      isFirstPage: true,
      isLastPage: true
    });
    
    expect(dto.isFirstPage).toBe(true);
    expect(dto.isLastPage).toBe(true);
    expect(dto.hasPrev).toBe(false);
    expect(dto.hasMore).toBe(false);
  });
});