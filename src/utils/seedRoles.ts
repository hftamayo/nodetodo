import mongoose from "mongoose";
import Role from "../models/Role";
import { FullRole } from "@/types/role.types";

const roles: FullRole[] = [
  {
    _id: new mongoose.Types.ObjectId("5f7f8b1e9f3f9c1d6c1e4d1f"),
    name: "administrator",
    description: "Admin role",
    status: true,
    permissions: ["read", "write", "delete"],
  },
  {
    _id: new mongoose.Types.ObjectId("5f7f8b1e9f3f9c1d6c1e4d1f"),
    name: "supervisor",
    description: "Supervisor role",
    status: true,
    permissions: ["read", "delete"],
  },
  {
    _id: new mongoose.Types.ObjectId("5f7f8b1e9f3f9c1d6c1e4d20"),
    name: "finaluser",
    description: "User role",
    status: true,
    permissions: ["read", "write"],
  },
];

async function seedRoles() {
  try {
    await Role.deleteMany({});
    for (const role of roles) {
      await Role.create(role);
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
