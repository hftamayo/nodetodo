import mongoose from "mongoose";

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const newStandardTodo = {
  id: new mongoose.Types.ObjectId(),
  title: `New Todo${getRandomInt(1000000)}`,
  description: "New Todo Description",
  completed: false,
  user: new mongoose.Types.ObjectId(),
};

export const newTodoSupervisor = {
  id: new mongoose.Types.ObjectId(),
  title: "Gym",
  description: "To exercise",
  completed: false,
  user: "5f7f8b1e9f3f9c1d6c1e4d1f",
};

export const todoForUpdate = {
  title: "Update Todo",
  description: "Update Todo Description",
  completed: true,
};

export const deleteTodo = {
  id: "222222222",
}