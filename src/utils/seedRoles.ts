import mongoose from "mongoose";
import Role from "../models/Role";
import { FullRole } from "../types/role.types";
import { DOMAINS, PERMISSIONS, SYSTEM_PERMISSIONS } from "../config/envvars";

const roles: Omit<FullRole, "_id">[] = [
  {
    name: "administrator",
    description: "Admin role",
    status: true,
    permissions: {
      [DOMAINS.USER]: PERMISSIONS.ALL,
      [DOMAINS.ROLE]: PERMISSIONS.ALL,
      [DOMAINS.TODO]: PERMISSIONS.ALL,
      [DOMAINS.SYSTEM]: SYSTEM_PERMISSIONS.LOGOUT,
    },
  },
  {
    name: "supervisor",
    description: "Supervisor role",
    status: true,
    permissions: {
      [DOMAINS.USER]: PERMISSIONS.READ | PERMISSIONS.UPDATE, // 5 (0101)
      [DOMAINS.ROLE]: PERMISSIONS.READ, // 1 (0001)
      [DOMAINS.TODO]: PERMISSIONS.ALL, // 15 (1111)
      [DOMAINS.SYSTEM]: SYSTEM_PERMISSIONS.LOGOUT, // 1 (0001)
    },
  },
  {
    name: "finaluser",
    description: "User role",
    status: true,
    permissions: {
      [DOMAINS.USER]: PERMISSIONS.READ, // 1 (0001) - Can only read their own info
      [DOMAINS.ROLE]: PERMISSIONS.NONE, // 0 (0000) - No role access
      [DOMAINS.TODO]:
        PERMISSIONS.READ |
        PERMISSIONS.WRITE |
        PERMISSIONS.UPDATE |
        PERMISSIONS.DELETE, // 15 (1111) - Full access to their own todos
      [DOMAINS.SYSTEM]: SYSTEM_PERMISSIONS.LOGOUT, // 1 (0001)
    },
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
