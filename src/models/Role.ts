import mongoose from "mongoose";
import { RoleDocument } from "@/types/role.types";

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    permissions: {
      type: Map,
      of: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Role = mongoose.model<RoleDocument>("Role", RoleSchema);

export default Role;
