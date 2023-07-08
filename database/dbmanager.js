import mongoose from "mongoose";
import { backend } from "../config/envvars.js";

const dbConnection = () => {
  mongoose
    .connect(backend)
    .then(() => console.log("Connected to the Remote Dataset"))
    .catch((error) =>
      console.log(
        "Couldn't established communication with Remote Dataset" + error.message
      )
    );
};

export default dbConnection;
