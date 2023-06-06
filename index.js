import express from "express";
import dotenv from "dotenv";
import "./database/connectdb.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on Port:" + PORT));