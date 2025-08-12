import { Request } from "express";
import { RateLimitType, AccessLevel } from "../config/rateLimitConfig";
import { RateLimitErrorDTO } from "../dto/rateLimitError.dto";
import { AuthenticatedUserRequest } from "@/types/user.types";

// IP address extraction and validation
export class IPUtils {
  /**
   * Extract real IP address from request, handling proxies and load balancers
   */
  static getClientIP(req: Request | AuthenticatedUserRequest): string {
    // Check for forwarded headers (common with proxies/load balancers)
    const forwardedFor = req.headers["x-forwarded-for"] as string;
    if (forwardedFor) {
      // X-Forwarded-For can contain multiple IPs, take the first one
      const firstIP = forwardedFor.split(",")[0].trim();
      if (this.isValidIP(firstIP)) {
        return firstIP;
      }
    }

    // Check for real IP header
    const realIP = req.headers["x-real-ip"] as string;
    if (realIP && this.isValidIP(realIP)) {
      return realIP;
    }

    // Check for client IP header
    const clientIP = req.headers["x-client-ip"] as string;
    if (clientIP && this.isValidIP(clientIP)) {
      return clientIP;
    }

    // Fallback to socket remote address
    const remoteAddr = req.socket?.remoteAddress;
    if (remoteAddr && this.isValidIP(remoteAddr)) {
      return remoteAddr;
    }

    // Final fallback
    return req.ip || "unknown";
  }

  /**
   * Validate IP address format
   */
  static isValidIP(ip: string): boolean {
    if (!ip || typeof ip !== "string") {
      return false;
    }

    // IPv4 validation (simplified, using \d and reduced complexity)
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipv4Regex.test(ip)) {
      // Additional check to ensure each octet is between 0 and 255
      const octets = ip.split(".").map(Number);
      if (
        octets.length === 4 &&
        octets.every((octet) => octet >= 0 && octet <= 255)
      ) {
        return true;
      }
    }

    // IPv6 validation (simplified)
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv6Regex.test(ip);
  }

  /**
   * Check if IP is in private range
   */
  static isPrivateIP(ip: string): boolean {
    if (!this.isValidIP(ip)) {
      return false;
    }

    // Private IP ranges
    const privateRanges = [
      /^10\./, // 10.0.0.0/8
      /^172\.(1[6-9]|2\d|3[0-1])\./, // 172.16.0.0/12
      /^192\.168\./, // 192.168.0.0/16
      /^127\./, // 127.0.0.0/8 (localhost)
      /^169\.254\./, // 169.254.0.0/16 (link-local)
      /^::1$/, // IPv6 localhost
      /^fe80:/, // IPv6 link-local
    ];

    return privateRanges.some((range) => range.test(ip));
  }
}

// Rate limit header management
export class HeaderUtils {
  /**
   * Generate standard rate limit headers
   */
  static generateRateLimitHeaders(
    limit: number,
    remaining: number,
    resetTime: number,
    retryAfter?: number
  ): Record<string, string> {
    const headers: Record<string, string> = {
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": new Date(resetTime).toISOString(),
    };

    if (retryAfter !== undefined) {
      headers["Retry-After"] = retryAfter.toString();
    }

    return headers;
  }

  /**
   * Add rate limit headers to response
   */
  static addRateLimitHeaders(
    res: any,
    limit: number,
    remaining: number,
    resetTime: number,
    retryAfter?: number
  ): void {
    const headers = this.generateRateLimitHeaders(
      limit,
      remaining,
      resetTime,
      retryAfter
    );

    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
  }

  /**
   * Extract rate limit info from response headers
   */
  static extractRateLimitInfo(headers: Record<string, string>): {
    limit?: number;
    remaining?: number;
    reset?: number;
    retryAfter?: number;
  } {
    return {
      limit: headers["x-ratelimit-limit"]
        ? parseInt(headers["x-ratelimit-limit"])
        : undefined,
      remaining: headers["x-ratelimit-remaining"]
        ? parseInt(headers["x-ratelimit-remaining"])
        : undefined,
      reset: headers["x-ratelimit-reset"]
        ? new Date(headers["x-ratelimit-reset"]).getTime()
        : undefined,
      retryAfter: headers["retry-after"]
        ? parseInt(headers["retry-after"])
        : undefined,
    };
  }
}

// Rate limit calculations and utilities
export class RateLimitUtils {
  /**
   * Calculate retry after time in seconds
   */
  static calculateRetryAfter(windowMs: number): number {
    return Math.ceil(windowMs / 1000);
  }

  /**
   * Calculate reset time based on current time and window
   */
  static calculateResetTime(windowMs: number): number {
    return Date.now() + windowMs;
  }

