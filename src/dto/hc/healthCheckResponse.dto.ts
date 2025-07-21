import { AppHealthDetails, DbHealthDetails } from "@/types/hc.types";

// Generic base class (not exported)
class BaseHealthCheckResponseDTO<T> {
  code: number;
  status: "pass" | "warn" | "fail";
  resultMessage: string;
  details?: T;

  constructor({ code, status, resultMessage, details }: {
    code: number;
    status: "pass" | "warn" | "fail";
    resultMessage: string;
    details?: T;
  }) {
    this.code = code;
    this.status = status;
    this.resultMessage = resultMessage;
    if (details !== undefined) {
      this.details = details;
    }
  }
}

// Exported DTOs
export class AppHealthCheckResponseDTO extends BaseHealthCheckResponseDTO<AppHealthDetails> {}
export class DbHealthCheckResponseDTO extends BaseHealthCheckResponseDTO<DbHealthDetails> {} 