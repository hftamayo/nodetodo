import { Request, Response, NextFunction } from "express";
import { validationResult, Result, ValidationError } from "express-validator";

const validateResult = (req: Request, res: Response, next: NextFunction) => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }
  next();
};

export default validateResult;
