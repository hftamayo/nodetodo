export type ApiError = {
  code: number;
  resultMessage: string;
  debugMessage?: string;
};

export const ErrorTypes = {
  NOT_AUTHORIZED: {
    code: 401,
    message: "NOT_AUTHORIZED",
  },
  FORBIDDEN: {
    code: 403,
    message: "FORBIDDEN",
  },
  NOT_FOUND: {
    code: 404,
    message: "NOT_FOUND",
  },
  BAD_REQUEST: {
    code: 400,
    message: "BAD_REQUEST",
  },
  INTERNAL_ERROR: {
    code: 500,
    message: "INTERNAL_ERROR",
  },
} as const;

export type ErrorType = keyof typeof ErrorTypes;
