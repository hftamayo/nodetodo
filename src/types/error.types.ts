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
