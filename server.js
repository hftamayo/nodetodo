import http from "http";
import app from "./app.js";
import { port } from "./config/envvars.js";

const PORT = port || 5001;

const server = http.createServer(app);

server.listen(PORT, () => console.log("Server running on Port: " + PORT));
