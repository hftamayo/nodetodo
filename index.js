import express from "express";
import dotenv from "dotenv";
import dbConnection from "./database/dbmanager.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

dbConnection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on Port:" + PORT));
