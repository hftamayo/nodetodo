import { EndpointResponseDto } from "@/api/v1/dto/EndpointResponse.dto";
import { ErrorResponseDTO } from "@/api/v1/dto/error/ErrorResponse.dto";
import { UsersResponseDTO } from "@/api/v1/dto/users/usersResponse.dto";
import { RolesResponseDTO } from "@/api/v1/dto/roles/rolesResponse.dto";
import { TodosResponseDTO } from "@/api/v1/dto/todos/todosResponse.dto";
import { AppHealthCheckResponseDTO, DbHealthCheckResponseDTO } from "@/api/v1/dto/hc/healthCheckResponse.dto";
import { PaginatedResponseDTO, PaginationDTO } from "@/api/v1/dto/pagination/pagination.dto";
import { mockUserRoleUser, mockUserRoleSupervisor } from "./user.mock";
import { mockRolesData } from "./role.mock";
import { mockTodos } from "./todo.mock";

// DTO Response Mocks
export const mockUsersResponseDTO = new UsersResponseDTO({
  _id: mockUserRoleUser._id,
  name: mockUserRoleUser.name,
  email: mockUserRoleUser.email,
  age: mockUserRoleUser.age,
  role: mockUserRoleUser._id,
  status: true,
});

export const mockRolesResponseDTO = new RolesResponseDTO({
  _id: mockRolesData[0]._id,
  name: mockRolesData[0].name,
  description: mockRolesData[0].description,
  status: mockRolesData[0].status,
  permissions: Object.fromEntries(mockRolesData[0].permissions),
});

export const mockTodosResponseDTO = new TodosResponseDTO({
  _id: mockTodos[0]._id,
  title: mockTodos[0].title,
  description: mockTodos[0].description,
  completed: mockTodos[0].completed,
  owner: mockTodos[0].owner,
  updatedAt: mockTodos[0].updatedAt,
});

// Health Check Response Mocks
export const mockAppHealthCheckResponseDTO = new AppHealthCheckResponseDTO({
  code: 200,
  status: "pass",
  resultMessage: "APPLICATION_HEALTHY",
  details: {
    timestamp: new Date().toISOString(),
    uptime: 3600,
    memoryUsage: {
      total: 1024 * 1024 * 1024, // 1GB
      free: 512 * 1024 * 1024,   // 512MB
    },
  },
});

export const mockDbHealthCheckResponseDTO = new DbHealthCheckResponseDTO({
  code: 200,
  status: "pass",
  resultMessage: "DATABASE_HEALTHY",
  details: {
    timestamp: new Date().toISOString(),
    connectionTime: 15,
    databaseStatus: "connected",
  },
});

export const mockDbHealthCheckResponseDTOWithError = new DbHealthCheckResponseDTO({
  code: 503,
  status: "fail",
  resultMessage: "DATABASE_UNHEALTHY",
  details: {
    timestamp: new Date().toISOString(),
    error: "Connection timeout",
  },
});

// Pagination Mocks
export const mockPaginationDTO = new PaginationDTO({
  nextCursor: "eyJpZCI6IjEyMzQ1Njc4OTAxMiIsInNvcnQiOiJjcmVhdGVkQXQiLCJvcmRlciI6ImRlc2MifQ==",
  prevCursor: "eyJpZCI6IjEyMzQ1Njc4OTAxMSIsInNvcnQiOiJjcmVhdGVkQXQiLCJvcmRlciI6ImRlc2MifQ==",
  limit: 10,
  totalCount: 100,
  hasMore: true,
  currentPage: 1,
  totalPages: 10,
  order: "desc",
  hasPrev: false,
  isFirstPage: true,
  isLastPage: false,
});

export const mockPaginatedUsersResponseDTO = new PaginatedResponseDTO({
  data: [mockUsersResponseDTO],
  pagination: mockPaginationDTO,
  etag: 'W/"c62af7c60f38a0d065307abb4b3b8e4e3cb7ba48c4ca6db8175e550cdf173b0e"',
  lastModified: new Date().toISOString(),
});

export const mockPaginatedTodosResponseDTO = new PaginatedResponseDTO({
  data: [mockTodosResponseDTO],
  pagination: mockPaginationDTO,
  etag: 'W/"a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"',
});

// Endpoint Response Mocks
export const mockSuccessEndpointResponse = new EndpointResponseDto({
  code: 200,
  resultMessage: "OPERATION_SUCCESS",
  data: mockUsersResponseDTO,
  cacheTTL: 300,
});

