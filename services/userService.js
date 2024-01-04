const User = require("../models/User.js");
const Todo = require("../models/Todo.js");
const jwt = require("jsonwebtoken");
const { masterKey } = require("../config/envvars.js");
const bcrypt = require("bcrypt");

const signUpUser = async function (requestBody) {
  const { name, email, password, age } = requestBody;
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
  } catch (error) {
    console.error("userService, signUpUser: " + error.message);
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

const loginUser = async function (requestBody) {
  const { email, password } = requestBody;
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

    const token = jwt.sign(payload, masterKey, {
      expiresIn: 360000,
    });
    return {
      httpStatusCode: 200,
      tokenCreated: token,
      message: "User login successfully",
      user: searchUser,
    };
  } catch (error) {
    console.error("userService, loginUser: " + error.message);
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

const listUserByID = async function (requestUserId) {
  const userId = requestUserId;
  try {
    let searchUser = await User.findById(userId).exec();
    if (!searchUser) {
      return { httpStatusCode: 404, message: "User Not Found" };
    }
    return { httpStatusCode: 200, message: "User Found", user: searchUser };
  } catch (error) {
    console.error("userService, listItemByID: " + error.message);
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

const updateUserByID = async function (requestUserId, requestBody) {
  const userId = requestUserId;
  const { name, email, age } = requestBody;

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
  } catch (error) {
    console.error("userService, updateUserByID: " + error.message);
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

const updateUserPassword = async function (requestUserId, requestPword) {
  const userId = requestUserId;
  const { password, newPassword } = requestPword;
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
  } catch (error) {
    console.error("userService, updateUserPassword: " + error.message);
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

const deleteUserByID = async function (requestUserId) {
  const userId = requestUserId;
  try {
    const searchUser = await User.findById(userId).exec();
    if (!searchUser) {
      return { httpStatusCode: 404, message: "User not found" };
    }
    const todo = await Todo.find({ user: searchUser }).exec();
    if (todo) {
      await Todo.deleteMany({ user: searchUser }).exec();
    }
    await searchUser.deleteOne();
    return { httpStatusCode: 200, message: "User deleted successfully" };
  } catch (error) {
    console.error("userService, deleteUserByID: " + error.message);
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

module.exports = {
  signUpUser,
  loginUser,
  listUserByID,
  updateUserByID,
  updateUserPassword,
  deleteUserByID,
};
