require("dotenv").config();

const isDev = process.env.NODE_ENV === "development";

const rateLimit = require("express-rate-limit");

const signUpLimiter = rateLimit({
  windowMs: isDev ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
  max: isDev ? 10000 : 3,
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

const loginLimiter = rateLimit({
  windowMs: isDev ? 24 * 60 * 60 * 1000 : 15 * 60 * 1000,
  max: isDev ? 10000 : 5,
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
});

module.exports = { signUpLimiter, loginLimiter };
