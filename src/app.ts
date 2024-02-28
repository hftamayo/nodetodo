import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection, setCorsEnviro } from "./config/setup";
import { port } from "./config/envvars";

import seedDatabase from "./utils/seedDatabase";
import todosRoutes from "./api/routes/todo";
import usersRoutes from "./api/routes/user";
import healthCheckRoutes from "./api/routes/healthCheck";

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
    // app.use((req, res, next) => {
    //   console.log("Request received: ", req.method, req.url);
    //   console.log("Request headers: ", req.headers);
    //   next();
    // });

    await seedDatabase();

    app.use("/nodetodo/todos", todosRoutes);
    app.use("/nodetodo/users", usersRoutes);
    app.use("/nodetodo/healthcheck", healthCheckRoutes);

    console.log("the backend is ready");
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
