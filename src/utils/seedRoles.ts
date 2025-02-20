import mongoose from "mongoose";
import Role from "../models/Role";
import { FullRole } from "@/types/role.types";

const roles: Omit<FullRole, "_id">[] = [
  {
    name: "administrator",
    description: "Admin role",
    status: true,
    permissions: ["read", "write", "delete"],
  },
  {
    name: "supervisor",
    description: "Supervisor role",
    status: true,
    permissions: ["read", "delete"],
  },
  {
    name: "finaluser",
    description: "User role",
    status: true,
    permissions: ["read", "write"],
  },
];

async function seedRoles(session: mongoose.ClientSession) {
  try {
    await Role.deleteMany({}).session(session);
    for (const role of roles) {
      await Role.create([role], { session });
      console.log("Role created: ", role);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("seedRoles: ", error.message);
    } else {
      console.error("seedRoles: ", error);
    }
  }
}

export default seedRoles;
