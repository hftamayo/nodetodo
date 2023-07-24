import express from "express";
import cookieParser from "cookie-parser";

import { dbConnection, setCorsEnviro} from "./config/setup.js";

import todosRoutes from "./api/routes/todo.js";
import usersRoutes from "./api/routes/user.js";


const app = express();

dbConnection();
app.use(setCorsEnviro);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //cuando false?
app.use(cookieParser()); //parsea cookie headers y populate req.cookies

app.use("/nodetodo/todos", todosRoutes);
app.use("/nodetodo/users", usersRoutes);

console.log("Application up and running");

export default app;