import User from "../models/User";
import Todo from "../models/Todo";
import { masterKey } from "../config/envvars";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  UserRequest,
  LoginRequest,
  UpdateUserRequest,
  UserIdRequest,
  FullUser,
  SignUpUserResponse,
  LoginResponse,
  SearchUserByIdResponse,
  FilteredSignUpUser,
  FilteredLoginUser,
  FilteredSearchUserById,
  DeleteUserByIdResponse,
  UpdateUserDetailsResponse,
  FilteredUpdateUser,
} from "../types/user.types";

const signUpUser = async function (
  requestBody: UserRequest
): Promise<SignUpUserResponse> {
  const { name, email, password: plainPassword, age } = requestBody;

  if (!name || !email || !plainPassword || !age) {
    return {
      httpStatusCode: 400,
      message: "MISSING_FIELDS",
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    searchUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
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
  requestBody: LoginRequest
): Promise<LoginResponse> {
  const { email, password: plainPassword } = requestBody;

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
    const payload = { searchUser: searchUser._id };

    const secretKey = masterKey ?? "";

    const token = jwt.sign(payload, secretKey, {
      expiresIn: 360000,
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

const listUserByID = async function (
  requestUserId: UserIdRequest
): Promise<SearchUserByIdResponse> {
  const userId = requestUserId.userId;
  try {
    let searchUser = await User.findById(userId).exec();
    if (!searchUser) {
      return { httpStatusCode: 404, message: "ENTITY_NOT_FOUND" };
    }
    const filteredUser: FilteredSearchUserById = {
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
  updateUserRequest: UpdateUserRequest
): Promise<UpdateUserDetailsResponse> {
  const { userId, user } = updateUserRequest;
  const { name, email, age } = user;

  if (!name || !email || !age) {
    return { httpStatusCode: 400, message: "MISSING_FIELDS" };
  }

  try {
    let searchUser = await User.findById(userId).exec();
    if (!searchUser) {
      return { httpStatusCode: 404, message: "ENTITY_NOT_FOUND" };
    }
    let checkIfUpdateEmailExists = await User.findOne({ email }).exec();
    if (
      checkIfUpdateEmailExists &&
      checkIfUpdateEmailExists._id.toString() !== searchUser._id.toString()
    ) {
      return { httpStatusCode: 400, message: "EMAIL_EXISTS" };
    }
    searchUser.name = name;
    searchUser.email = email;
    searchUser.age = age;

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
  updateUserRequest: UpdateUserRequest
) {
  const { userId, user } = updateUserRequest;
  const { password, newPassword } = user;

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

const deleteUserByID = async function (
  requestUserId: UserIdRequest
): Promise<DeleteUserByIdResponse> {
  const userId = requestUserId.userId;
  try {
    const searchUser = await User.findById(userId).exec();
    if (!searchUser) {
      return { httpStatusCode: 404, message: "ENTITY_NOT_FOUND" };
    }
    const todo = await Todo.find({ user: searchUser }).exec();
    if (todo) {
      await Todo.deleteMany({ user: searchUser }).exec();
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
  listUserByID,
  updateUserDetailsByID,
  updateUserPasswordByID,
  deleteUserByID,
};
