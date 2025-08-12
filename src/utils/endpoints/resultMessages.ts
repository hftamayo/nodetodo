export const ResultMessages = {
  SUCCESS: { code: 200, message: "OPERATION_SUCCESS" },
  CREATED: { code: 201, message: "ENTITY_CREATED" },
  BAD_REQUEST: { code: 400, message: "REQUIREMENTS_MISSING" },
  ENTITY_ALREADY_EXISTS: { code: 400, message: "ENTITY_ALREADY_EXISTS" },
  UNAUTHORIZED: { code: 401, message: "UNAUTHORIZED" },
  BAD_CREDENTIALS: { code: 402, message: "BAD_CREDENTIALS" },
  FORBIDDEN: { code: 403, message: "FORBIDDEN" },
  ERROR: { code: 404, message: "ENTITY_NOT_FOUND" },
  ACCOUNT_DISABLED: { code: 405, message: "ACCOUNT_DISABLED" },
  INTERNAL_SERVER_ERROR: { code: 500, message: "UNKNOWN_SERVER_ERROR" },
  // ...add more as needed
} as const;

export type ResultMessageKeys = keyof typeof ResultMessages;
