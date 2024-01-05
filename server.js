const http = require("http");
const app = require("./app");
const { port } = require("./config/envvars");

const PORT = port || 5001;

const server = http.createServer(app);

server.listen(PORT, () => console.log("Server running on Port: " + PORT));

module.exports = server;