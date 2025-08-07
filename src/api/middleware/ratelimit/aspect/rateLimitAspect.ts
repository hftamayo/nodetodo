import { RequestHandler, Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { RateLimitConfigFactory, RateLimitType, AccessLevel } from "../config/rateLimitConfig";
import { RateLimitErrorDTO } from "../dto/rateLimitError.dto";
import { IPUtils, HeaderUtils, RateLimitUtils } from "../utils/rateLimitUtils";

// Rate limit middleware interface
export interface RateLimitMiddleware {
  globalLimiter: RequestHandler;
  loginLimiter: RequestHandler;
  signUpLimiter: RequestHandler;
  apiLimiter: RequestHandler;
  userLimiter: RequestHandler;
  supervisorLimiter: RequestHandler;
  adminLimiter: RequestHandler;
  createUserLimiter: (accessLevel: AccessLevel) => RequestHandler;
  createCustomLimiter: (config: any) => RequestHandler;
}

// Custom rate limit handler for 429 responses
function createRateLimitHandler(rateLimitType: RateLimitType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = IPUtils.getClientIP(req);
    const accessLevel = req.user?.role ? getAccessLevelFromRole(req.user.role) : undefined;
    
    // Log the violation
    RateLimitUtils.logRateLimitViolation(req, rateLimitType, clientIP, accessLevel);
    
    // Create rate limit error
    const config = RateLimitConfigFactory.getConfigByAccessLevel(accessLevel || AccessLevel.USER);
    const rateLimitError = RateLimitUtils.createRateLimitError(
      rateLimitType,
      config.windowMs,
      0, // No remaining requests
      accessLevel
    );
    
    // Add rate limit headers
    const headers = rateLimitError.getHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    // Return 429 error response
    res.status(429).json(rateLimitError.toJSON());
  };
}

// Helper function to get access level from user role
function getAccessLevelFromRole(role: string): AccessLevel {
  const roleMap: Record<string, AccessLevel> = {
    'admin': AccessLevel.ADMIN,
    'supervisor': AccessLevel.SUPERVISOR,
    'user': AccessLevel.USER,
    'finaluser': AccessLevel.USER,
  };
  
  return roleMap[role.toLowerCase()] || AccessLevel.USER;
}

// Create rate limiter with custom configuration
function createRateLimiter(config: any, rateLimitType: RateLimitType): RequestHandler {
  return rateLimit({
    ...config,
    handler: createRateLimitHandler(rateLimitType),
    keyGenerator: (req: Request) => {
      return RateLimitUtils.getRateLimitKey(req, rateLimitType, getAccessLevelFromRole(req.user?.role || 'user'));
    },
    skip: (req: Request) => {
      // Skip rate limiting for trusted sources
      if (RateLimitUtils.isTrustedSource(req)) {
        return true;
      }
      
      // Skip based on rate limit type
      return !RateLimitUtils.shouldApplyRateLimit(req, rateLimitType);
    },
    onLimitReached: (req: Request, res: Response) => {
      const clientIP = IPUtils.getClientIP(req);
      const accessLevel = req.user?.role ? getAccessLevelFromRole(req.user.role) : undefined;
      
      // Log when limit is reached
      RateLimitUtils.logRateLimitViolation(req, rateLimitType, clientIP, accessLevel);
    },
  });
}

// Create user-specific rate limiter based on access level
function createUserRateLimiter(accessLevel: AccessLevel): RequestHandler {
  const config = RateLimitConfigFactory.getConfigByAccessLevel(accessLevel);
  const rateLimitType = accessLevel === AccessLevel.ADMIN ? RateLimitType.ADMIN : 
                       accessLevel === AccessLevel.SUPERVISOR ? RateLimitType.SUPERVISOR : 
                       RateLimitType.USER;
  
  return createRateLimiter(config, rateLimitType);
}

// Rate Limit Aspect - Main middleware factory
export const RateLimitAspect: RateLimitMiddleware = {
  // Global rate limiting (IP-based)
  globalLimiter: createRateLimiter(
    RateLimitConfigFactory.getGlobalConfig(),
    RateLimitType.GLOBAL
  ),

  // Login rate limiting (stricter)
  loginLimiter: createRateLimiter(
    RateLimitConfigFactory.getLoginConfig(),
    RateLimitType.LOGIN
  ),

  // Signup rate limiting (very strict)
  signUpLimiter: createRateLimiter(
    RateLimitConfigFactory.getSignUpConfig(),
    RateLimitType.SIGNUP
  ),

  // API rate limiting (general endpoints)
  apiLimiter: createRateLimiter(
    RateLimitConfigFactory.getApiConfig(),
    RateLimitType.API
  ),

  // User-specific rate limiting
  userLimiter: createUserRateLimiter(AccessLevel.USER),

  // Supervisor-specific rate limiting
  supervisorLimiter: createUserRateLimiter(AccessLevel.SUPERVISOR),

  // Admin rate limiting (higher limits)
  adminLimiter: createUserRateLimiter(AccessLevel.ADMIN),

  // Create user limiter by access level
  createUserLimiter: (accessLevel: AccessLevel): RequestHandler => {
    return createUserRateLimiter(accessLevel);
  },

  // Create custom rate limiter
  createCustomLimiter: (config: any): RequestHandler => {
    return createRateLimiter(config, RateLimitType.GLOBAL);
  },
};

// Middleware to add rate limit headers to all responses
export const addRateLimitHeadersMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  // Store original send method
  const originalSend = res.send;
  
  // Override send method to add headers
  res.send = function(body: any) {
    // Add rate limit headers if they exist in the response
    const rateLimitInfo = HeaderUtils.extractRateLimitInfo(res.getHeaders() as Record<string, string>);
    
    if (rateLimitInfo.limit !== undefined) {
      HeaderUtils.addRateLimitHeaders(
        res,
        rateLimitInfo.limit,
        rateLimitInfo.remaining || 0,
        rateLimitInfo.reset || Date.now() + 60000,
        rateLimitInfo.retryAfter
      );
    }
    
    // Call original send method
    return originalSend.call(this, body);
  };
  
  next();
};

// Middleware to handle rate limit errors globally
export const rateLimitErrorHandler: RequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Check if this is a rate limit error
  if (err.status === 429 || err.code === 429) {
    const clientIP = IPUtils.getClientIP(req);
    const accessLevel = req.user?.role ? getAccessLevelFromRole(req.user.role) : undefined;
    
    // Create proper rate limit error
    const rateLimitError = RateLimitUtils.createRateLimitError(
      RateLimitType.GLOBAL,
      60000, // Default window
      0,
      accessLevel
    );
    
    // Add headers
    const headers = rateLimitError.getHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    // Return 429 response
    return res.status(429).json(rateLimitError.toJSON());
  }
  
  // Pass to next error handler
  next(err);
};

// Export individual middleware for specific use cases
export const {
  globalLimiter,
  loginLimiter,
  signUpLimiter,
  apiLimiter,
  userLimiter,
  supervisorLimiter,
  adminLimiter,
  createUserLimiter,
  createCustomLimiter,
} = RateLimitAspect;
