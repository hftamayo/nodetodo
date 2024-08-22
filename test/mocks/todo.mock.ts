import { mongo } from "mongoose";
import { mockUserRoleUser, mockUserRoleSupervisor } from "./user.mock";

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const mockTodos = [
  {
    _id: new mongo.ObjectId("123456789001"),
    title: "Task 1",
    description: "Description for Task 1",
    completed: false,
    user: mockUserRoleUser._id,
    updatedAt: new Date(),
  },
  {
    _id: new mongo.ObjectId("123456789002"),
    title: "Task 2",
    description: "Description for Task 2",
    completed: true,
    user: mockUserRoleUser._id,
    updatedAt: new Date(),
  },
];

export const mockTodoRoleUser = {
  _id: new mongo.ObjectId("123456789012"),
  title: `New Todo${getRandomInt(1000000)}`,
  description: "New Todo Description",
  completed: false,
  user: mockUserRoleUser._id,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockInvalidTodo = {
  _id: "ABC123456",
  title: "invalid title",
  description: "invalid description",
  completed: false,
  user: mockUserRoleUser._id,
};

export const mockTodoRoleSupervisor = {
  _id: new mongo.ObjectId("123456789013"),
  title: "Gym",
  description: "To exercise",
  completed: false,
  user: mockUserRoleSupervisor._id,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockTodoForUpdate = {
  _id: new mongo.ObjectId("123456789014"),
  title: "Update Todo",
  description: "Update Todo Description",
  completed: true,
  user: mockUserRoleUser._id,
  updatedAt: new Date(),
};

export const mockDeleteTodo = {
  _id: new mongo.ObjectId("123456789015"),
};
