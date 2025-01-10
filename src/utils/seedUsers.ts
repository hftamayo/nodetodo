import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User";
import { UserRole, UserSeed } from "../types/user.types";

const users: UserSeed[] = [
  {
    _id: new mongoose.Types.ObjectId("5f7f8b1e9f3f9c1d6c1e4d1e"),
    name: "Administrator",
    email: "administrator@nodetodo.com",
    password: "password",
    age: 30,
    role: UserRole.ADMIN,
  },
  {
    _id: new mongoose.Types.ObjectId("5f7f8b1e9f3f9c1d6c1e4d1f"),
    name: "Sebastian Fernandez",
    email: "sebas@gmail.com",
    password: "password",
    age: 20,
    role: UserRole.SUPERVISOR,
  },
  {
    _id: new mongoose.Types.ObjectId("5f7f8b1e9f3f9c1d6c1e4d20"),
    name: "Lupita Martinez",
    email: "lupita@fundamuvi.com",
    password: "password",
    age: 25,
    role: UserRole.USER,
  },
];

async function seedUsers() {
  try {
    await User.deleteMany({});
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash("password", salt);
      await User.create(user);
      console.log("User created: ", user);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("seedUsers: ", error.message);
    } else {
      console.error("seedUsers: ", error);
    }
  }
}

export default seedUsers;
