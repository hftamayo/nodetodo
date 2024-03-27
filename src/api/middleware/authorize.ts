import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { masterKey } from "../../config/envvars";

interface User {
  id: string;
  email: string;
}

interface RequestWithUser extends Request {
  user: User;
}

const authorize = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ resultMessage: "Not authorized, please login first" });
  }
  try {
    const decoded = jwt.verify(token, masterKey) as { searchUser: User };
    req.user = decoded.searchUser;
    next();
  } catch (error: unknown) {
    if (error instanceof Error){
      console.error(error.message);
      res.status(401).json({ resultMessage: "Not authorized, please login first" });
    
    } else {
      console.error(error);
      res.status(500).json({ resultMessage: "Internal Server Error" });
    
    }
  }
};

module.exports = authorize;
