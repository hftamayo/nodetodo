import Todo from "@/models/Todo";
import {
  NewTodoRequest,
  UpdateTodoRequest,
  ListTodosByOwnerRequest,
  ListTodoByOwnerRequest,
  FilteredTodo,
  EntitiesResponse,
  EntityResponse,
  DeleteResponse,
} from "@/types/todo.types";

const listTodos = async function (
  params: ListTodosByOwnerRequest
): Promise<EntitiesResponse> {
  const { owner, page, limit, activeOnly } = params;
  try {
    const skip = (page - 1) * limit;
    const query: { owner: string; completed?: boolean } = {
      owner: owner,
    };

    if (activeOnly) {
      query["completed"] = false;
    }
    const todos = await Todo.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    if (!todos || todos.length === 0) {
      return {
        httpStatusCode: 404,
        message: "No todos found",
      };
    }

    const filteredTodos: FilteredTodo[] = todos.map((todo) => ({
      _id: todo._id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      owner: todo.owner,
    }));

    return {
      httpStatusCode: 200,
      message: "Todos retrieved successfully",
      data: filteredTodos,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, listTodos: " + error.message);
    } else {
      console.error("todoService, listTodos: " + error);
    }
    return {
      httpStatusCode: 500,
      message: "Internal server error",
    };
  }
};

const listTodoByID = async function (
  params: ListTodoByOwnerRequest
): Promise<EntityResponse> {
  const { owner, todoId } = params;

  try {
    let searchTodo = await Todo.findById(todoId).exec();

    if (!searchTodo) {
      return {
        httpStatusCode: 404,
        message: "Todo not found",
      };
    }

    if (searchTodo.owner.toString() !== owner.toString()) {
      return {
        httpStatusCode: 403,
        message: "Unauthorized access to todo",
      };
    }

    const filteredTodo: FilteredTodo = {
      _id: searchTodo._id,
      title: searchTodo.title,
      description: searchTodo.description,
      completed: searchTodo.completed,
      owner: searchTodo.owner,
    };

    return {
      httpStatusCode: 200,
      message: "Todo retrieved successfully",
      data: filteredTodo,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, listTodoByID: " + error.message);
    } else {
      console.error("todoService, listTodoByID: " + error);
    }
    return {
      httpStatusCode: 500,
      message: "Internal server error",
    };
  }
};

const createTodo = async function (
  params: NewTodoRequest
): Promise<EntityResponse> {
  const { owner, todo } = params;
  const { title, description } = todo;

  if (!owner || !title || !description) {
    return {
      httpStatusCode: 400,
      message: "Missing required fields",
    };
  }

  try {
    let newTodo = await Todo.findOne({ title }).exec();
    if (newTodo) {
      return {
        httpStatusCode: 409,
        message: "Todo with this title already exists",
      };
    }

    newTodo = new Todo({
      title,
      description,
      completed: false,
      owner: owner,
    });
    await newTodo.save();

    const filteredTodo: FilteredTodo = {
      _id: newTodo._id,
      title: newTodo.title,
      description: newTodo.description,
      completed: newTodo.completed,
      owner: newTodo.owner,
    };

    return {
      httpStatusCode: 201,
      message: "Todo created successfully",
      data: filteredTodo,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, createTodo: " + error.message);
    } else {
      console.error("todoService, createTodo: " + error);
    }
    return {
      httpStatusCode: 500,
      message: "Internal server error",
    };
  }
};

const updateTodoByID = async function (
  params: UpdateTodoRequest
): Promise<EntityResponse> {
  const { owner, todo } = params;
  const { _id, ...updates } = todo;

  if (!owner || !_id || Object.keys(updates).length === 0) {
    return {
      httpStatusCode: 400,
      message: "Missing required fields or no updates provided",
    };
  }

  try {
    let updateTodo = await Todo.findById(_id).exec();
    if (!updateTodo) {
      return {
        httpStatusCode: 404,
        message: "Todo not found",
      };
    }

    if (updateTodo.owner.toString() !== owner.toString()) {
      return {
        httpStatusCode: 403,
        message: "Unauthorized access to todo",
      };
    }

    if (updates.title !== undefined) updateTodo.title = updates.title;
    if (updates.description !== undefined)
      updateTodo.description = updates.description;
    if (updates.completed !== undefined)
      updateTodo.completed = updates.completed;

    await updateTodo.save();

    const filteredTodo: FilteredTodo = {
      _id: updateTodo._id,
      title: updateTodo.title,
      description: updateTodo.description,
      completed: updateTodo.completed,
      owner: updateTodo.owner,
    };

    return {
      httpStatusCode: 200,
      message: "Todo updated successfully",
      data: filteredTodo,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, updateTodo: " + error.message);
    } else {
      console.error("todoService, updateTodo: " + error);
    }
    return {
      httpStatusCode: 500,
      message: "Internal server error",
    };
  }
};

const deleteTodoByID = async function (
  params: ListTodoByOwnerRequest
): Promise<DeleteResponse> {
  const { owner, todoId } = params;

  try {
    let searchTodo = await Todo.findById(todoId).exec();

    if (!searchTodo) {
      return {
        httpStatusCode: 404,
        message: "Todo not found",
      };
    }

    if (searchTodo.owner.toString() !== owner.toString()) {
      return {
        httpStatusCode: 403,
        message: "Unauthorized access to todo",
      };
    }

    await searchTodo.deleteOne();

    return {
      httpStatusCode: 200,
      message: "Todo deleted successfully",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, deleteTodo: " + error.message);
    } else {
      console.error("todoService, deleteTodo: " + error);
    }
    return {
      httpStatusCode: 500,
      message: "Internal server error",
    };
  }
};

export default {
  listTodos,
  listTodoByID,
  createTodo,
  updateTodoByID,
  deleteTodoByID,
};
