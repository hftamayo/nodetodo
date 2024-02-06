const User = require("../models/User");

const seedUsers = async function () {
  const users = [
    {
      _id: new mongoose.Types.ObjectId("5f7f8b1e9f3f9c1d6c1e4d1e"),
      name: "Administrator",
      email: "administrator@nodetodo.com",
      password: "password",
      age: 30,
      role: "admin",
    },
    {
      _id: new mongoose.Types.ObjectId("5f7f8b1e9f3f9c1d6c1e4d1f"),
      name: "Sebastian Fernandez",
      email: "sebas@gmail.com",
      password: "password",
      age: 20,
      role: "supervisor",
    },
    {
      _id: new mongoose.Types.ObjectId("5f7f8b1e9f3f9c1d6c1e4d20"),
      name: "Lupita Martinez",
      email: "lupita@fundamuvi.com",
      password: "password",
      age: 25,
      role: "user",
    },
  ];

  try {
    await User.deleteMany({});
    const usersCreated = await User.create(users);
    console.log("Users created: ", usersCreated);
  } catch (error) {
    console.error("seedUsers: ", error.message);
  }
};

module.exports = seedUsers;
