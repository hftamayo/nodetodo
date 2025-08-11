import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthenticatedUserRequest, JwtActiveSession } from "@/types/user.types";
import User from "@models/User";
import Role from "@models/Role";
import { masterKey } from "@config/envvars";

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
    // TODO: Integrate with global log service for authorization checks

    const { cookies } = req;
    const token = cookies?.nodetodo;

    if (!token) {
      // TODO: Log unauthorized access attempt
      return res
        .status(401)
        .json({ code: 401, resultMessage: "malformed request: no token found" });
    }

    if (!masterKey) {
      // TODO: Log missing masterKey error
      return res
        .status(401)
        .json({ code: 401, resultMessage: "malformed request: no masterKey present" });
    }

    try {
      // TODO: Log token verification started
      const decoded = jwt.verify(token, masterKey) as
        | JwtActiveSession
        | undefined;

      // TODO: Log token decoded successfully
      if (!decoded || !decoded.sub || !decoded.role || !decoded.sessionId) {
        // TODO: Log token validation failed
        return res
          .status(401)
          .json({ code: 401, resultMessage: "malformed request: missing fields in token" });
      }

      const user = await User.findById(decoded.sub).populate("role").exec();

      // TODO: Log user lookup completed
      if (!user) {
        // TODO: Log user not found
        return res
          .status(401)
          .json({ code: 401, resultMessage: "invalid request: user not found" });
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

      // TODO: Log permission check
      if (!userRole) {
        // TODO: Log role not found
        return res.status(401).json({ code: 401, resultMessage: "insufficient permissions: role not found" });
      }

      const domainPermissions = userRole.permissions.get(domain) ?? 0;

      if ((domainPermissions & requiredPermission) !== requiredPermission) {
        // TODO: Log insufficient permissions
        return res
          .status(401)
          .json({ code: 401, resultMessage: "insufficient permissions" });
      }

      next();
    } catch (error: unknown) {
      // TODO: Log authentication verification failed
      return res
        .status(401)
        .json({ code: 401, resultMessage: "authentication verification failed" });
    }
  };
};

export default authorize;
