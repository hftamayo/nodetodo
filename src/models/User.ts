import mongoose from "mongoose";
import { UserRole } from "../types/user.types";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.USER,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    // isAdmin: {
    //   type: Boolean,
    //   required: true,
    //   default: false,
    // },
  },

  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
