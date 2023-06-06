import express from "express";
import dotenv from "dotenv";
import dbConnection from "./database/dbmanager.js";

const app = express();
dotenv.config();

dbConnection();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on Port:" + PORT));