import mongoose from "mongoose";

try {
  await mongoose.connect(process.env.MONGODB_URI);
  mongoose.connection.on("open", function () {
    mongoose.connection.db.collectionNames(function (error, names) {
      if (error) {
        throw new Error(error);
      } else {
        names.map(function (name) {
          console.log("found collection %s", name);
        });
      }
    });
  });
  console.log("Connection established with Data Repository: Remote");
} catch (error) {
  console.log(
    "Couldn't established connection with Data Repository, details: " + error
  );
}
