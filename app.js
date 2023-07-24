import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { dbConnection, setCorsEnviro} from "./config/setup.js";

import todosRoutes from "./api/routes/todo.js";
import usersRoutes from "./api/routes/user.js";


const app = express();

dbConnection();
app.use(setCorsEnviro);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //cuando false?
app.use(cookieParser()); //parsea cookie headers y populate req.cookies
app.use(bodyParse.json());

app.use("/nodetodo/todos", todosRoutes);
app.use("/nodetodo/users", usersRoutes);

console.log("Application up and running");

export default app;