export const mockSuccessEndpointResponseWithList = new EndpointResponseDto({
  code: 200,
  resultMessage: "OPERATION_SUCCESS",
  dataList: [mockUsersResponseDTO],
  cacheTTL: 300,
});

export const mockCreatedEndpointResponse = new EndpointResponseDto({
  code: 201,
  resultMessage: "ENTITY_CREATED",
  data: mockUsersResponseDTO,
  cacheTTL: 0,
});

export const mockErrorEndpointResponse = new ErrorResponseDTO({
  code: 404,
  resultMessage: "ENTITY_NOT_FOUND",
  debugMessage: "User with ID 123 not found",
  cacheTTL: 0,
});

export const mockValidationErrorResponse = new ErrorResponseDTO({
  code: 400,
  resultMessage: "REQUIREMENTS_MISSING",
  debugMessage: "Email field is required",
  cacheTTL: 0,
});

export const mockUnauthorizedErrorResponse = new ErrorResponseDTO({
  code: 401,
  resultMessage: "UNAUTHORIZED",
  debugMessage: "Invalid or expired token",
  cacheTTL: 0,
});

export const mockForbiddenErrorResponse = new ErrorResponseDTO({
  code: 403,
  resultMessage: "FORBIDDEN",
  debugMessage: "Insufficient permissions for this operation",
  cacheTTL: 0,
});

export const mockInternalServerErrorResponse = new ErrorResponseDTO({
  code: 500,
  resultMessage: "UNKNOWN_SERVER_ERROR",
  debugMessage: "Database connection failed",
  cacheTTL: 0,
});

// Multiple Items Response Mocks
export const mockMultipleUsersResponseDTO = [
  new UsersResponseDTO({
    _id: mockUserRoleUser._id,
    name: mockUserRoleUser.name,
    email: mockUserRoleUser.email,
    age: mockUserRoleUser.age,
    role: mockUserRoleUser._id,
    status: true,
  }),
  new UsersResponseDTO({
    _id: mockUserRoleSupervisor._id,
    name: mockUserRoleSupervisor.name,
    email: mockUserRoleSupervisor.email,
    age: mockUserRoleSupervisor.age,
    role: mockUserRoleSupervisor._id,
    status: true,
  }),
];

export const mockMultipleRolesResponseDTO = mockRolesData.map(role => 
  new RolesResponseDTO({
    _id: role._id,
    name: role.name,
    description: role.description,
    status: role.status,
    permissions: Object.fromEntries(role.permissions),
  })
);

export const mockMultipleTodosResponseDTO = mockTodos.map(todo =>
  new TodosResponseDTO({
    _id: todo._id,
    title: todo.title,
    description: todo.description,
    completed: todo.completed,
    owner: todo.owner,
    updatedAt: todo.updatedAt,
  })
);

// Edge Case Mocks
export const mockEmptyDataEndpointResponse = new EndpointResponseDto({
  code: 200,
  resultMessage: "OPERATION_SUCCESS",
  data: null,
  cacheTTL: 0,
});

export const mockEmptyListEndpointResponse = new EndpointResponseDto({
  code: 200,
  resultMessage: "OPERATION_SUCCESS",
  dataList: [],
  cacheTTL: 0,
});

// Pagination Edge Cases
export const mockFirstPagePaginationDTO = new PaginationDTO({
  nextCursor: "eyJpZCI6IjEyMzQ1Njc4OTAxMiIsInNvcnQiOiJjcmVhdGVkQXQiLCJvcmRlciI6ImRlc2MifQ==",
  limit: 10,
  totalCount: 100,
  hasMore: true,
  currentPage: 1,
  totalPages: 10,
  order: "desc",
  hasPrev: false,
  isFirstPage: true,
  isLastPage: false,
});

export const mockLastPagePaginationDTO = new PaginationDTO({
  prevCursor: "eyJpZCI6IjEyMzQ1Njc4OTAxMSIsInNvcnQiOiJjcmVhdGVkQXQiLCJvcmRlciI6ImRlc2MifQ==",
  limit: 10,
  totalCount: 100,
  hasMore: false,
  currentPage: 10,
  totalPages: 10,
  order: "desc",
  hasPrev: true,
  isFirstPage: false,
  isLastPage: true,
});

export const mockSinglePagePaginationDTO = new PaginationDTO({
  limit: 10,
  totalCount: 5,
  hasMore: false,
  currentPage: 1,
  totalPages: 1,
  order: "desc",
  hasPrev: false,
  isFirstPage: true,
  isLastPage: true,
});
