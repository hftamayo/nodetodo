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
  FullUser,
  FilteredSearchUsers,
  SignUpUserResponse,
  LoginResponse,
  SearchUsersResponse,
  SearchUserByIdResponse,
  FilteredSignUpUser,
  FilteredLoginUser,
  FilteredSearchUserById,
  DeleteUserByIdResponse,
  UpdateUserDetailsResponse,
  FilteredUpdateUser,
  ListUsersRequest,
  JwtActiveSession,
} from "@/types/user.types";

const signUpUser = async function (
  params: SignUpRequest
): Promise<SignUpUserResponse> {
  const { name, email, password: plainPassword, repeatPassword, age } = params;

  if (!name || !email || !plainPassword || !repeatPassword || !age) {
    return {
      httpStatusCode: 400,
      message: "MISSING_FIELDS",
    };
  }

  if (plainPassword !== repeatPassword) {
    return {
      httpStatusCode: 400,
      message: "PASSWORD_MISMATCH",
    };
  }

  try {
    let searchUser = await User.findOne({ email }).exec();
    if (searchUser) {
      return {
        httpStatusCode: 400,
        message: "EMAIL_EXISTS",
      };
    }

    const finalUserRole = await Role.findOne({ name: "finaluser" }).exec();
    if (!finalUserRole) {
      return {
        httpStatusCode: 500,
        message: "ROLE_NOT_FOUND",
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

    const { password, updatedAt, ...filteredUser } =
      searchUser.toObject() as FullUser;
    return {
      httpStatusCode: 201,
      message: "USER_CREATED",
      user: filteredUser as FilteredSignUpUser,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, signUpUser: " + error.message);
    } else {
      console.error("userService, signUpUser: " + error);
    }
    return {
      httpStatusCode: 500,
      message: "UNKNOWN_ERROR",
    };
  }
};

const loginUser = async function (
  params: LoginRequest
): Promise<LoginResponse> {
  const { email, password: plainPassword } = params;

  if (!email || !plainPassword) {
    return {
      httpStatusCode: 400,
      message: "MISSING_FIELDS",
    };
  }

  try {
    let searchUser = await User.findOne({ email }).exec();
    if (!searchUser || !searchUser.status) {
      return {
        httpStatusCode: 401,
        message: !searchUser ? "BAD_CREDENTIALS" : "ACCOUNT_DISABLED",
      };
    }
    const passwordMatch = await bcrypt.compare(
      plainPassword,
      searchUser.password
    );
    if (!passwordMatch) {
      //update in global log the password did not match
      return {
        httpStatusCode: 402,
        message: "BAD_CREDENTIALS",
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
        message: "INTERNAL_ERROR",
      };
    }

    const token = jwt.sign(payload, masterKey, {
      expiresIn: 28800000, // 8 hours
      algorithm: "HS256",
    });

    const { password, createdAt, updatedAt, ...filteredUser } =
      searchUser.toObject() as FullUser;

    return {
      httpStatusCode: 200,
      tokenCreated: token,
      message: "LOGIN_SUCCESS",
      user: filteredUser as FilteredLoginUser,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, loginUser: " + error.message);
    } else {
      console.error("userService, loginUser: " + error);
    }
    return { httpStatusCode: 500, message: "UNKNOWN_ERROR" };
  }
};

const listUsers = async function (
  params: ListUsersRequest
): Promise<SearchUsersResponse> {
  const { page, limit } = params;
  try {
    const skip = (page - 1) * limit;
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const filteredUsers: FilteredSearchUsers[] = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    }));

    return {
      httpStatusCode: 200,
      message: "USERS_FOUND",
      users: filteredUsers,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, searchUsers: " + error.message);
    } else {
      console.error("userService, searchUsers: " + error);
    }
    return {
      httpStatusCode: 500,
      message: "UNKNOWN_ERROR",
    };
  }
};

