const { mode, dataseeddev, dataseedprod } = require("../config/envvars");

const seedUsers = require("./seedUsers");

async function seedDatabase() {
  try {
    if (mode === "development" || dataseeddev === "true") {
      console.log("Seeding the database in development environment...");
      await seedUsers();
    } else if (mode === "production" || dataseedprod === "true") {
      console.log("Seeding the database in production environment...");
      await seedUsers();
    } else {
      console.log("No seeding required");
    }
  } catch (error) {
    console.error(
      "error in seeding database, impossible to continue: ",
      error.message
    );
    process.exit(1);
  }
}

module.exports = seedDatabase;
