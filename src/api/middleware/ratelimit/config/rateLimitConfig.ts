import { RATE_LIMITS } from "@config/envvars";

// Rate limiting configuration interface
export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

// Rate limiting types for different scenarios
export enum RateLimitType {
  GLOBAL = "global",
  LOGIN = "login",
  SIGNUP = "signup",
  API = "api",
  USER = "user",
  SUPERVISOR = "supervisor",
  ADMIN = "admin",
}

// Access levels aligned with your permission system
export enum AccessLevel {
  USER = "user",
  SUPERVISOR = "supervisor", 
  ADMIN = "admin",
}

// Parse ISO 8601 duration to milliseconds
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) {
    throw new Error(`Invalid ISO 8601 duration format: ${duration}`);
  }
  
  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");
  
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

// Validate and parse rate limiting environment variables
function validateRateLimitConfig() {
  // Use environment values with sensible defaults
  const capacity = parseInt(RATE_LIMITS.capacity || "100");
  const refillRate = parseInt(RATE_LIMITS.refillRate || "10");
  const refillDuration = RATE_LIMITS.refillDuration || "PT1M";
  const window = parseInt(RATE_LIMITS.window || "60000");
  
  const loginCapacity = parseInt(RATE_LIMITS.loginCapacity || "5");
  const signUpCapacity = parseInt(RATE_LIMITS.signUpCapacity || "3");
  const apiCapacity = parseInt(RATE_LIMITS.apiCapacity || "50");

  // Validation
  if (isNaN(capacity) || capacity <= 0) {
    throw new Error("Invalid RATE_LIMIT_CAPACITY: must be a positive number");
  }
  if (isNaN(refillRate) || refillRate <= 0) {
    throw new Error("Invalid RATE_LIMIT_REFILL_RATE: must be a positive number");
  }
  if (isNaN(window) || window <= 0) {
    throw new Error("Invalid RATE_LIMIT_WINDOW_MS: must be a positive number");
  }
  if (isNaN(loginCapacity) || loginCapacity <= 0) {
    throw new Error("Invalid RATE_LIMIT_LOGIN_CAPACITY: must be a positive number");
  }
  if (isNaN(signUpCapacity) || signUpCapacity <= 0) {
    throw new Error("Invalid RATE_LIMIT_SIGNUP_CAPACITY: must be a positive number");
  }
  if (isNaN(apiCapacity) || apiCapacity <= 0) {
    throw new Error("Invalid RATE_LIMIT_API_CAPACITY: must be a positive number");
  }

  return {
    capacity,
    refillRate,
    refillDuration,
    window,
    loginCapacity,
    signUpCapacity,
    apiCapacity,
  };
}

// Get validated configuration
const config = validateRateLimitConfig();

// Calculate retry after time in seconds
function calculateRetryAfter(windowMs: number): number {
  return Math.ceil(windowMs / 1000);
}

// Generate rate limit error message
function generateErrorMessage(type: RateLimitType, retryAfter: number): string {
  const messages = {
    [RateLimitType.GLOBAL]: `Too many requests from this IP, please try again in ${retryAfter} seconds`,
    [RateLimitType.LOGIN]: `Too many login attempts from this IP, please try again in ${retryAfter} seconds`,
    [RateLimitType.SIGNUP]: `Too many signup attempts from this IP, please try again in ${retryAfter} seconds`,
    [RateLimitType.API]: `Too many API requests from this IP, please try again in ${retryAfter} seconds`,
    [RateLimitType.USER]: `Too many requests for this user, please try again in ${retryAfter} seconds`,
    [RateLimitType.SUPERVISOR]: `Too many requests for this supervisor, please try again in ${retryAfter} seconds`,
    [RateLimitType.ADMIN]: `Too many admin requests, please try again in ${retryAfter} seconds`,
  };
  
  return messages[type] || messages[RateLimitType.GLOBAL];
}

