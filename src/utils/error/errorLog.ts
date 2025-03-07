import { ApiError, ErrorType, ErrorTypes } from "../../types/error.types";
import { mode } from "../../config/envvars";

export const createApiError = (
  type: ErrorType,
  message: string,
  debug?: string
): ApiError => {
  const error: ApiError = {
    code: ErrorTypes[type].code,
    resultMessage: ErrorTypes[type].message,
    debugMessage: debug ? message + ": " + debug : message,
  };

  // Log error details in development
  if (mode !== "production") {
    console.error(
      `[${error.code}][${error.resultMessage}] ${error.debugMessage}`
    );
  }

  return error;
};
