import mongoose from "mongoose";

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connection established with Data Repository: Remote");
} catch (error) {
  console.log(
    "Couldn't established connection with Data Repository, details: " + error
  );
}