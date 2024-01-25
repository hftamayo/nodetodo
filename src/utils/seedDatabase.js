const {seedUsers} = require("./seedUsers");
const { mod, dataseeddev, dataseedprod } = require("./config/envvars");

async function seedDatabase() {
    try{
        if (mod === "developer" || dataseeddev === "true") {
            console.log("Seeding the database in development environment...");
            await seedUsers();
          } else if (mod === "production" || dataseedprod === "true") {
            console.log("Seeding the database in production environment...");
            await seedUsers();
          }
    }catch(error){
        console.error("error in seeding database, impossible to continue: ", error.message);
        process.exit(1);
    }
}

module.exports = seedDatabase;