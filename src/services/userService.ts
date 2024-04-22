import User from "../models/User";
import Todo from "../models/Todo";
import { masterKey } from "../config/envvars";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserRequest, PartialUserRequest } from "../types/user.interface";

const signUpUser = async function (requestBody: Partial<UserRequest>) {
  const { name, email, password, age } = requestBody;

  if (!name || !email || !password || !age) {
    return { httpStatusCode: 400, message: "Please fill all required fields" };
  }

  try {
    let searchUser = await User.findOne({ email }).exec();
    if (searchUser) {
      return { httpStatusCode: 400, message: "Email already exists" };
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    searchUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
    });
    await searchUser.save();
    return {
      httpStatusCode: 200,
      message: "User created successfully",
      user: searchUser,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, signUpUser: " + error.message);
    } else {
      console.error("userService, signUpUser: " + error);
    }
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

const loginUser = async function (requestBody: Partial<UserRequest>) {
  const { email, password } = requestBody;

  if (!email || !password) {
    return { httpStatusCode: 400, message: "Please fill all required fields" };
  }

  try {
    let searchUser = await User.findOne({ email }).exec();
    if (!searchUser) {
      return {
        httpStatusCode: 404,
        message: "User or Password does not match",
      };
    }
    const passwordMatch = await bcrypt.compare(password, searchUser.password);
    if (!passwordMatch) {
      //update in global log the password did not match
      return {
        httpStatusCode: 404,
        message: "User or Password does not match",
      };
    }
    const payload = { searchUser: searchUser._id };

    const secretKey = masterKey ?? "";

    const token = jwt.sign(payload, secretKey, {
      expiresIn: 360000,
    });
    return {
      httpStatusCode: 200,
      tokenCreated: token,
      message: "User login successfully",
      user: searchUser,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, loginUser: " + error.message);
    } else {
      console.error("userService, loginUser: " + error);
    }
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

const listUserByID = async function (requestUserId: PartialUserRequest) {
  const id = requestUserId.userId;
  try {
    let searchUser = await User.findById(id).exec();
    if (!searchUser) {
      return { httpStatusCode: 404, message: "User Not Found" };
    }
    return { httpStatusCode: 200, message: "User Found", user: searchUser };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, listItemByID: " + error.message);
    } else {
      console.error("userService, listItemByID: " + error);
    }
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

const updateUserByID = async function (
  requestUserId: string,
  requestBody: Partial<UserRequest>
) {
  const userId = requestUserId;
  const { name, email, age } = requestBody;

  if (!name || !email || !age) {
    return { httpStatusCode: 400, message: "Please fill all required fields" };
  }

  try {
    let searchUser = await User.findById(userId).exec();
    if (!searchUser) {
      return { httpStatusCode: 404, message: "User Not Found" };
    }
    let checkIfUpdateEmailExists = await User.findOne({ email }).exec();
    if (
      checkIfUpdateEmailExists &&
      checkIfUpdateEmailExists._id.toString() !== searchUser._id.toString()
    ) {
      return { httpStatusCode: 400, message: "Email already taken" };
    }
    searchUser.name = name;
    searchUser.email = email;
    searchUser.age = age;

    await searchUser.save();

    return {
      httpStatusCode: 200,
      message: "Data updated successfully",
      user: searchUser,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, updateUserByID: " + error.message);
    } else {
      console.error("userService, updateUserByID: " + error);
    }
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

const updateUserPassword = async function (
  requestUserId: string,
  requestPword: Partial<UserRequest>
) {
  const userId = requestUserId;
  const { password, newPassword } = requestPword;

  if (!password || !newPassword) {
    return { httpStatusCode: 400, message: "Please fill all required fields" };
  }

  try {
    let searchUser = await User.findById(userId).exec();
    if (!searchUser) {
      return { httpStatusCode: 404, message: "User Not Found" };
    }
    const isMatch = await bcrypt.compare(password, searchUser.password);
    if (!isMatch) {
      return {
        httpStatusCode: 400,
        message: "The entered credentials are not valid",
      };
    }
    const salt = await bcrypt.genSalt(10);
    searchUser.password = await bcrypt.hash(newPassword, salt);
    await searchUser.save();
    return {
      httpStatusCode: 200,
      message: "Password updated successfully",
      user: searchUser,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, updateUserPassword: " + error.message);
    } else {
      console.error("userService, updateUserPassword: " + error);
    }
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

const deleteUserByID = async function (requestUserId: Partial<UserRequest>) {
  const id = requestUserId;
  try {
    const searchUser = await User.findById(id).exec();
    if (!searchUser) {
      return { httpStatusCode: 404, message: "User not found" };
    }
    const todo = await Todo.find({ user: searchUser }).exec();
    if (todo) {
      await Todo.deleteMany({ user: searchUser }).exec();
    }
    await searchUser.deleteOne();
    return { httpStatusCode: 200, message: "User deleted successfully" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, deleteUserByID: " + error.message);
    } else {
      console.error("userService, deleteUserByID: " + error);
    }
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

export default {
  signUpUser,
  loginUser,
  listUserByID,
  updateUserByID,
  updateUserPassword,
  deleteUserByID,
};
