const cors = require("cors");
const mongoose = require("mongoose");
const { backend, whitelist_frontend } = require("./envvars");

const dbConnection = async () => {
  try {
    await mongoose.connect(backend, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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

const setCorsEnviro = (app) => {
  app.use(
    cors({
      origin: function (origin, callback) {
        if (whitelist_frontend.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );
};
module.exports = { dbConnection, setCorsEnviro };
