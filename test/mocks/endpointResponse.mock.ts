import { EndpointResponseDto } from "@/api/v1/dto/EndpointResponse.dto";
import { ErrorResponseDTO } from "@/api/v1/dto/error/ErrorResponse.dto";
import { mockUsersResponseDTO, mockRolesResponseDTO, mockTodosResponseDTO } from "./dto.mock";

// Success Response Mocks
export const mockSuccessResponse = new EndpointResponseDto({
  code: 200,
  resultMessage: "OPERATION_SUCCESS",
  data: mockUsersResponseDTO,
  cacheTTL: 300,
});

export const mockSuccessResponseWithList = new EndpointResponseDto({
  code: 200,
  resultMessage: "OPERATION_SUCCESS",
  dataList: [mockUsersResponseDTO],
  cacheTTL: 300,
});

export const mockCreatedResponse = new EndpointResponseDto({
  code: 201,
  resultMessage: "ENTITY_CREATED",
  data: mockUsersResponseDTO,
  cacheTTL: 0,
});

export const mockUpdatedResponse = new EndpointResponseDto({
  code: 200,
  resultMessage: "ENTITY_UPDATED",
  data: mockUsersResponseDTO,
  cacheTTL: 300,
});

export const mockDeletedResponse = new EndpointResponseDto({
  code: 200,
  resultMessage: "ENTITY_DELETED",
  data: null,
  cacheTTL: 0,
});

// Error Response Mocks
export const mockBadRequestResponse = new ErrorResponseDTO({
  code: 400,
  resultMessage: "REQUIREMENTS_MISSING",
  debugMessage: "Required field 'email' is missing",
  cacheTTL: 0,
});

export const mockUnauthorizedResponse = new ErrorResponseDTO({
  code: 401,
  resultMessage: "UNAUTHORIZED",
  debugMessage: "Invalid or expired authentication token",
  cacheTTL: 0,
});

export const mockForbiddenResponse = new ErrorResponseDTO({
  code: 403,
  resultMessage: "FORBIDDEN",
  debugMessage: "Insufficient permissions for this operation",
  cacheTTL: 0,
});

export const mockNotFoundResponse = new ErrorResponseDTO({
  code: 404,
  resultMessage: "ENTITY_NOT_FOUND",
  debugMessage: "User with ID '123456789012' not found",
  cacheTTL: 0,
});

export const mockConflictResponse = new ErrorResponseDTO({
  code: 409,
  resultMessage: "ENTITY_ALREADY_EXISTS",
  debugMessage: "User with email 'john@example.com' already exists",
  cacheTTL: 0,
});

export const mockInternalServerErrorResponse = new ErrorResponseDTO({
  code: 500,
  resultMessage: "UNKNOWN_SERVER_ERROR",
  debugMessage: "Database connection failed",
  cacheTTL: 0,
});

// Validation Error Responses
export const mockValidationErrorResponse = new ErrorResponseDTO({
  code: 400,
  resultMessage: "VALIDATION_ERROR",
  debugMessage: "Invalid email format",
  cacheTTL: 0,
});

export const mockPasswordMismatchResponse = new ErrorResponseDTO({
  code: 400,
  resultMessage: "PASSWORD_MISMATCH",
  debugMessage: "Passwords do not match",
  cacheTTL: 0,
});

export const mockInvalidCredentialsResponse = new ErrorResponseDTO({
  code: 401,
  resultMessage: "INVALID_CREDENTIALS",
  debugMessage: "Invalid email or password",
  cacheTTL: 0,
});

// Role-specific Error Responses
export const mockRoleNotFoundResponse = new ErrorResponseDTO({
  code: 404,
  resultMessage: "ROLE_NOT_FOUND",
  debugMessage: "Role with ID 'adminRoleId123456789012' not found",
  cacheTTL: 0,
});

export const mockRoleAlreadyExistsResponse = new ErrorResponseDTO({
  code: 409,
  resultMessage: "ROLE_ALREADY_EXISTS",
  debugMessage: "Role with name 'admin' already exists",
  cacheTTL: 0,
});

// Todo-specific Error Responses
export const mockTodoNotFoundResponse = new ErrorResponseDTO({
  code: 404,
  resultMessage: "TODO_NOT_FOUND",
  debugMessage: "Todo with ID '123456789001' not found",
  cacheTTL: 0,
});

