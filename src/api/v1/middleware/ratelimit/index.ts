// Main export file for the rate limiting system
// Clean exports from our modular rate limiting structure

// Import all modules
import {
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
  RateLimitMiddleware,
} from "./aspect/rateLimitAspect";

import {
  RateLimitConfigFactory,
  RateLimitConfig,
  RateLimitType,
  AccessLevel,
} from "./config/rateLimitConfig";

import {
  RateLimitErrorDTO,
  RateLimitErrorResponse,
  RATE_LIMIT_ERROR_MESSAGES,
  RATE_LIMIT_DEBUG_MESSAGES,
} from "./dto/rateLimitError.dto";

import {
  IPUtils,
  HeaderUtils,
  RateLimitUtils,
} from "./utils/rateLimitUtils";

// Export all middleware
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
};

// Export configuration and types
export {
  RateLimitConfigFactory,
  RateLimitConfig,
  RateLimitType,
  AccessLevel,
};

// Export error DTOs and types
export {
  RateLimitErrorDTO,
  RateLimitErrorResponse,
  RATE_LIMIT_ERROR_MESSAGES,
  RATE_LIMIT_DEBUG_MESSAGES,
};

// Export utility functions
export {
  IPUtils,
  HeaderUtils,
  RateLimitUtils,
};

// Export types for external use
export type { RateLimitMiddleware };

// Default export with clean structure
const rateLimiter = {
  // Main middleware exports
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
