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
    const createdRoles = [];
    for (const role of roles) {
      const createdRole = await Role.create([role], { session });
      createdRoles.push(createdRole[0]);
      console.log("Role created: ", createdRole[0]);
    }
    return createdRoles;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("seedRoles: ", error.message);
    } else {
      console.error("seedRoles: ", error);
    }
  }
}

export default seedRoles;
