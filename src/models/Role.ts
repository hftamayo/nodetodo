import mongoose from "mongoose";

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

const Role = mongoose.model("Role", RoleSchema);

export default Role;
