import { mongo } from "mongoose";
import { mockUserRoleUser, mockUserRoleSupervisor } from "./user.mock";
import { create } from "domain";

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const newStandardTodo = {
  id: new mongo.ObjectId("123456789012"),
  title: `New Todo${getRandomInt(1000000)}`,
  description: "New Todo Description",
  completed: false,
  user: mockUserRoleUser._id,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const invalidStandardTodo = {
  _id: "ABC123456",
  title: "invalid title",
  description: "invalid description",
  completed: false,
  user: mockUserRoleUser._id,
};

export const newTodoSupervisor = {
  _id: new mongo.ObjectId("123456789013"),
  title: "Gym",
  description: "To exercise",
  completed: false,
  user: mockUserRoleSupervisor._id,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const todoForUpdate = {
  _id: new mongo.ObjectId("123456789014"),
  title: "Update Todo",
  description: "Update Todo Description",
  completed: true,
  user: mockUserRoleUser._id,
  updatedAt: new Date(),
};

export const deleteTodo = {
  _id: new mongo.ObjectId("123456789015"),
};
