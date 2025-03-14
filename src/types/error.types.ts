type LogLevel = "debug" | "info" | "error";

export type ErrorContext = {
  path?: string;
  method?: string;
  domain?: string;
  requiredPermission?: string;
  cookiePresent: boolean;
};

export type InformativeEvent = {
  level: LogLevel;
  section: string;
  message: string;
  context?: ErrorContext;
};

export type ApiError = {
  level: LogLevel;
  code: number;
  resultMessage: string;
  timestamp: string;
  debugMessage?: string;
  context?: ErrorContext;
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
