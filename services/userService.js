import User from "../../models/User.js";
import Todo from "../../models/Todo.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const deleteUserByID = async function (userId) {
  try {
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return { type: 404, message: "User not found" };
    }
    const todo = await Todo.find({ user: targetUser });
    if (todo) {
      await Todo.deleteMany({ user: targetUser });
    }
    await targetUser.deleteOne();
    return { type: 200, message: "User deleted successfully" };
  } catch (error) {
    console.error("userService: " + error.message);
    return { type: 500, message: "Internal Server Error" };
  }
};

module.exports = {
  deleteUserByID,
};
