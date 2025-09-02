import { PaginationDto } from '../../src/dto/paginationDto';
import { examplePagination } from '../mocks/pagination.mock';

describe('PaginationDto', () => {
  it('should create a PaginationDto with all required fields', () => {
    const dto = new PaginationDto(
      examplePagination.nextCursor,
      examplePagination.prevCursor,
      examplePagination.limit,
      examplePagination.totalCount,
      examplePagination.hasMore,
      examplePagination.currentPage,
      examplePagination.totalPages,
      examplePagination.order,
      examplePagination.hasPrev,
      examplePagination.isFirstPage,
      examplePagination.isLastPage
    );
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
    const dto = new PaginationDto(
      examplePagination.nextCursor,
      examplePagination.prevCursor,
      examplePagination.limit,
      examplePagination.totalCount,
      examplePagination.hasMore,
      examplePagination.currentPage,
      examplePagination.totalPages,
      examplePagination.order,
      examplePagination.hasPrev,
      examplePagination.isFirstPage,
      examplePagination.isLastPage
    );
    const json = JSON.stringify(dto);
    const expectedJson = JSON.stringify(examplePagination);
    expect(json).toBe(expectedJson);
  });

  it('should allow missing optional fields (if any)', () => {
    // If you want to allow some fields to be optional, adjust this test accordingly
    // For now, assume all fields are required
    expect(() => {
      // @ts-expect-error
      new PaginationDto();
    }).toThrow();
  });
}); 