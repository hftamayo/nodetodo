import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import {
  AuthenticatedUserRequest,
  JwtPayloadWithUserId,
} from "../../types/user.types";
import User from "../../models/User";
import Role from "../../models/Role";
import { masterKey } from "../../config/envvars";

const authorize = (domain: string, requiredPermission: number) => {
  return async (
    req: AuthenticatedUserRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { cookies } = req;
    const token = cookies?.nodetodo;

    if (!token) {
      return res
        .status(401)
        .json({ code: 401, resultMessage: "NOT_AUTHORIZED" });
    }
    if (!masterKey) {
      return res
        .status(500)
        .json({ code: 500, resultMessage: "INTERNAL_ERROR" });
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

      const userRole = await Role.findById(user.role._id).exec();
      if (!userRole) {
        return res
          .status(401)
          .json({ code: 401, resultMessage: "NOT_AUTHORIZED" });
      }

      const domainPermissions = userRole.permissions.get(domain) ?? 0;
      if ((domainPermissions & requiredPermission) === requiredPermission) {
        // Store user info in request for later use
        req.user = {
          id: decoded.userId,
          role: decoded.role,
        };
        return next();
      }

      console.log("User does not have required permissions to access");
      return res.status(403).json({ code: 403, resultMessage: "FORBIDDEN" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(401).json({ code: 401, resultMessage: "NOT_AUTHORIZED" });
      } else {
        console.error(error);
        res.status(500).json({ code: 500, resultMessage: "INTERNAL_ERROR" });
      }
    }
  };
};

export default authorize;
