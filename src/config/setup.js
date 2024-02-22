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

const setCorsEnviro = {
  origin: (origin, callback) => {
    if (whitelist_frontend.indexOf(origin) !== -1 || !origin) {
      console.log(`CORS requested from origin: ${origin} granted`);
      callback(null, true);
    } else {
      callback(new Error(`CORS requested from origin: ${origin} denied`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Credential",
    "Origin",
    "withCredentials",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-HTTP-Method-Override",
    "Set-Cookie",
    "Cookie",
    "Request",
  ],
};
module.exports = { dbConnection, setCorsEnviro };
