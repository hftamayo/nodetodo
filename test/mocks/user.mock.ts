import { mongo } from "mongoose";

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const mockUserRoleUser = {
  _id: new mongo.ObjectId("123456789012"),
  name: "John Doe",
  email: "john@example.com",
  password: "securePassword123",
  age: 30,
};

export const mockUserRoleAdmin = {
  _id: new mongo.ObjectId("123456789013"),
  name: "Jane Doe",
  email: "jane@example.com",
  password: "securePassword123",
  age: 30,
};

export const mockUserRoleSupervisor = {
  _id: new mongo.ObjectId("123456789014"),
  name: "Jaden Smith",
  email: "jaden@example.com",
  password: "securePassword123",
  age: 30,
};

export const mockUserInvalid = {
  id: "123123123AAA",
  name: "Herbert Fernandez",
  email: "hftamayo2@gmail.com",
  password: "incorrect",
  age: 50,
};

export const mockUserUpdate = {
  id: "123456789012",
  name: "Yuki Fernandez Martinez",
  email: `yuki${getRandomInt(1000000)}@gmail.com`,
  emailTaken: "hftamayo@gmail.com",
  oldPassword: "password",
  newPassword: "milucito",
  notMatchPassword: "password2",
  age: 20,
};

//used just in unit testing
export const mockUserDelete = {
  id: "222222222",
};
