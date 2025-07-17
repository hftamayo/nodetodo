import { ResultMessages } from "@/utils/messages/resultMessages";

export type LogLevel = "debug" | "info" | "error";

export type EventContext = {
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
  timestamp: string;
  context?: EventContext;
};

export type ErrorEvent = InformativeEvent & {
  code: number;
  resultMessage: string;
  debugMessage?: string;
};

export const ErrorTypes = {
  NOT_AUTHORIZED: ResultMessages.UNAUTHORIZED,
  FORBIDDEN: ResultMessages.FORBIDDEN,

  NOT_FOUND: ResultMessages.ERROR,
  BAD_REQUEST: ResultMessages.BAD_REQUEST,
  INTERNAL_ERROR: ResultMessages.INTERNAL_SERVER_ERROR,
} as const;

export type ErrorType = keyof typeof ErrorTypes;
