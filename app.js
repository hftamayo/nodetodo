import express from "express";
import cookieParser from "cookie-parser";

import todosRoutes from ".api/routes/todo.js";
import usersRoutes from ".api/routes/user.js";
import dbConnection from "./database/dbmanager.js";

const app = express();

dbConnection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/nodetodo/todos", todosRoutes);
app.use("/nodetodo/users", usersRoutes);

console.log("Application up and running");

module.exports = app;
