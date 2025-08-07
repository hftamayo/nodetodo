import dotenv from "dotenv";

dotenv.config();

const port = parseInt(process.env.PORT ?? "8003");
if (isNaN(port)) {
  throw new Error("Invalid PORT enviroment variable, stopping the system");
}

const masterKey = process.env.JWT_SECRET;
const refreshKey = process.env.JWT_FRESH;
const mode = process.env.EXEC_MODE;

const whitelist_frontend = (process.env.FRONTEND_ORIGINS ?? "").split(",");
const cors_secure = mode === "production";
const cors_samesite = mode === "production" ? "none" : "lax";

const backend =
  mode === "production"
    ? process.env.MONGODB_URI_PROD
    : process.env.MONGODB_URI_DEV;

const dataseeddev = process.env.SEED_DEVELOPER;
const dataseedprod = process.env.SEED_PRODUCTION;

const adminpword = process.env.ADMIN_PWORD;
const supervisorpword = process.env.SUPERVISOR_PWORD;
const userpword = process.env.USER1_PWORD;

const rateLimitCapacity = process.env.RATE_LIMIT_CAPACITY;
const rateLimitRefillRate = process.env.RATE_LIMIT_REFILL_RATE;
const rateLimitRefillDuration = process.env.RATE_LIMIT_REFILL_DURATION;
const rateLimitWindow = process.env.RATE_LIMIT_WINDOW_MS;

const rateLimitLoginCapacity = process.env.RATE_LIMIT_LOGIN_CAPACITY;
const rateLimitSignUpCapacity = process.env.RATE_LIMIT_SIGNUP_CAPACITY;
const rateLimitApiCapacity =
  process.env.RATE_LIMIT_API_CAPACITY;

export {
  port,
  masterKey,
  refreshKey,
  mode,
  backend,
  whitelist_frontend,
  cors_secure,
  cors_samesite,
  dataseeddev,
  dataseedprod,
  adminpword,
  supervisorpword,
  userpword,
};

export const PERMISSIONS = {
  NONE: 0,
  READ: 1,
  WRITE: 2,
  UPDATE: 4,
  DELETE: 8,
  ALL: 15,
};

export const SYSTEM_PERMISSIONS = {
  LOGOUT: 1,
};

export const DOMAINS = {
  USER: "user",
  ROLE: "role",
  TODO: "todo",
  SYSTEM: "system",
};

export const RATE_LIMITS = {
  capacity: rateLimitCapacity,
  refillRate: rateLimitRefillRate,
  refillDuration: rateLimitRefillDuration,
  window: rateLimitWindow,
  loginCapacity: rateLimitLoginCapacity,
  signUpCapacity: rateLimitSignUpCapacity,
  apiCapacity: rateLimitApiCapacity,
};