  /**
   * Check if rate limit should be applied based on request
   */
  static shouldApplyRateLimit(
    req: Request | AuthenticatedUserRequest,
    rateLimitType: RateLimitType
  ): boolean {
    // Skip rate limiting for health checks
    if (req.path === "/health" || req.path === "/hc") {
      return false;
    }

    // Skip rate limiting for static assets
    if (req.path.startsWith("/static/") || req.path.includes(".")) {
      return false;
    }

    // Skip rate limiting for OPTIONS requests (CORS preflight)
    if (req.method === "OPTIONS") {
      return false;
    }

    return true;
  }

  /**
   * Get rate limit key based on type and request
   */
  static getRateLimitKey(
    req: Request | AuthenticatedUserRequest,
    rateLimitType: RateLimitType,
    accessLevel?: AccessLevel
  ): string {
    const clientIP = IPUtils.getClientIP(req);

    switch (rateLimitType) {
      case RateLimitType.GLOBAL:
        return `rate_limit:global:${clientIP}`;

      case RateLimitType.LOGIN:
        return `rate_limit:login:${clientIP}`;

      case RateLimitType.SIGNUP:
        return `rate_limit:signup:${clientIP}`;

      case RateLimitType.API:
        return `rate_limit:api:${clientIP}`;

      case RateLimitType.USER: {
        const userId =
          (req as AuthenticatedUserRequest).user?.sub || "anonymous";
        return `rate_limit:user:${userId}:${accessLevel || AccessLevel.USER}`;
      }

      case RateLimitType.SUPERVISOR: {
        const supervisorId =
          (req as AuthenticatedUserRequest).user?.sub || "anonymous";
        return `rate_limit:supervisor:${supervisorId}`;
      }

      case RateLimitType.ADMIN: {
        const adminId =
          (req as AuthenticatedUserRequest).user?.sub || "anonymous";
        return `rate_limit:admin:${adminId}`;
      }

      default:
        return `rate_limit:global:${clientIP}`;
    }
  }

  /**
   * Create rate limit error with proper context
   */
  static createRateLimitError(
    rateLimitType: RateLimitType,
    windowMs: number,
    remainingRequests?: number,
    accessLevel?: AccessLevel
  ): RateLimitErrorDTO {
    const retryAfter = this.calculateRetryAfter(windowMs);
    const resetTime = this.calculateResetTime(windowMs);

    switch (rateLimitType) {
      case RateLimitType.GLOBAL:
        return RateLimitErrorDTO.createGlobalError(
          retryAfter,
          remainingRequests,
          resetTime
        );

      case RateLimitType.LOGIN:
        return RateLimitErrorDTO.createLoginError(
          retryAfter,
          remainingRequests,
          resetTime
        );

      case RateLimitType.SIGNUP:
        return RateLimitErrorDTO.createSignUpError(
          retryAfter,
          remainingRequests,
          resetTime
        );

      case RateLimitType.API:
        return RateLimitErrorDTO.createApiError(
          retryAfter,
          remainingRequests,
          resetTime
        );

      case RateLimitType.USER:
        return RateLimitErrorDTO.createUserError(
          retryAfter,
          accessLevel || AccessLevel.USER,
          remainingRequests,
          resetTime
        );

      case RateLimitType.SUPERVISOR:
        return RateLimitErrorDTO.createSupervisorError(
          retryAfter,
          remainingRequests,
          resetTime
        );

      case RateLimitType.ADMIN:
        return RateLimitErrorDTO.createAdminError(
          retryAfter,
          remainingRequests,
          resetTime
        );

      default:
        // Fallback: use global error handler for unknown types
        console.warn(
          `Unknown rate limit type: ${rateLimitType}. Using global error.`
        );
        return RateLimitErrorDTO.createGlobalError(
          retryAfter,
          remainingRequests,
          resetTime
        );
    }
  }

  /**
   * Log rate limit violation for monitoring
   */
  static logRateLimitViolation(
    req: Request | AuthenticatedUserRequest,
    rateLimitType: RateLimitType,
    clientIP: string,
    accessLevel?: AccessLevel
  ): void {
    const logData = {
      timestamp: new Date().toISOString(),
      rateLimitType,
      clientIP,
      userAgent: req.headers["user-agent"],
      method: req.method,
      path: req.path,
      accessLevel,
      userId: (req as AuthenticatedUserRequest).user?.sub,
    };

    console.warn("Rate limit violation:", JSON.stringify(logData));

    // In production, you might want to send this to a monitoring service
    // or log aggregation system
  }

  /**
   * Check if request is from a trusted source (whitelist)
   */
  static isTrustedSource(
    req: Request | AuthenticatedUserRequest,
    trustedIPs: string[] = []
  ): boolean {
    const clientIP = IPUtils.getClientIP(req);

    // Check if IP is in trusted list
    if (trustedIPs.includes(clientIP)) {
      return true;
    }

    // Check if IP is private (development/local)
    if (IPUtils.isPrivateIP(clientIP)) {
      return true;
    }

    return false;
  }
}
