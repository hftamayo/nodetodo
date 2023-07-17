import User from "../../models/User.js";
import Todo from "../../models/Todo.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const updateUserPassword = async function (requestPword) {
  const { password, newPassword } = requestPword.body;
  /*
  password validation rules
  buscar al usuario
  comparar password
  saltear
  guardar

  */
};

export const listItemByID = async function (reqId) {
  const id = reqId;
  try {
    let searchUser = await User.findById({ id });
    if (!searchUser) {
      return { type: 400, message: "User Not Found" };
    }
    return { type: 200, message: searchUser };
  } catch (error) {
    console.error("userService, listItemByID: " + error.message);
    return { type: 500, message: "Internal Server Error" };
  }
};

export const updateUserByID = async function (reqId, reqBody) {
  const id = reqId;
  const { name, email, age } = reqBody.body;

  try {
    let updateUser = await User.findById({ id });
    if (!updateUser) {
      return { type: 404, message: "User Not Found" };
    }
    let checkIfExists = await User.findOne({ email });
    if (checkIfExists && checkIfExists._id.toString() !== user._id.toString()) {
      return { type: 400, message: "User Not Found" };
    }
    updateUser.name = { name };
    updateUser.email = { email };
    updateUser.age = { age };

    await updateUser.save();

    return { type: 200, message: updateUser };
  } catch (error) {
    console.error("userService, updateuserByID: " + error.message);
    return { type: 500, message: "Internal Server Error" };
  }
};

export const deleteUserByID = async function (reqId) {
  const userId = reqId;
  try {
    const targetUser = await User.findById({ userId });
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
    console.error("userService, deleteUserByID: " + error.message);
    return { type: 500, message: "Internal Server Error" };
  }
};
