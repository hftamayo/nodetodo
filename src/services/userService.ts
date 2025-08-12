import Role from "@models/Role";
import User from "@models/User";
import Todo from "@models/Todo";
import { masterKey } from "@config/envvars";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import {
  SignUpRequest,
  LoginRequest,
  UpdateUserRequest,
  FilteredUser,
  ListUsersRequest,
  JwtActiveSession,
  EntityResponse,
  EntitiesResponse,
  DeleteLogoutResponse,
} from "@/types/user.types";

const signUpUser = async function (
  params: SignUpRequest
): Promise<EntityResponse> {
  const { name, email, password: plainPassword, repeatPassword, age } = params;

  if (!name || !email || !plainPassword || !repeatPassword || !age) {
    return {
      httpStatusCode: 400,
      message: "Missing required fields",
    };
  }

  if (plainPassword !== repeatPassword) {
    return {
      httpStatusCode: 400,
      message: "Passwords do not match",
    };
  }

  try {
    let searchUser = await User.findOne({ email }).exec();
    if (searchUser) {
      return {
        httpStatusCode: 409,
        message: "User with this email already exists",
      };
    }

    const finalUserRole = await Role.findOne({ name: "finaluser" }).exec();
    if (!finalUserRole) {
      return {
        httpStatusCode: 500,
        message: "Default user role not found",
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    searchUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
      status: false,
      role: finalUserRole._id,
    });
    await searchUser.save();

    const filteredUser: FilteredUser = {
      _id: searchUser._id,
      name: searchUser.name,
      email: searchUser.email,
      role: searchUser.role,
      status: searchUser.status,
    };

    return {
      httpStatusCode: 201,
      message: "User created successfully",
      data: filteredUser,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, signUpUser: " + error.message);
    } else {
      console.error("userService, signUpUser: " + error);
    }
    return {
      httpStatusCode: 500,
      message: "Internal server error",
    };
  }
};

const loginUser = async function (
  params: LoginRequest
): Promise<EntityResponse> {
  const { email, password: plainPassword } = params;

  if (!email || !plainPassword) {
    return {
      httpStatusCode: 400,
      message: "Missing required fields",
    };
  }

  try {
    let searchUser = await User.findOne({ email }).exec();
    if (!searchUser) {
      return {
        httpStatusCode: 401,
        message: "Invalid credentials",
      };
    } else if (!searchUser.status) {
      return {
        httpStatusCode: 403,
        message: "Account is disabled",
      };
    }

    const passwordMatch = await bcrypt.compare(
      plainPassword,
      searchUser.password
    );
    if (!passwordMatch) {
      return {
        httpStatusCode: 401,
        message: "Invalid credentials",
      };
    }

    const payload: JwtActiveSession = {
      sub: searchUser._id.toString(),
      role: searchUser.role.toString(),
      sessionId: crypto.randomUUID(),
      ver: "1.0",
    };

    if (!masterKey) {
      return {
        httpStatusCode: 500,
        message: "Internal server error",
      };
    }

    const token = jwt.sign(payload, masterKey, {
      expiresIn: 28800000, // 8 hours
      algorithm: "HS256",
    });

    const filteredUser: FilteredUser = {
      _id: searchUser._id,
      name: searchUser.name,
      email: searchUser.email,
      role: searchUser.role,
      status: searchUser.status,
    };

    return {
      httpStatusCode: 200,
      message: "Login successful",
      data: filteredUser,
      tokenCreated: token,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, loginUser: " + error.message);
    } else {
      console.error("userService, loginUser: " + error);
    }
    return {
      httpStatusCode: 500,
      message: "Internal server error",
    };
  }
};

const listUsers = async function (
  params: ListUsersRequest
): Promise<EntitiesResponse> {
  const { page, limit } = params;
  try {
    const skip = (page - 1) * limit;
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const filteredUsers: FilteredUser[] = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    }));

    return {
      httpStatusCode: 200,
      message: "Users retrieved successfully",
      data: filteredUsers,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, searchUsers: " + error.message);
    } else {
      console.error("userService, searchUsers: " + error);
    }
    return {
      httpStatusCode: 500,
      message: "Internal server error",
    };
  }
};

