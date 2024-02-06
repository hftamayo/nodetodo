const rateLimit = require("express-rate-limit");

const signUpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message:
      "Too many login attempts from this IP, please try again after 15 minutes",
});

module.exports = { signUpLimiter, loginLimiter };