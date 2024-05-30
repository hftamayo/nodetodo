import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { masterKey } from "../../config/envvars";
import {
  JwtPayloadWithUserId,
} from "../../types/user.interface";

const authorize = (req: Request, res: Response, next: NextFunction) => {
  const { cookies } = req;
  const token = cookies?.nodetodo;

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

    const userId = req.body.userId || req.query.userId;

    if (userId !== decoded.userId) {
      return res.status(401).json({
        resultMessage: "Not authorized to access this resource",
      });
    }
    req.body.userId = decoded.userId;
    
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