export const mockTodoAccessDeniedResponse = new ErrorResponseDTO({
  code: 403,
  resultMessage: "TODO_ACCESS_DENIED",
  debugMessage: "You don't have permission to access this todo",
  cacheTTL: 0,
});

// User-specific Error Responses
export const mockUserNotFoundResponse = new ErrorResponseDTO({
  code: 404,
  resultMessage: "USER_NOT_FOUND",
  debugMessage: "User with ID '123456789012' not found",
  cacheTTL: 0,
});

export const mockUserAlreadyExistsResponse = new ErrorResponseDTO({
  code: 409,
  resultMessage: "USER_ALREADY_EXISTS",
  debugMessage: "User with email 'john@example.com' already exists",
  cacheTTL: 0,
});

export const mockUserAccountDisabledResponse = new ErrorResponseDTO({
  code: 405,
  resultMessage: "ACCOUNT_DISABLED",
  debugMessage: "User account has been disabled",
  cacheTTL: 0,
});

// Pagination Error Responses
export const mockInvalidPaginationResponse = new ErrorResponseDTO({
  code: 400,
  resultMessage: "INVALID_PAGINATION",
  debugMessage: "Invalid cursor or limit parameter",
  cacheTTL: 0,
});

// Cache-related Responses
export const mockCachedResponse = new EndpointResponseDto({
  code: 200,
  resultMessage: "OPERATION_SUCCESS",
  data: mockUsersResponseDTO,
  cacheTTL: 3600, // 1 hour cache
});

export const mockNoCacheResponse = new EndpointResponseDto({
  code: 200,
  resultMessage: "OPERATION_SUCCESS",
  data: mockUsersResponseDTO,
  cacheTTL: 0, // No cache
});

// Multiple Entity Responses
export const mockMultipleUsersResponse = new EndpointResponseDto({
  code: 200,
  resultMessage: "OPERATION_SUCCESS",
  dataList: [mockUsersResponseDTO],
  cacheTTL: 300,
});

export const mockMultipleRolesResponse = new EndpointResponseDto({
  code: 200,
  resultMessage: "OPERATION_SUCCESS",
  dataList: [mockRolesResponseDTO],
  cacheTTL: 300,
});

export const mockMultipleTodosResponse = new EndpointResponseDto({
  code: 200,
  resultMessage: "OPERATION_SUCCESS",
  dataList: [mockTodosResponseDTO],
  cacheTTL: 300,
});

// Empty Data Responses
export const mockEmptyDataResponse = new EndpointResponseDto({
  code: 200,
  resultMessage: "OPERATION_SUCCESS",
  data: null,
  cacheTTL: 0,
});

export const mockEmptyListResponse = new EndpointResponseDto({
  code: 200,
  resultMessage: "OPERATION_SUCCESS",
  dataList: [],
  cacheTTL: 0,
});

// Response Collections for Testing
export const successResponses = {
  single: mockSuccessResponse,
  list: mockSuccessResponseWithList,
  created: mockCreatedResponse,
  updated: mockUpdatedResponse,
  deleted: mockDeletedResponse,
  cached: mockCachedResponse,
  noCache: mockNoCacheResponse,
  empty: mockEmptyDataResponse,
  emptyList: mockEmptyListResponse,
};

export const errorResponses = {
  badRequest: mockBadRequestResponse,
  unauthorized: mockUnauthorizedResponse,
  forbidden: mockForbiddenResponse,
  notFound: mockNotFoundResponse,
  conflict: mockConflictResponse,
  internalServerError: mockInternalServerErrorResponse,
  validation: mockValidationErrorResponse,
  passwordMismatch: mockPasswordMismatchResponse,
  invalidCredentials: mockInvalidCredentialsResponse,
  roleNotFound: mockRoleNotFoundResponse,
  roleAlreadyExists: mockRoleAlreadyExistsResponse,
  todoNotFound: mockTodoNotFoundResponse,
  todoAccessDenied: mockTodoAccessDeniedResponse,
  userNotFound: mockUserNotFoundResponse,
  userAlreadyExists: mockUserAlreadyExistsResponse,
  userAccountDisabled: mockUserAccountDisabledResponse,
  invalidPagination: mockInvalidPaginationResponse,
};

export const entityResponses = {
  users: mockMultipleUsersResponse,
  roles: mockMultipleRolesResponse,
  todos: mockMultipleTodosResponse,
};
