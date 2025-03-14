import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import {
  AuthenticatedUserRequest,
  JwtActiveSession,
} from "../../types/user.types";
import User from "../../models/User";
import Role from "../../models/Role";
import { masterKey } from "../../config/envvars";
import { createApiError } from "../../utils/error/errorLog";

export function isAuthenticated(
  req: AuthenticatedUserRequest
): req is AuthenticatedUserRequest & { user: { sub: string; role: string } } {
  return req.user?.sub !== undefined;
}

const authorize = (domain?: string, requiredPermission?: number) => {
  return async (
    req: AuthenticatedUserRequest,
    res: Response,
    next: NextFunction
  ) => {
    console.log(`
      [AUTH DEBUG]
      Timestamp: ${new Date().toISOString()}
      Path: ${req.path}
      Method: ${req.method}
      Domain: ${domain}
      Required Permission: ${requiredPermission}
      Cookie Present: ${!!req.cookies?.nodetodo}
    `);

    const { cookies } = req;
    const token = cookies?.nodetodo;

    if (!token) {
      const error = createApiError(
        "NOT_AUTHORIZED",
        "No token found in request",
        "authorize module: Token verification routine",
        {
          path: req.path,
          method: req.method,
          domain: "RBAC: authorize middleware",
          requiredPermission: requiredPermission?.toString(),
          cookiePresent: !!req.cookies?.nodetodo,
        }
      );
      return res
        .status(error.code)
        .json({ code: error.code, resultMessage: error });
    }

    if (!masterKey) {
      const error = createApiError(
        500,
        "Master key not configured",
        "Environment variable MASTER_KEY is missing"
      );
      return res
        .status(error.code)
        .json({ code: error.code, resultMessage: error });
    }

    try {
      console.log(`
        [TOKEN DEBUG]
        Token: ${token.substring(0, 10)}...
        MasterKey Present: ${!!masterKey}
      `);

      const decoded = jwt.verify(token, masterKey) as
        | JwtActiveSession
        | undefined;

      console.log(`
          [DECODE DEBUG]
          Decoded: ${JSON.stringify(decoded, null, 2)}
          Has sub: ${!!decoded?.sub}
          Has role: ${!!decoded?.role}
          Has sessionId: ${!!decoded?.sessionId}
          Has version: ${!!decoded?.ver}
        `);

      if (!decoded || !decoded.sub || !decoded.role || !decoded.sessionId) {
        console.error(`
          [TOKEN VALIDATION FAILED]
          Timestamp: ${new Date().toISOString()}
          Missing Fields: ${!decoded?.sub ? "sub," : ""} ${
          !decoded?.role ? "role," : ""
        } ${!decoded?.sessionId ? "sessionId" : ""}
          Token Preview: ${token.substring(0, 10)}...
        `);

        const error = createApiError(401, "Invalid token structure");
        return res
          .status(error.code)
          .json({ code: error.code, resultMessage: error.resultMessage });
      }

      const user = await User.findById(decoded.sub).populate("role").exec();

      console.log(`
        [USER LOOKUP DEBUG]
        Searching for user ID: ${decoded.sub}
        User found: ${!!user}
        Role ID from token: ${decoded.role}
        `);

      if (!user) {
        console.error(`
          [USER LOOKUP FAILED]
          Timestamp: ${new Date().toISOString()}
          User ID attempted: ${decoded.sub}
          Token valid but user not found
        `);

        const error = createApiError(
          "NOT_AUTHORIZED",
          "Invalid authentication credentials"
        );
        return res
          .status(error.code)
          .json({ code: error.code, resultMessage: error.resultMessage });
      }

      // Set basic user info in request
      req.user = {
        sub: decoded.sub,
        role: decoded.role,
      };

      // If no domain/permission specified, only authenticate
      if (!domain || !requiredPermission) {
        return next();
      }

      // Fetch user's role with permissions
      const userRole = await Role.findById(decoded.role).exec();

      console.log(`
          [PERMISSION DEBUG]
          Domain: ${domain}
          Required Permission: ${requiredPermission}
          Role Found: ${!!userRole}
          Role Permissions: ${userRole?.permissions?.get(domain)}
        `);

      if (!userRole) {
        const error = createApiError(
          "NOT_AUTHORIZED",
          "Invalid authentication credentials"
        );
        return res.status(error.code).json(error);
      }

      const domainPermissions = userRole.permissions.get(domain) ?? 0;

      if ((domainPermissions & requiredPermission) !== requiredPermission) {
        const error = createApiError(
          "FORBIDDEN",
          `Insufficient permissions`,
          `User ${user._id} lacks permission ${requiredPermission} for domain ${domain}. Current permissions: ${domainPermissions}`
        );
        return res
          .status(error.code)
          .json({ code: error.code, resultMessage: error.resultMessage });
      }

      next();
    } catch (error: unknown) {
      const apiError = createApiError(
        "NOT_AUTHORIZED",
        "Authentication failed",
        error instanceof Error ? error.message : String(error)
      );
      console.error(`
        [ERROR DEBUG]
        Error Type: ${
          error instanceof Error ? error.constructor.name : "Unknown"
        }
        Message: ${error instanceof Error ? error.message : String(error)}
      `);
      return res
        .status(apiError.code)
        .json({ code: apiError.code, resultMessage: apiError });
    }
  };
};

export default authorize;
