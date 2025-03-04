import { Response, NextFunction } from "express";
import { AuthenticatedUserRequest } from "../../types/user.types";

const validateAuthentication = (
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.id) {
    return res.status(401).json({ code: 401, resultMessage: "NOT_AUTHORIZED" });
  }
  next();
};

export default validateAuthentication;
