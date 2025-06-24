import mongoose from "mongoose";

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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
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
