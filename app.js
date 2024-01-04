const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { dbConnection, setCorsEnviro } = require("./config/setup");

const todosRoutes = require("./api/routes/todo");
const usersRoutes = require("./api/routes/user");

const app = express();

async function startApp() {
  try {
    await dbConnection();
    app.use(setCorsEnviro);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true })); //cuando false?
    app.use(cookieParser()); //parsea cookie headers y populate req.cookies
    app.use(bodyParser.json());

    app.use("/nodetodo/todos", todosRoutes);
    app.use("/nodetodo/users", usersRoutes);

    console.log("Application up and running");
  } catch (error) {
    console.error("Connection to the data layer failed: ", error.message);
    process.exit(1);
  }
}

startApp();

module.exports = app;
