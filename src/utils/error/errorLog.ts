import { ApiError, ErrorType, ErrorTypes } from "../../types/error.types";
import { mode } from "../../config/envvars";

export const createApiError = (
  type: ErrorType,
  message: string,
  debug?: string,
  path?: string,
  method?: string,
  domain?: string,
  requiredPermission?: string,
  token?: string
): ApiError => {
  const error: ApiError = {
    timestamp: new Date().toISOString(),
    path: path?.toString(),
    method: method?.toString(),
    domain: domain?.toString(),
    requiredPermission: requiredPermission?.toString(),
    cookiePresent: !!token,
    code: ErrorTypes[type].code,
    resultMessage: ErrorTypes[type].message,
    debugMessage: debug ? message + ": " + debug : message,
  };

  // Log error details in development
  if (mode !== "production") {
    console.error(`
      [ERROR LOG]
      Timestamp: ${error.timestamp}
      Path: ${error.path ?? "N/A"},
      Method: ${error.method ?? "N/A"},
      Domain: ${error.domain ?? "N/A"},
      Required Permission: ${error.requiredPermission ?? "N/A"},
      Cookie Present: ${error.cookiePresent}
      Code: ${error.code}
      Type: ${type}
      Message: ${error.resultMessage}
      Debug: ${error.debugMessage}
      Stack: ${new Error().stack}
    `);
  } else {
    //persistence routine for error logging
  }

  return error;
};