const listUserByID = async function (
  userId: string
): Promise<SearchUserByIdResponse> {
  try {
    let searchUser = await User.findById(userId).exec();
    if (!searchUser) {
      return { httpStatusCode: 404, message: "ENTITY_NOT_FOUND" };
    }
    const filteredUser: FilteredSearchUserById = {
      _id: searchUser._id,
      name: searchUser.name,
      email: searchUser.email,
      role: searchUser.role,
      status: searchUser.status,
    };

    return { httpStatusCode: 200, message: "ENTITY_FOUND", user: filteredUser };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, listItemByID: " + error.message);
    } else {
      console.error("userService, listItemByID: " + error);
    }
    return { httpStatusCode: 500, message: "UNKNOWN_ERROR" };
  }
};

const updateUserDetailsByID = async function (
  params: UpdateUserRequest
): Promise<UpdateUserDetailsResponse> {
  const { userId, user } = params;
  const { ...updates } = user;

  if (Object.keys(updates).length === 0) {
    return { httpStatusCode: 400, message: "MISSING_FIELDS" };
  }

  try {
    let searchUser = await User.findById(userId).exec();
    if (!searchUser) {
      return { httpStatusCode: 404, message: "ENTITY_NOT_FOUND" };
    }

    if (updates.email !== undefined) {
      let checkIfUpdateEmailExists = await User.findOne({
        email: updates.email,
      }).exec();
      if (
        checkIfUpdateEmailExists &&
        checkIfUpdateEmailExists._id.toString() !== searchUser._id.toString()
      ) {
        return { httpStatusCode: 400, message: "EMAIL_EXISTS" };
      }
    }

    if (updates.name !== undefined) searchUser.name = updates.name;
    if (updates.email !== undefined) searchUser.email = updates.email;
    if (updates.age !== undefined) searchUser.age = updates.age;
    if (updates.status !== undefined) searchUser.status = updates.status;

    await searchUser.save();

    const { password, createdAt, ...filteredUser } =
      searchUser.toObject() as FullUser;

    return {
      httpStatusCode: 200,
      message: "ENTITY_UPDATED",
      user: filteredUser as FilteredUpdateUser,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, updateUserByID: " + error.message);
    } else {
      console.error("userService, updateUserByID: " + error);
    }
    return { httpStatusCode: 500, message: "UNKNOWN_ERROR" };
  }
};

const updateUserPasswordByID = async function (
  params: UpdateUserRequest
): Promise<UpdateUserDetailsResponse> {
  const { userId, user } = params;
  const { password: plainPassword, updatePassword } = user;

  if (!plainPassword || !updatePassword) {
    return { httpStatusCode: 400, message: "MISSING_FIELDS" };
  }

  try {
    let searchUser = await User.findById(userId).exec();
    if (!searchUser) {
      return { httpStatusCode: 404, message: "ENTITY_NOT_FOUND" };
    }
    const isMatch = await bcrypt.compare(plainPassword, searchUser.password);
    if (!isMatch) {
      return {
        httpStatusCode: 400,
        message: "BAD_CREDENTIALS",
      };
    }
    const salt = await bcrypt.genSalt(10);
    searchUser.password = await bcrypt.hash(updatePassword, salt);
    await searchUser.save();

    const { password, createdAt, ...filteredUser } =
      searchUser.toObject() as FullUser;

    return {
      httpStatusCode: 200,
      message: "ENTITY UPDATED",
      user: filteredUser as FilteredUpdateUser,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, updateUserPassword: " + error.message);
    } else {
      console.error("userService, updateUserPassword: " + error);
    }
    return { httpStatusCode: 500, message: "UNKNOWN_ERROR" };
  }
};

const deleteUserByID = async function (
  userId: string
): Promise<DeleteUserByIdResponse> {
  try {
    const searchUser = await User.findById(userId).exec();
    if (!searchUser) {
      return { httpStatusCode: 404, message: "ENTITY_NOT_FOUND" };
    }
    const todo = await Todo.find({ owner: searchUser }).exec();
    if (todo) {
      await Todo.deleteMany({ owner: searchUser }).exec();
    }
    await searchUser.deleteOne();
    return { httpStatusCode: 200, message: "ENTITY_DELETED" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("userService, deleteUserByID: " + error.message);
    } else {
      console.error("userService, deleteUserByID: " + error);
    }
    return { httpStatusCode: 500, message: "UNKNOWN_ERROR" };
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
