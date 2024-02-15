const express = require("express");
const cookieParser = require("cookie-parser");
const { dbConnection, setCorsEnviro } = require("./config/setup");
const { port } = require("./config/envvars");

const  seedDatabase  = require("./utils/seedDatabase");
const todosRoutes = require("./api/routes/todo");
const usersRoutes = require("./api/routes/user");
const healthCheckRoutes = require("./api/routes/healthCheck");

const app = express();

const PORT = port || 5001;

async function startApp() {
  try {
    await dbConnection();
    setCorsEnviro(app);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true })); //cuando false?
    app.use(cookieParser()); //parsea cookie headers y populate req.cookies

    await seedDatabase();

    app.use("/nodetodo/todos", todosRoutes);
    app.use("/nodetodo/users", usersRoutes);
    app.use("/nodetodo/healthcheck", healthCheckRoutes);

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
