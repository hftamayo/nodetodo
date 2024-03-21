import { RequestHandler } from "express";
import { mode } from "../../config/envvars";
import rateLimit from "express-rate-limit";

const signUpLimiter: RequestHandler = rateLimit({
  //windowMs : 24 hours : 60 minutes
  windowMs: mode === "development" ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
  max: mode === "development" ? 10000 : 5,
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

const loginLimiter: RequestHandler = rateLimit({
  //windowMs : 24 hours : 15 minutes
  windowMs: mode === "development" ? 24 * 60 * 60 * 1000 : 15 * 60 * 1000,
  max: mode === "development" ? 10000 : 3,
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
});

export default { signUpLimiter, loginLimiter };
