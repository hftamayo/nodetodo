import { ErrorEvent } from "@/types/error.types";

export class ErrorResponseDTO implements Pick<ErrorEvent, "code" | "resultMessage" | "debugMessage" | "timestamp"> {
  code: number;
  resultMessage: string;
  debugMessage?: string;
  timestamp: string;
  cacheTTL: number;

  constructor(options: {
    code: number;
    resultMessage: string;
    debugMessage?: string;
    timestamp?: number;
    cacheTTL?: number;
  }) {
    this.code = options.code;
    this.resultMessage = options.resultMessage;
    this.debugMessage = options.debugMessage;
    this.timestamp = options.timestamp ? new Date(options.timestamp).toISOString() : new Date().toISOString();
    this.cacheTTL = options.cacheTTL ?? 0;
  }
} 