// Get rate limit capacity based on access level
function getCapacityByAccessLevel(accessLevel: AccessLevel): number {
  const capacities = {
    [AccessLevel.USER]: config.capacity,
    [AccessLevel.SUPERVISOR]: config.capacity * 2, // 2x user capacity
    [AccessLevel.ADMIN]: config.capacity * 5, // 5x user capacity
  };
  
  return capacities[accessLevel] || config.capacity;
}

// Configuration factory methods
export const RateLimitConfigFactory = {
  // Global rate limiting (IP-based)
  getGlobalConfig(): RateLimitConfig {
    const retryAfter = calculateRetryAfter(config.window);
    return {
      windowMs: config.window,
      max: config.capacity,
      message: generateErrorMessage(RateLimitType.GLOBAL, retryAfter),
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    };
  },

  // Login rate limiting (stricter)
  getLoginConfig(): RateLimitConfig {
    const retryAfter = calculateRetryAfter(config.window);
    return {
      windowMs: config.window,
      max: config.loginCapacity,
      message: generateErrorMessage(RateLimitType.LOGIN, retryAfter),
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: true, // Don't count successful logins
      skipFailedRequests: false,
    };
  },

  // Signup rate limiting (very strict)
  getSignUpConfig(): RateLimitConfig {
    const retryAfter = calculateRetryAfter(config.window);
    return {
      windowMs: config.window,
      max: config.signUpCapacity,
      message: generateErrorMessage(RateLimitType.SIGNUP, retryAfter),
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: true, // Don't count successful signups
      skipFailedRequests: false,
    };
  },

  // API rate limiting (general endpoints)
  getApiConfig(): RateLimitConfig {
    const retryAfter = calculateRetryAfter(config.window);
    return {
      windowMs: config.window,
      max: config.apiCapacity,
      message: generateErrorMessage(RateLimitType.API, retryAfter),
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    };
  },

  // User-specific rate limiting (after authentication)
  getUserConfig(): RateLimitConfig {
    const retryAfter = calculateRetryAfter(config.window);
    return {
      windowMs: config.window,
      max: getCapacityByAccessLevel(AccessLevel.USER),
      message: generateErrorMessage(RateLimitType.USER, retryAfter),
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    };
  },

  // Supervisor-specific rate limiting
  getSupervisorConfig(): RateLimitConfig {
    const retryAfter = calculateRetryAfter(config.window);
    return {
      windowMs: config.window,
      max: getCapacityByAccessLevel(AccessLevel.SUPERVISOR),
      message: generateErrorMessage(RateLimitType.SUPERVISOR, retryAfter),
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    };
  },

  // Admin rate limiting (higher limits)
  getAdminConfig(): RateLimitConfig {
    const retryAfter = calculateRetryAfter(config.window);
    return {
      windowMs: config.window,
      max: getCapacityByAccessLevel(AccessLevel.ADMIN),
      message: generateErrorMessage(RateLimitType.ADMIN, retryAfter),
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    };
  },

  // Get config by access level
  getConfigByAccessLevel(accessLevel: AccessLevel): RateLimitConfig {
    switch (accessLevel) {
      case AccessLevel.USER:
        return this.getUserConfig();
      case AccessLevel.SUPERVISOR:
        return this.getSupervisorConfig();
      case AccessLevel.ADMIN:
        return this.getAdminConfig();
      default:
        return this.getUserConfig();
    }
  },

  // Custom configuration
  getCustomConfig(
    max: number,
    windowMs: number = config.window,
    type: RateLimitType = RateLimitType.GLOBAL
  ): RateLimitConfig {
    const retryAfter = calculateRetryAfter(windowMs);
    return {
      windowMs,
      max,
      message: generateErrorMessage(type, retryAfter),
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    };
  },
};

// Export configuration values for other modules
export const RateLimitConfig = {
  ...config,
  RateLimitType,
  AccessLevel,
  calculateRetryAfter,
  generateErrorMessage,
  parseDuration,
  getCapacityByAccessLevel,
};
