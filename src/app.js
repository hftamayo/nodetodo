const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { dbConnection, setCorsEnviro } = require("./config/setup");
const { port } = require("./config/envvars");

const seedDatabase = require("./utils/seedDatabase");
const todosRoutes = require("./api/routes/todo");
const usersRoutes = require("./api/routes/user");
const healthCheckRoutes = require("./api/routes/healthCheck");

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
    app.use((req, res, next) => {
      console.log("Request received: ", req.method, req.url);
      console.log("Request headers: ", req.headers);
      next();
    });

    await seedDatabase();

    app.use("/nodetodo/todos", todosRoutes);
    app.use("/nodetodo/users", usersRoutes);
    app.use("/nodetodo/healthcheck", healthCheckRoutes);

    // Error handling middleware
    app.use((error, req, res, next) => {
      console.error("Error middleware: ", error.message);
      console.error("Error details: ", error.stack);
      res.status(500).send("An unexpected error occurred");
    });

    console.log("the backend is ready");
    const server = app.listen(port, () => {
      console.log(`The server instance is running on port ${PORT}`);
    });
    return server;
  } catch (error) {
    console.error("the backend is down: ", error.message);
    process.exit(1);
  }
}

module.exports = { app, startApp };
