import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import {
  AuthenticatedUserRequest,
  JwtPayloadWithUserId,
} from "../../types/user.types";
import User from "../../models/User";
import Role from "../../models/Role";
import { masterKey } from "../../config/envvars";
import { createApiError } from "../../utils/error/errorLog";

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

    if (!token) {
      const error = createApiError(
        "NOT_AUTHORIZED",
        "No token found in request"
      );
      return res
        .status(error.code)
        .json({ code: error.code, resultMessage: error.resultMessage });
    }

    if (!masterKey) {
      const error = createApiError(
        "INTERNAL_ERROR",
        "Master key not found in environment variables"
      );
      return res
        .status(error.code)
        .json({ code: error.code, resultMessage: error.resultMessage });
    }

    try {
      const decoded = jwt.verify(token, masterKey) as
        | JwtPayloadWithUserId
        | undefined;

      if (!decoded) {
        const error = createApiError(
          "NOT_AUTHORIZED",
          "Token verification failed"
        );
        return res
          .status(error.code)
          .json({ code: error.code, resultMessage: error.resultMessage });
      }

      const user = await User.findById(decoded.searchUser)
        .populate("role")
        .exec();

      if (!user) {
        const error = createApiError(
          "NOT_AUTHORIZED",
          "User not found",
          `ID: ${decoded.searchUser}`
        );
        return res
          .status(error.code)
          .json({ code: error.code, resultMessage: error.resultMessage });
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
        const error = createApiError(
          "NOT_AUTHORIZED",
          "Role not found",
          `User ID: ${user._id}`
        );

        return res
          .status(error.code)
          .json({ code: error.code, resultMessage: error.resultMessage });
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
