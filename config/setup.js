const mongoose = require("mongoose");
const { backend } = require("./envvars");

const dbConnection = async () => {
  mongoose
    .connect(backend)
    .then(() => console.log("Connected to the Remote Dataset"))
    .catch((error) =>
      console.log(
        "Couldn't established communication with Remote Dataset" + error.message
      )
    );
};

const setCorsEnviro = async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
};

module.exports = { dbConnection, setCorsEnviro };
