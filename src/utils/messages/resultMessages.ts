export const ResultMessages = {
  CREATED: { code: 201, message: "ENTITY_CREATED" },
  SUCCESS: { code: 200, message: "OPERATION_SUCCESS" },
  ERROR: { code: 404, message: "ENTITY_NOT_FOUND" },
  BAD_REQUEST: { code: 400, message: "REQUIREMENT_MISSING" },
  UNAUTHORIZED: { code: 401, message: "UNAUTHORIZED" },
  FORBIDDEN: { code: 403, message: "FORBIDDEN" },
  INTERNAL_SERVER_ERROR: { code: 500, message: "UNKNOWN_SERVER_ERROR" },
  ENTITY_ALREADY_EXISTS: { code: 400, message: "ROLE_ALREADY_EXISTS" },
  // ...add more as needed
} as const;

export type ResultMessageKeys = keyof typeof ResultMessages;
