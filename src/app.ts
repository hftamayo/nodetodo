import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection, setCorsEnviro } from "./config/setup";
import { port, mode } from "./config/envvars";

import seedDatabase from "./utils/seedDatabase";
import todosRoutes from "./api/routes/todo";
import usersRoutes from "./api/routes/user";
import healthCheckRoutes from "./api/routes/hc";

const app = express();

const PORT = port || 5001;

async function startApp() {
  try {
    await dbConnection();
    app.use(cors(setCorsEnviro)); //cors middleware

    app.use(express.json());
    app.use(express.urlencoded({ extended: true })); //cuando false?
    app.use(cookieParser()); //parsea cookie headers y populate req.cookies

    //I live this method in case of request monitoring
    app.use((req: Request, res: Response, next: NextFunction) => {
      console.log("Request received: ", req.method, req.url);
      console.log("Request headers: ", req.headers);
      next();
    });

    await seedDatabase();

    app.use("/nodetodo/todos", todosRoutes);
    app.use("/nodetodo/users", usersRoutes);
    app.use("/nodetodo/healthcheck", healthCheckRoutes);

    // Error handling middleware
    app.use((error: any, res: Response) => {
      console.error("Error middleware: ", error.message);
      console.error("Error details: ", error.stack);
      res.status(500).send("An unexpected error occurred");
    });

    console.log(`the backend is ready in ${mode} environment`);
    const server = app.listen(port, () => {
      console.log(`The server instance is running on port ${PORT}`);
    });
    return server;
  } catch (error: any) {
    console.error("the backend is down: ", error.message);
    process.exit(1);
  }
}

export { app, startApp };
