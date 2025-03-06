import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import {
  AuthenticatedUserRequest,
  JwtPayloadWithUserId,
} from "../../types/user.types";
import User from "../../models/User";
import Role from "../../models/Role";
import { masterKey } from "../../config/envvars";

export function isAuthenticated(
  req: AuthenticatedUserRequest
): req is AuthenticatedUserRequest & { user: { id: string; role: string } } {
  return req.user?.id !== undefined;
}

const authorize = (domain?: string, requiredPermission?: number) => {
  return async (
    req: AuthenticatedUserRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { cookies } = req;
    const token = cookies?.nodetodo;

    if (!token || !masterKey) {
      return res
        .status(401)
        .json({ code: 401, resultMessage: "NOT_AUTHORIZED" });
    }

    try {
      const decoded = jwt.verify(token, masterKey) as
        | JwtPayloadWithUserId
        | undefined;

      if (!decoded) {
        return res
          .status(401)
          .json({ code: 401, resultMessage: "NOT_AUTHORIZED" });
      }

      const user = await User.findById(decoded.searchUser)
        .populate("role")
        .exec();

      if (!user) {
        return res
          .status(401)
          .json({ code: 401, resultMessage: "NOT_AUTHORIZED" });
      }

      // Set basic user info in request
      req.user = {
        id: decoded.userId,
        role: decoded.role,
      };

      // If no domain/permission specified, only authenticate
      if (!domain || !requiredPermission) {
        return next();
      }

      // Check permissions if domain and requiredPermission are provided
      const userRole = await Role.findById(user.role._id).exec();

      if (!userRole) {
        return res
          .status(401)
          .json({ code: 401, resultMessage: "NOT_AUTHORIZED" });
      }

      const domainPermissions = userRole.permissions.get(domain) ?? 0;

      if ((domainPermissions & requiredPermission) !== requiredPermission) {
        console.log("User does not have required permissions to access");
        return res.status(403).json({ code: 403, resultMessage: "FORBIDDEN" });
      }

      next();
    } catch (error: unknown) {
      console.error(
        "Auth middleware error:",
        error instanceof Error ? error.message : error
      );
      return res
        .status(401)
        .json({ code: 401, resultMessage: "NOT_AUTHORIZED" });
    }
  };
};

export default authorize;
