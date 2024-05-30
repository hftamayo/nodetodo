import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { masterKey } from "../../config/envvars";
import { JwtPayloadWithUserId } from "../../types/user.interface";

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

    req.body.userId = decoded.searchUser;

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
