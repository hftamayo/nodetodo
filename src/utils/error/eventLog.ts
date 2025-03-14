import {
  InformativeEvent,
  ApiError,
  ErrorContext,
  ErrorType,
  ErrorTypes,
} from "../../types/event.types";
import { mode } from "../../config/envvars";

export const createInformativeEvent = (
  section: string,
  message: string,
  context?: ErrorContext
): InformativeEvent => {
  const event: InformativeEvent = {
    level: "info",
    section: section,
    message: message,
    context: context,
  }
  : undefined,
};

export const createApiError = (
  type: ErrorType,
  message: string,
  debug?: string,
  context?: ErrorContext
): ApiError => {
  const error: ApiError = {
    level: "error",
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
    switch(error.level){
      case "info":
        console.info(`
          [INFO LOG]
   [${section}][${level.toUpperCase()}]
        Timestamp: ${logEntry.timestamp}
        Message: ${message}
        ${context ? `Context: ${JSON.stringify(context, null, 2)}` : ''}          
          `);
        break;
        case "error":
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
          break;
    }

  } else {
    //persistence routine for error logging
  }

  return error;
};
