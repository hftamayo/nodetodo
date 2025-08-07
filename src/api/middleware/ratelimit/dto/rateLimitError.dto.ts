import { RateLimitType, AccessLevel } from "../config/rateLimitConfig";

// Rate limit error response interface
export interface RateLimitErrorResponse {
  code: number;
  resultMessage: string;
  debugMessage: string;
  retryAfter: number;
  timestamp: number;
  rateLimitType?: RateLimitType;
  accessLevel?: AccessLevel;
  remainingRequests?: number;
  resetTime?: number;
}

// Rate limit error messages
export const RATE_LIMIT_ERROR_MESSAGES = {
  [RateLimitType.GLOBAL]: "RATE_LIMIT_EXCEEDED_GLOBAL",
  [RateLimitType.LOGIN]: "RATE_LIMIT_EXCEEDED_LOGIN",
  [RateLimitType.SIGNUP]: "RATE_LIMIT_EXCEEDED_SIGNUP",
  [RateLimitType.API]: "RATE_LIMIT_EXCEEDED_API",
  [RateLimitType.USER]: "RATE_LIMIT_EXCEEDED_USER",
  [RateLimitType.SUPERVISOR]: "RATE_LIMIT_EXCEEDED_SUPERVISOR",
  [RateLimitType.ADMIN]: "RATE_LIMIT_EXCEEDED_ADMIN",
} as const;

// Rate limit debug messages
export const RATE_LIMIT_DEBUG_MESSAGES = {
  [RateLimitType.GLOBAL]: "Too many requests from this IP address",
  [RateLimitType.LOGIN]: "Too many login attempts from this IP address",
  [RateLimitType.SIGNUP]: "Too many signup attempts from this IP address",
  [RateLimitType.API]: "Too many API requests from this IP address",
  [RateLimitType.USER]: "Too many requests for this user account",
  [RateLimitType.SUPERVISOR]: "Too many requests for this supervisor account",
  [RateLimitType.ADMIN]: "Too many requests for this admin account",
} as const;

// Rate Limit Error DTO Class
export class RateLimitErrorDTO implements RateLimitErrorResponse {
  public readonly code: number = 429;
  public readonly resultMessage: string;
  public readonly debugMessage: string;
  public readonly retryAfter: number;
  public readonly timestamp: number;
  public readonly rateLimitType?: RateLimitType;
  public readonly accessLevel?: AccessLevel;
  public readonly remainingRequests?: number;
  public readonly resetTime?: number;

  constructor(params: {
    rateLimitType: RateLimitType;
    retryAfter: number;
    accessLevel?: AccessLevel;
    remainingRequests?: number;
    resetTime?: number;
    customMessage?: string;
  }) {
    const { rateLimitType, retryAfter, accessLevel, remainingRequests, resetTime, customMessage } = params;
    
    this.resultMessage = customMessage || RATE_LIMIT_ERROR_MESSAGES[rateLimitType];
    this.debugMessage = RATE_LIMIT_DEBUG_MESSAGES[rateLimitType];
    this.retryAfter = retryAfter;
    this.timestamp = Date.now();
    this.rateLimitType = rateLimitType;
    this.accessLevel = accessLevel;
    this.remainingRequests = remainingRequests;
    this.resetTime = resetTime;
  }

  // Factory methods for different rate limit types
  static createGlobalError(retryAfter: number, remainingRequests?: number, resetTime?: number): RateLimitErrorDTO {
    return new RateLimitErrorDTO({
      rateLimitType: RateLimitType.GLOBAL,
      retryAfter,
      remainingRequests,
      resetTime,
    });
  }

  static createLoginError(retryAfter: number, remainingRequests?: number, resetTime?: number): RateLimitErrorDTO {
    return new RateLimitErrorDTO({
      rateLimitType: RateLimitType.LOGIN,
      retryAfter,
      remainingRequests,
      resetTime,
    });
  }

  static createSignUpError(retryAfter: number, remainingRequests?: number, resetTime?: number): RateLimitErrorDTO {
    return new RateLimitErrorDTO({
      rateLimitType: RateLimitType.SIGNUP,
      retryAfter,
      remainingRequests,
      resetTime,
    });
  }

  static createApiError(retryAfter: number, remainingRequests?: number, resetTime?: number): RateLimitErrorDTO {
    return new RateLimitErrorDTO({
      rateLimitType: RateLimitType.API,
      retryAfter,
      remainingRequests,
      resetTime,
    });
  }

  static createUserError(
    retryAfter: number, 
    accessLevel: AccessLevel = AccessLevel.USER,
    remainingRequests?: number, 
    resetTime?: number
  ): RateLimitErrorDTO {
    return new RateLimitErrorDTO({
      rateLimitType: RateLimitType.USER,
      retryAfter,
      accessLevel,
      remainingRequests,
      resetTime,
    });
  }

  static createSupervisorError(retryAfter: number, remainingRequests?: number, resetTime?: number): RateLimitErrorDTO {
    return new RateLimitErrorDTO({
      rateLimitType: RateLimitType.SUPERVISOR,
      retryAfter,
      accessLevel: AccessLevel.SUPERVISOR,
      remainingRequests,
      resetTime,
    });
  }

  static createAdminError(retryAfter: number, remainingRequests?: number, resetTime?: number): RateLimitErrorDTO {
    return new RateLimitErrorDTO({
      rateLimitType: RateLimitType.ADMIN,
      retryAfter,
      accessLevel: AccessLevel.ADMIN,
      remainingRequests,
      resetTime,
    });
  }

  // Create error by access level
  static createByAccessLevel(
    accessLevel: AccessLevel,
    retryAfter: number,
    remainingRequests?: number,
    resetTime?: number
  ): RateLimitErrorDTO {
    switch (accessLevel) {
      case AccessLevel.USER:
        return this.createUserError(retryAfter, accessLevel, remainingRequests, resetTime);
      case AccessLevel.SUPERVISOR:
        return this.createSupervisorError(retryAfter, remainingRequests, resetTime);
      case AccessLevel.ADMIN:
        return this.createAdminError(retryAfter, remainingRequests, resetTime);
      default:
        return this.createUserError(retryAfter, AccessLevel.USER, remainingRequests, resetTime);
    }
  }

  // Convert to plain object for JSON serialization
  toJSON(): RateLimitErrorResponse {
    return {
      code: this.code,
      resultMessage: this.resultMessage,
      debugMessage: this.debugMessage,
      retryAfter: this.retryAfter,
      timestamp: this.timestamp,
      rateLimitType: this.rateLimitType,
      accessLevel: this.accessLevel,
      remainingRequests: this.remainingRequests,
      resetTime: this.resetTime,
    };
  }

  // Get headers for rate limit response
  getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Retry-After': this.retryAfter.toString(),
      'X-RateLimit-Reset': this.resetTime ? new Date(this.resetTime).toISOString() : '',
    };

    if (this.remainingRequests !== undefined) {
      headers['X-RateLimit-Remaining'] = this.remainingRequests.toString();
    }

    return headers;
  }
}

// Export types and constants
export type { RateLimitErrorResponse };
export { RATE_LIMIT_ERROR_MESSAGES, RATE_LIMIT_DEBUG_MESSAGES };
