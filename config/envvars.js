const dotenv = require("dotenv");

dotenv.config();

const port = parseInt(process.env.PORT);
const masterKey = process.env.JWT_SECRET;
const refreshKey = process.env.JWT_FRESH;
const mode = process.env.EXEC_MODE;

const backend =
  mode === "production"
    ? process.env.MONGODB_URI_PROD
    : process.env.MONGODB_URI_DEV;

module.exports = { port, masterKey, refreshKey, backend };
