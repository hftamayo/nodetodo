import { Response, NextFunction } from "express";
import { AuthenticatedUserRequest } from "../../types/user.types";

export function isAuthenticated(
  req: AuthenticatedUserRequest
): req is AuthenticatedUserRequest & { user: { id: string; role: string } } {
  return req.user?.id !== undefined;
}

const validateAuthentication = (
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ code: 401, resultMessage: "NOT_AUTHORIZED" });
  }
  next();
};

export default validateAuthentication;
