import dotenv from "dotenv";

dotenv.config();

export const port = parseInt(process.env.PORT);
export const masterKey = process.env.JWT_SECRET;
export const refreshKey = process.env.JWT_FRESH;
export const mode = process.env.EXEC_MODE;

export const backend =
  mode === "production"
    ? process.env.MONGODB_URI_PROD
    : process.env.MONGODB_URI_DEV;