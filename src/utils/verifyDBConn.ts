import mongoose from "mongoose";

async function verifyDBConn() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    collections.map((collection) => {
      console.log("found collection %s", collection.name);
    });
    console.log("Connection established with Data Repository: Remote");
  } catch (error) {
    console.log(
      "Couldn't established connection with Data Repository, details: " + error
    );
  }
}

export default verifyDBConn;
