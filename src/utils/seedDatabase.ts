import { mode, dataseeddev, dataseedprod } from "../config/envvars";
import seedRoles from "./seedRoles";
import seedUsers from "./seedUsers";
import todoUsers from "./seedTodos";

/*
modules related to datasseeding just require integration testing
*/

async function seedDatabase() {
  const shouldSeedDatabase = dataseeddev === "true" || dataseedprod === "true";

  try {
    if (shouldSeedDatabase) {
      console.log(`Seeding the database in ${mode} environment...`);
      await seedRoles();
      await seedUsers();
      await todoUsers();
    } else {
      console.log("No seeding required");
    }
  } catch (error: unknown) {
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
  }
}

export default seedDatabase;
