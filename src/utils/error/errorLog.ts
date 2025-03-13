import {
  ApiError,
  ErrorContext,
  ErrorType,
  ErrorTypes,
} from "../../types/error.types";
import { mode } from "../../config/envvars";

export const createApiError = (
  type: ErrorType,
  message: string,
  debug?: string,
  context?: ErrorContext
): ApiError => {
  const error: ApiError = {
    code: ErrorTypes[type].code,
    resultMessage: ErrorTypes[type].message,
    timestamp: new Date().toISOString(),
    debugMessage: debug ? message + ": " + debug : message,
    context: context
      ? {
          path: context.path,
          method: context.method,
          domain: context.domain,
          requiredPermission: context.requiredPermission,
          cookiePresent: context.cookiePresent,
        }
      : undefined,
  };

  // Log error details in development
  if (mode !== "production") {
    console.error(`
      [ERROR LOG]
      Timestamp: ${error.timestamp}
      Path: ${error.context?.path ?? "N/A"},
      Method: ${error.context?.method ?? "N/A"},
      Domain: ${error.context?.domain ?? "N/A"},
      Required Permission: ${error.context?.requiredPermission ?? "N/A"},
      Cookie Present: ${error.context?.cookiePresent}
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
