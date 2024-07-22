import mongoose from "mongoose";
import { mockUserRoleUser } from "./user.mock";

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const newStandardTodo = {
  id: new mongoose.Types.ObjectId().toString(), 
  title: `New Todo${getRandomInt(1000000)}`,
  description: "New Todo Description",
  completed: false,
  user: new mongoose.Types.ObjectId().toString(), 

};

export const invalidStandardTodo = {
  id: "ABC123456", 
};

export const newTodoSupervisor = {
  _id: new mongoose.Types.ObjectId,
  title: "Gym",
  description: "To exercise",
  completed: false,
  user: "5f7f8b1e9f3f9c1d6c1e4d1f",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const todoForUpdate = {
  _id: "5f7f8b1e9f3f9c1d6c1e4d1f",
  title: "Update Todo",
  description: "Update Todo Description",
  completed: true,
};

export const deleteTodo = {
  id: "222222222",
}