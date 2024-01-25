const User = require("../src/models/User");

async function seedUsers() {
  const users = [
    {
      name: "Administrator",
      email: "administrator@nodetodo.com",
      password: "password",
      age: 30,
      role: "admin",
    },
    {
        name: "Sebastian Fernandez",
        email: "sebas@gmail.com",
        password: "password",
        age: 20,
        role: "supervisor",
      },    
      {
        name: "Lupita Martinez",
        email: "lupita@fundamuvi.com",
        password: "password",
        age: 25,
        role: "user",        
      }
  ];

    try {
        await User.deleteMany({});
        const usersCreated = await User.create(users);
        console.log("Users created: ", usersCreated);
    } catch (error) {
        console.error("seedUsers: ", error.message);
    }
}
