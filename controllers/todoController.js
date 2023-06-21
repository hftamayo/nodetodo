import Todo from "../models/Todo.js";

export const getTodos = async (req, res) => {
  try {
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ errors: "Internal Server Error" });
  }
};

export const getTodo = async (req, res) => {
    try {
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ errors: "Internal Server Error" });
    }    
};

export const createTodo = async (req, res) => {
    try {
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ errors: "Internal Server Error" });
    }    
};

export const updateTodo = async (req, res) => {
    try {
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ errors: "Internal Server Error" });
    }    
};

export const deleteTodo = async (req, res) => {
    try {
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ errors: "Internal Server Error" });
    }    
};
