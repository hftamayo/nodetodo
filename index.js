import express from "express";
import dotenv from "dotenv";
import dbConnection from "./database/dbmanager.js";
import cookieParser from "cookie-parser";

import todosRoutes from "./routes/todo.js";
import usersRoutes from "./routes/user.js";

const app = express();
dotenv.config();

dbConnection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/todos", todosRoutes);
app.use("/api/users", usersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on Port:" + PORT));
