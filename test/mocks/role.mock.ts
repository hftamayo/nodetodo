import mongoose from "mongoose";
import { FilteredRole } from "@/types/role.types";

export const mockRolesData = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "admin",
    description: "Administrator role",
    status: true,
    permissions: new Map([
      ["users", 7],
      ["roles", 7],
    ]),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "user",
    description: "Basic user role",
    status: true,
    permissions: new Map([
      ["users", 1],
      ["roles", 1],
    ]),
  },
];

export const expectedFilteredRoles: FilteredRole[] = mockRolesData.map(
  (role) => ({
    _id: role._id,
    name: role.name,
    description: role.description,
    status: role.status,
    permissions: Object.fromEntries(role.permissions),
  })
);
