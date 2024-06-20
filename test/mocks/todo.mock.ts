import Todo from "../../src/models/Todo";
import User from "../../src/models/User";
import mongoose from "mongoose";

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  };

const newTodo = (userId = new mongoose.Types.ObjectId()) => ({
    title: `New Todo${getRandomInt(1000000)}`,
    description: "New Todo Description",
    completed: false,
    user: userId,
});