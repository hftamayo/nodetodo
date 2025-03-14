import {
  LogLevel,
  EventContext,
  InformativeEvent,
  ErrorEvent,
  ErrorType,
  ErrorTypes,
} from "../../types/event.types";
import { mode } from "../../config/envvars";

const formatLogEntry = (entry: InformativeEvent | ErrorEvent): string => {
  const baseLog = `
    [${entry.section}][${entry.level.toUpperCase()}]
    Timestamp: ${entry.timestamp}
    Message: ${entry.message}
    ${entry.context ? `Context: ${JSON.stringify(entry.context, null, 2)}` : ""}
  `;

  if ("code" in entry) {
    return `${baseLog}
    Code: ${entry.code}
    ResultMessage: ${entry.resultMessage}
    ${entry.debugMessage ? `Debug: ${entry.debugMessage}` : ""}
    ${mode !== "production" ? `Stack: ${new Error().stack}` : ""}
    `;
  }

  return baseLog;
};

export const createLog = (
  level: LogLevel,
  section: string,
  message: string,
  context?: EventContext
): InformativeEvent => {
  const entry: InformativeEvent = {
    level,
    section,
    message,
    timestamp: new Date().toISOString(),
    context,
  };

  if (mode !== "production" || level === "error") {
    switch (level) {
      case "debug":
        console.debug(formatLogEntry(entry));
        break;
      case "info":
        console.info(formatLogEntry(entry));
        break;
      case "error":
        console.error(formatLogEntry(entry));
        break;
    }
  }

  return entry;
};

export const createApiError = (
  type: ErrorType,
  message: string,
  debug?: string,
  context?: EventContext
): ErrorEvent => {
  const error: ErrorEvent = {
    level: "error",
    section: "API_ERROR",
    code: ErrorTypes[type].code,
    resultMessage: ErrorTypes[type].message,
    timestamp: new Date().toISOString(),
    message,
    debugMessage: debug,
    context,
  };

  if (mode !== "production" || error.code >= 500) {
    console.error(formatLogEntry(error));
  }

  return error;
};
