import dotenv from "dotenv";

const http = require("http");
const app = require("./app");

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => console.log("Server running on Port: " + PORT));
