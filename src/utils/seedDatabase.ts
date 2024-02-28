const { mode, dataseeddev, dataseedprod } = require("../config/envvars");

const seedUsers = require("./seedUsers");
const todoUsers = require("./seedTodos");

async function seedDatabase() {
  try {
    if (
      mode === "development" ||
      dataseeddev === "true" ||
      mode === "production" ||
      dataseedprod === "true"
    ) {
      console.log(`Seeding the database in ${mode} environment...`);
      await seedUsers();
      await todoUsers();
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
