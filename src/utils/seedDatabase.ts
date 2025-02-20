import mongoose from "mongoose";
import { mode, dataseeddev, dataseedprod } from "../config/envvars";
import seedRoles from "./seedRoles";
import seedUsers from "./seedUsers";
import todoUsers from "./seedTodos";

/*
modules related to datasseeding just require integration testing
*/

async function seedDatabase() {
  const shouldSeedDatabase = dataseeddev === "true" || dataseedprod === "true";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (shouldSeedDatabase) {
      console.log(`Seeding the database in ${mode} environment...`);
      await seedRoles(session);
      await seedUsers(session);
      await todoUsers(session);
      await session.commitTransaction();
    } else {
      console.log("No seeding required");
    }
  } catch (error: unknown) {
    await session.abortTransaction();
    if (error instanceof Error) {
      console.error(
        "error in seeding database, impossible to continue: ",
        error.message
      );
    } else {
      console.error(
        "error in seeding database, impossible to continue: ",
        error
      );
    }
    process.exit(1);
  } finally {
    session.endSession();
  }
}

export default seedDatabase;
