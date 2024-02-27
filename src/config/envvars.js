const dotenv = require("dotenv");

dotenv.config();

const port = parseInt(process.env.PORT);
const masterKey = process.env.JWT_SECRET;
const refreshKey = process.env.JWT_FRESH;
const mode = process.env.EXEC_MODE;

const whitelist_frontend = process.env.FRONTEND_ORIGINS.split(",");
const cors_secure = process.env.CORS_SECURE;
const cors_samesite= process.env.CORS_SAMESITE;

const backend =
  mode === "production"
    ? process.env.MONGODB_URI_PROD
    : process.env.MONGODB_URI_DEV;

const dataseeddev = process.env.SEED_DEVELOPER;
const dataseedprod = process.env.SEED_PRODUCTION;

module.exports = {
  port,
  masterKey,
  refreshKey,
  backend,
  whitelist_frontend,
  cors_secure,
  cors_samesite,
  dataseeddev,
  dataseedprod,
};
