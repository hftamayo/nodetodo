import mongoose from "mongoose";
import { backend, whitelist_frontend, mode } from "./envvars";

const dbConnection = async () => {
  try {
    if (!backend) throw new Error("Backend URL not found");

    await mongoose.connect(backend);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      console.log(`Connected to the Remote Dataset in ${mode} environment`);
    });
  } catch (error) {
    console.log("Database connection error: " + (error as Error).message);
    process.exit(1);
  }
};

const setCorsEnviro = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void
  ) => {
    console.log(`CORS requested from origin: ${origin}`);
    if (whitelist_frontend.indexOf(origin || "") !== -1 || !origin) {
      console.log(`CORS requested from origin: ${origin} granted`);
      callback(null, true);
    } else {
      callback(
        new Error(`CORS requested from origin: ${origin} denied`),
        false
      );
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Credentials",
    "Origin",
    "withCredentials",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-HTTP-Method-Override",
    "Set-Cookie",
    "Cookie",
    "Request",
  ],
};
export { dbConnection, setCorsEnviro };
