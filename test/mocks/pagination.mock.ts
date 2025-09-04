// Basic pagination example (existing)
export const examplePagination = {
  nextCursor: 'NzU6LTYyMTM1NTk2ODAwOg==',
  prevCursor: 'ODI6LTYyMTM1NTk2ODAwOg==',
  limit: 5,
  totalCount: 37,
  hasMore: true,
  currentPage: 1,
  totalPages: 8,
  order: 'desc' as const,
  hasPrev: true,
  isFirstPage: false,
  isLastPage: false
};

// First page pagination
export const firstPagePagination = {
  nextCursor: 'eyJpZCI6IjEyMzQ1Njc4OTAxMiIsInNvcnQiOiJjcmVhdGVkQXQiLCJvcmRlciI6ImRlc2MifQ==',
  limit: 10,
  totalCount: 100,
  hasMore: true,
  currentPage: 1,
  totalPages: 10,
  order: 'desc' as const,
  hasPrev: false,
  isFirstPage: true,
  isLastPage: false
};

// Last page pagination
export const lastPagePagination = {
  prevCursor: 'eyJpZCI6IjEyMzQ1Njc4OTAxMSIsInNvcnQiOiJjcmVhdGVkQXQiLCJvcmRlciI6ImRlc2MifQ==',
  limit: 10,
  totalCount: 100,
  hasMore: false,
  currentPage: 10,
  totalPages: 10,
  order: 'desc' as const,
  hasPrev: true,
  isFirstPage: false,
  isLastPage: true
};

// Single page pagination
export const singlePagePagination = {
  limit: 10,
  totalCount: 5,
  hasMore: false,
  currentPage: 1,
  totalPages: 1,
  order: 'desc' as const,
  hasPrev: false,
  isFirstPage: true,
  isLastPage: true
};

// Middle page pagination
export const middlePagePagination = {
  nextCursor: 'eyJpZCI6IjEyMzQ1Njc4OTAxMyIsInNvcnQiOiJjcmVhdGVkQXQiLCJvcmRlciI6ImRlc2MifQ==',
  prevCursor: 'eyJpZCI6IjEyMzQ1Njc4OTAxMSIsInNvcnQiOiJjcmVhdGVkQXQiLCJvcmRlciI6ImRlc2MifQ==',
  limit: 10,
  totalCount: 100,
  hasMore: true,
  currentPage: 5,
  totalPages: 10,
  order: 'desc' as const,
  hasPrev: true,
  isFirstPage: false,
  isLastPage: false
};

// Ascending order pagination
export const ascendingPagination = {
  nextCursor: 'eyJpZCI6IjEyMzQ1Njc4OTAxMiIsInNvcnQiOiJjcmVhdGVkQXQiLCJvcmRlciI6ImFzYyJ9',
  prevCursor: 'eyJpZCI6IjEyMzQ1Njc4OTAxMSIsInNvcnQiOiJjcmVhdGVkQXQiLCJvcmRlciI6ImFzYyJ9',
  limit: 10,
  totalCount: 100,
  hasMore: true,
  currentPage: 3,
  totalPages: 10,
  order: 'asc' as const,
  hasPrev: true,
  isFirstPage: false,
  isLastPage: false
};

// Large dataset pagination
export const largeDatasetPagination = {
  nextCursor: 'eyJpZCI6IjEyMzQ1Njc4OTAxMiIsInNvcnQiOiJjcmVhdGVkQXQiLCJvcmRlciI6ImRlc2MifQ==',
  prevCursor: 'eyJpZCI6IjEyMzQ1Njc4OTAxMSIsInNvcnQiOiJjcmVhdGVkQXQiLCJvcmRlciI6ImRlc2MifQ==',
  limit: 50,
  totalCount: 10000,
  hasMore: true,
  currentPage: 150,
  totalPages: 200,
  order: 'desc' as const,
  hasPrev: true,
  isFirstPage: false,
  isLastPage: false
};

// Small limit pagination
export const smallLimitPagination = {
  nextCursor: 'eyJpZCI6IjEyMzQ1Njc4OTAxMiIsInNvcnQiOiJjcmVhdGVkQXQiLCJvcmRlciI6ImRlc2MifQ==',
  prevCursor: 'eyJpZCI6IjEyMzQ1Njc4OTAxMSIsInNvcnQiOiJjcmVhdGVkQXQiLCJvcmRlciI6ImRlc2MifQ==',
  limit: 1,
  totalCount: 10,
  hasMore: true,
  currentPage: 5,
  totalPages: 10,
  order: 'desc' as const,
  hasPrev: true,
  isFirstPage: false,
  isLastPage: false
};

// Empty result pagination
export const emptyResultPagination = {
  limit: 10,
  totalCount: 0,
  hasMore: false,
  currentPage: 1,
  totalPages: 0,
  order: 'desc' as const,
  hasPrev: false,
  isFirstPage: true,
  isLastPage: true
};

// Paginated Response Mocks
export const mockPaginatedResponse = {
  data: [],
  pagination: singlePagePagination,
  etag: 'W/"test-etag"',
  lastModified: "2023-01-01T00:00:00.000Z",
};

export const mockEmptyPaginatedResponse = {
  data: [],
  pagination: emptyResultPagination,
  etag: 'W/"empty-etag"',
  lastModified: undefined,
};

// Collection of all pagination scenarios
export const paginationScenarios = {
  example: examplePagination,
  firstPage: firstPagePagination,
  lastPage: lastPagePagination,
  singlePage: singlePagePagination,
  middlePage: middlePagePagination,
  ascending: ascendingPagination,
  largeDataset: largeDatasetPagination,
  smallLimit: smallLimitPagination,
  emptyResult: emptyResultPagination
}; 