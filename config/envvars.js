import dotenv from "dotenv";

dotenv.config();

export const port = parseInt(process.env.PORT);
export const backend = process.env.MONGODB_URI;
export const masterKey = process.env.JWT_SECRET;
export const refreshKey = process.env.JWT_FRESH;
export const mode = process.env.EXEC_MODE;
export const csjProxy = process.env.CSJ_PROXY;
