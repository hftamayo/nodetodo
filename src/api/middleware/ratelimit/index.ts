// Main export file for the rate limiting system
// This replaces the old implementation with our new modular structure

// Export the main rate limiting aspect (middleware factory)
export {
  RateLimitAspect,
  globalLimiter,
  loginLimiter,
  signUpLimiter,
  apiLimiter,
  userLimiter,
  supervisorLimiter,
  adminLimiter,
  createUserLimiter,
  createCustomLimiter,
  addRateLimitHeadersMiddleware,
  rateLimitErrorHandler,
} from "./aspect/rateLimitAspect";

// Export configuration and types
export {
  RateLimitConfigFactory,
  RateLimitConfig,
  RateLimitType,
  AccessLevel,
} from "./config/rateLimitConfig";

// Export error DTOs and types
export {
  RateLimitErrorDTO,
  RateLimitErrorResponse,
  RATE_LIMIT_ERROR_MESSAGES,
  RATE_LIMIT_DEBUG_MESSAGES,
} from "./dto/rateLimitError.dto";

// Export utility functions
export {
  IPUtils,
  HeaderUtils,
  RateLimitUtils,
} from "./utils/rateLimitUtils";

// Export types for external use
export type { RateLimitMiddleware } from "./aspect/rateLimitAspect";

// Default export for backward compatibility
// This maintains the same interface as the old rateLimiter.ts
const rateLimiter = {
  // Legacy exports for backward compatibility
  signUpLimiter: globalLimiter,
  loginLimiter: loginLimiter,
  
  // New comprehensive exports
  globalLimiter,
  apiLimiter,
  userLimiter,
  supervisorLimiter,
  adminLimiter,
  createUserLimiter,
  createCustomLimiter,
  addRateLimitHeadersMiddleware,
  rateLimitErrorHandler,
  
  // Configuration access
  config: RateLimitConfigFactory,
  types: {
    RateLimitType,
    AccessLevel,
  },
  
  // Utility access
  utils: {
    IPUtils,
    HeaderUtils,
    RateLimitUtils,
  },
  
  // Error handling
  errors: {
    RateLimitErrorDTO,
    RATE_LIMIT_ERROR_MESSAGES,
    RATE_LIMIT_DEBUG_MESSAGES,
  },
};

export default rateLimiter;
