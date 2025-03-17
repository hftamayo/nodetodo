import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import {
  AuthenticatedUserRequest,
  JwtActiveSession,
} from "../../types/user.types";
import User from "../../models/User";
import Role from "../../models/Role";
import { masterKey } from "../../config/envvars";
import { createLog, createApiError } from "../../utils/error/eventLog";

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
    createLog("debug", "AUTH", "Authorization check started", {
      path: req.path,
      method: req.method,
      domain: domain?.toString(),
      requiredPermission: requiredPermission?.toString(),
      cookiePresent: !!req.cookies?.nodetodo,
    });

    const { cookies } = req;
    const token = cookies?.nodetodo;

    if (!token) {
      const error = createApiError(
        "NOT_AUTHORIZED",
        "malformed request",
        "authorize module, Token verification routine: no token found",
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
        "NOT_AUTHORIZED",
        "malformed request",
        "authorize module: masterKey stage: no masterKey present",
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

    try {
      createLog("debug", "TOKEN", "Token verification started", {
        path: req.path,
        method: req.method,
        domain: "RBAC",
        cookiePresent: true,
      });

      const decoded = jwt.verify(token, masterKey) as
        | JwtActiveSession
        | undefined;

      createLog("debug", "DECODE", "Token decoded successfully", {
        path: req.path,
        method: req.method,
        domain: "RBAC",
        cookiePresent: true,
      });

      if (!decoded || !decoded.sub || !decoded.role || !decoded.sessionId) {
        createLog("error", "TOKEN", "Token validation failed", {
          path: req.path,
          method: req.method,
          domain: "RBAC",
          cookiePresent: true,
        });

        const error = createApiError(
          "NOT_AUTHORIZED",
          "malformed request",
          "authorize module: decoded stage: missing fields",
          {
            path: req.path,
            method: req.method,
            domain: "RBAC: authorize middleware",
            cookiePresent: !!req.cookies?.nodetodo,
          }
        );
        return res
          .status(error.code)
          .json({ code: error.code, resultMessage: error.resultMessage });
      }

      const user = await User.findById(decoded.sub).populate("role").exec();

      createLog("debug", "USER", "User lookup completed", {
        path: req.path,
        method: req.method,
        domain: "RBAC",
        cookiePresent: true,
      });

      if (!user) {
        createLog("error", "USER", "User not found", {
          path: req.path,
          method: req.method,
          domain: "RBAC",
          cookiePresent: true,
        });

        const error = createApiError(
          "NOT_AUTHORIZED",
          "invalid request",
          "authorize module: userVerif stage: no user found",
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

      createLog("debug", "PERMISSION", "Permission check", {
        path: req.path,
        method: req.method,
        domain: domain?.toString(),
        requiredPermission: requiredPermission?.toString(),
        cookiePresent: true,
      });

      if (!userRole) {
        const error = createApiError(
          "NOT_AUTHORIZED",
          "insuficcients permissions",
          "authorize module: rolesVerif stage: no role found",
          {
            path: req.path,
            method: req.method,
            domain: "RBAC: authorize middleware",
            requiredPermission: requiredPermission?.toString(),
            cookiePresent: !!req.cookies?.nodetodo,
          }
        );
        return res.status(error.code).json(error);
      }

      const domainPermissions = userRole.permissions.get(domain) ?? 0;

      if ((domainPermissions & requiredPermission) !== requiredPermission) {
        const error = createApiError(
          "NOT_AUTHORIZED",
          "insufficient permissions",
          "authorize module: permission verif stage: insufficient permissions",
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
          .json({ code: error.code, resultMessage: error.resultMessage });
      }

      next();
    } catch (error: unknown) {
      const apiError = createApiError(
        "NOT_AUTHORIZED",
        "Authentication verif failed",
        "authorize module: Catch block: session is not valid",
        {
          path: req.path,
          method: req.method,
          domain: "RBAC: authorize middleware",
          requiredPermission: requiredPermission?.toString(),
          cookiePresent: !!req.cookies?.nodetodo,
        }
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
