import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnection = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to the Remote Dataset"))
    .catch((error) =>
      console.log(
        "Couldn't established communication with Remote Dataset" + error.message
      )
    );
};

export default dbConnection;
