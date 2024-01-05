const mongoose = require("mongoose");
const { backend } = require("./envvars");

const dbConnection = async () => {
  try {
    await mongoose.connect(backend, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      console.log("Connected to the Remote Dataset");
    });
  } catch (error) {
    console.log("Database connection error: " + error.message);
    process.exit(1);
  }
};

const setCorsEnviro = async (req, res, next) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }
    next();
  } catch (error) {
    console.log("CORS error: " + error.message);
    process.exit(1);
  }
};
module.exports = { dbConnection, setCorsEnviro };
