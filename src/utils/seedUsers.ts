import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User";
import Role from "../models/Role";
import { FullUser } from "../types/user.types";
import { adminpword, supervisorpword, userpword } from "../config/envvars";

if (!adminpword || !supervisorpword || !userpword) {
  throw new Error("No passwords found in the environment variables");
}

async function seedUsers(session: mongoose.ClientSession) {
  try {
    // Ensure roles are seeded first
    const adminRole = await Role.findOne({ name: "admin" }).exec();
    const supervisorRole = await Role.findOne({ name: "supervisor" }).exec();
    const userRole = await Role.findOne({ name: "user" }).exec();

    if (!adminRole || !supervisorRole || !userRole) {
      throw new Error("Roles not found in the database");
    }

    const users: Omit<FullUser, "_id">[] = [
      {
        name: "Administrator",
        email: "administrador@tamayo.com",
        password: adminpword!,
        age: 30,
        role: adminRole._id,
        status: true,
      },
      {
        name: "Sebastian Fernandez",
        email: "supervisor@tamayo.com",
        password: supervisorpword!,
        age: 20,
        role: supervisorRole._id,
        status: true,
      },
      {
        name: "Bob Doe",
        email: "bob@tamayo.com",
        password: userpword!,
        age: 25,
        role: userRole._id,
        status: true,
      },
      {
        name: "Mary Doe",
        email: "mary@tamayo.com",
        password: userpword!,
        age: 22,
        role: userRole._id,
        status: true,
      },
    ];

    await User.deleteMany({}).session(session);
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await User.create([user], { session });
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
