import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { masterKey } from "../../config/envvars";
import {
  ValidateActiveSession,
  JwtPayloadWithUserId,
} from "../../types/user.interface";

const authorize = (
  req: ValidateActiveSession,
  res: Response,
  next: NextFunction
) => {
  if (req.cookies === undefined) {
    return res
      .status(401)
      .json({ resultMessage: "Not authorized, please login first" });
  }

  const token = req.cookies.nodetodo;
  if (!token) {
    return res
      .status(401)
      .json({ resultMessage: "Not authorized, please login first" });
  }
  if (!masterKey) {
    return res.status(500).json({ resultMessage: "Internal Server Error" });
  }
  try {
    const decoded = jwt.verify(token, masterKey) as
      | JwtPayloadWithUserId
      | undefined;
    if (!decoded) {
      return res
        .status(401)
        .json({ resultMessage: "Not authorized, please login first" });
    }

    req.userId = decoded.searchUser;
    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      res
        .status(401)
        .json({ resultMessage: "Not authorized, please login first" });
    } else {
      console.error(error);
      res.status(500).json({ resultMessage: "Internal Server Error" });
    }
  }
};

export default authorize;
