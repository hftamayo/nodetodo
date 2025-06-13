import mongoose from "mongoose";
import { FilteredRole } from "@/types/role.types";

// Mock mongoose.Types.ObjectId
jest.mock("mongoose", () => ({
  ...jest.requireActual("mongoose"),
  Types: {
    ObjectId: jest.fn().mockImplementation((id) => ({
      _id: id,
      toString: () => id,
      toHexString: () => id,
      toJSON: () => id,
      equals: (other: any) => other && other.toString() === id,
      getTimestamp: () => new Date(),
      toBSON: () => ({ _id: id }),
      inspect: () => `ObjectId("${id}")`,
    })),
  },
}));

export const mockRolesData = [
  {
    _id: new mongoose.Types.ObjectId("adminRoleId123456789012"),
    name: "admin",
    description: "Administrator role",
    status: true,
    permissions: new Map([
      ["users", 7],
      ["roles", 7],
    ]),
  },
  {
    _id: new mongoose.Types.ObjectId("userRoleId123456789012"),
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