const listUserByID = async function (userId: string): Promise<EntityResponse> {
  try {
    let searchUser = await User.findById(userId).exec();
    if (!searchUser) {
      return {
        httpStatusCode: 404,
        message: "User not found",
      };
    }

    const filteredUser: FilteredUser = {
      _id: searchUser._id,
      name: searchUser.name,
      email: searchUser.email,
      role: searchUser.role,
      status: searchUser.status,
    };

    return {
      httpStatusCode: 200,
      message: "User retrieved successfully",
      data: filteredUser,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, listItemByID: " + error.message);
    } else {
      console.error("userService, listItemByID: " + error);
    }
    return {
      httpStatusCode: 500,
      message: "Internal server error",
    };
  }
};

const updateUserDetailsByID = async function (
  params: UpdateUserRequest
): Promise<EntityResponse> {
  const { userId, user } = params;
  const { ...updates } = user;

  if (Object.keys(updates).length === 0) {
    return {
      httpStatusCode: 400,
      message: "No updates provided",
    };
  }

  try {
    let searchUser = await User.findById(userId).exec();
    if (!searchUser) {
      return {
        httpStatusCode: 404,
        message: "User not found",
      };
    }

    if (updates.email !== undefined) {
      let checkIfUpdateEmailExists = await User.findOne({
        email: updates.email,
      }).exec();
      if (
        checkIfUpdateEmailExists &&
        checkIfUpdateEmailExists._id.toString() !== searchUser._id.toString()
      ) {
        return {
          httpStatusCode: 409,
          message: "Email already exists",
        };
      }
    }

    if (updates.name !== undefined) searchUser.name = updates.name;
    if (updates.email !== undefined) searchUser.email = updates.email;
    if (updates.age !== undefined) searchUser.age = updates.age;
    if (updates.status !== undefined) searchUser.status = updates.status;

    await searchUser.save();

    const filteredUser: FilteredUser = {
      _id: searchUser._id,
      name: searchUser.name,
      email: searchUser.email,
      role: searchUser.role,
      status: searchUser.status,
    };

    return {
      httpStatusCode: 200,
      message: "User updated successfully",
      data: filteredUser,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, updateUserByID: " + error.message);
    } else {
      console.error("userService, updateUserByID: " + error);
    }
    return {
      httpStatusCode: 500,
      message: "Internal server error",
    };
  }
};

const updateUserPasswordByID = async function (
  params: UpdateUserRequest
): Promise<EntityResponse> {
  const { userId, user } = params;
  const { password: plainPassword, updatePassword } = user;

  if (!plainPassword || !updatePassword) {
    return {
      httpStatusCode: 400,
      message: "Missing required fields",
    };
  }

  try {
    let searchUser = await User.findById(userId).exec();
    if (!searchUser) {
      return {
        httpStatusCode: 404,
        message: "User not found",
      };
    }

    const isMatch = await bcrypt.compare(plainPassword, searchUser.password);
    if (!isMatch) {
      return {
        httpStatusCode: 401,
        message: "Invalid current password",
      };
    }

    const salt = await bcrypt.genSalt(10);
    searchUser.password = await bcrypt.hash(updatePassword, salt);
    await searchUser.save();

    const filteredUser: FilteredUser = {
      _id: searchUser._id,
      name: searchUser.name,
      email: searchUser.email,
      role: searchUser.role,
      status: searchUser.status,
    };

    return {
      httpStatusCode: 200,
      message: "Password updated successfully",
      data: filteredUser,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, updateUserPassword: " + error.message);
    } else {
      console.error("userService, updateUserPassword: " + error);
    }
    return {
      httpStatusCode: 500,
      message: "Internal server error",
    };
  }
};

const deleteUserByID = async function (
  userId: string
): Promise<DeleteLogoutResponse> {
  try {
    const searchUser = await User.findById(userId).exec();
    if (!searchUser) {
      return {
        httpStatusCode: 404,
        message: "User not found",
      };
    }

    const todo = await Todo.find({ owner: searchUser }).exec();
    if (todo) {
      await Todo.deleteMany({ owner: searchUser }).exec();
    }

    await searchUser.deleteOne();

    return {
      httpStatusCode: 200,
      message: "User deleted successfully",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, deleteUserByID: " + error.message);
    } else {
      console.error("userService, deleteUserByID: " + error);
    }
    return {
      httpStatusCode: 500,
      message: "Internal server error",
    };
  }
};

export default {
  signUpUser,
  loginUser,
  listUsers,
  listUserByID,
  updateUserDetailsByID,
  updateUserPasswordByID,
  deleteUserByID,
};
