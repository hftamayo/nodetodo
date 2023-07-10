import express from "express";
import cookieParser from "cookie-parser";
import { init } from "./config/setup.js";

import todosRoutes from "./api/routes/todo.js";
import usersRoutes from "./api/routes/user.js";


const app = express();

app.use(config.init);

// dbConnection();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //cuando false?
app.use(cookieParser()); //que hace esta lib

app.use("/nodetodo/todos", todosRoutes);
app.use("/nodetodo/users", usersRoutes);

console.log("Application up and running");

export default app;