const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const seedUsers = async function () {
  const users = [
    {
      _id: new mongoose.Types.ObjectId("5f7f8b1e9f3f9c1d6c1e4d1e"),
      name: "Administrator",
      email: "administrator@nodetodo.com",
      age: 30,
      role: "admin",
    },
    {
      _id: new mongoose.Types.ObjectId("5f7f8b1e9f3f9c1d6c1e4d1f"),
      name: "Sebastian Fernandez",
      email: "sebas@gmail.com",
      age: 20,
      role: "supervisor",
    },
    {
      _id: new mongoose.Types.ObjectId("5f7f8b1e9f3f9c1d6c1e4d20"),
      name: "Lupita Martinez",
      email: "lupita@fundamuvi.com",
      age: 25,
      role: "user",
    },
  ];

  try {
    await User.deleteMany({});
    for (const user of users){
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash("password", salt);
      await User.create(user);
      console.log("User created: ", user);
    }
  } catch (error) {
    console.error("seedUsers: ", error.message);
  }
};

module.exports = seedUsers;
