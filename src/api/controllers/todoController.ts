import { Response } from "express";
import {
  ListTodosByOwnerRequest,
  ListTodoByOwnerRequest,
  NewTodoRequest,
  UpdateTodoRequest,
  EntityResponse,
  EntitiesResponse,
  DeleteResponse,
  TodoServices,
} from "@/types/todo.types";
import { TodosResponseDTO } from "@/dto/todos/todosResponse.dto";
import { CrudOperationResponseDto } from "@/dto/crudOperationResponse.dto";
import { ErrorResponseDTO } from "@/dto/ErrorResponse.dto";

export default function todoController(todoService: TodoServices) {
  return {
    getTodosHandler: async function (
      req: ListTodosByOwnerRequest,
      res: Response
    ) {
      try {
        const { page, limit, owner, activeOnly } = req;
        const listTodosByOwnerRequest: ListTodosByOwnerRequest = {
          page,
          limit,
          owner,
          activeOnly,
        };
        const result: EntitiesResponse = await todoService.listTodos(listTodosByOwnerRequest);
        const { httpStatusCode, message, data } = result;
        if (!data || !Array.isArray(data) || data.length === 0) {
          return res.status(httpStatusCode).json(
            new ErrorResponseDTO({ code: httpStatusCode, resultMessage: message })
          );
        }
        const shapedDataList = data.map(todo => new TodosResponseDTO(todo));
        res.status(httpStatusCode).json(
          new CrudOperationResponseDto({ code: httpStatusCode, resultMessage: message, dataList: shapedDataList })
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("todoController, getTodos: " + error.message);
        } else {
          console.error("todoController, getTodos: " + error);
        }
      }
    },

    getTodoHandler: async function (
      req: ListTodoByOwnerRequest,
      res: Response
    ) {
      try {
        const result: EntityResponse = await todoService.listTodoByID(req);
        const { httpStatusCode, message, data } = result;
        if (!data) {
          return res.status(httpStatusCode).json(
            new ErrorResponseDTO({ code: httpStatusCode, resultMessage: message })
          );
        }
        const shapedData = new TodosResponseDTO(data);
        res.status(httpStatusCode).json(
          new CrudOperationResponseDto({ code: httpStatusCode, resultMessage: message, data: shapedData })
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("todoController, getTodo: " + error.message);
        } else {
          console.error("todoController, getTodo: " + error);
        }
      }
    },

    newTodoHandler: async function (req: NewTodoRequest, res: Response) {
      try {
        const result: EntityResponse = await todoService.createTodo(req);
        const { httpStatusCode, message, data } = result;
        if (!data) {
          return res.status(httpStatusCode).json(
            new ErrorResponseDTO({ code: httpStatusCode, resultMessage: message })
          );
        }
        const shapedData = new TodosResponseDTO(data);
        res.status(httpStatusCode).json(
          new CrudOperationResponseDto({ code: httpStatusCode, resultMessage: message, data: shapedData })
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("todoController, newTodo: " + error.message);
        } else {
          console.error("todoController, newTodo: " + error);
        }
      }
    },

    updateTodoHandler: async function (req: UpdateTodoRequest, res: Response) {
      try {
        const result: EntityResponse = await todoService.updateTodoByID(req);
        const { httpStatusCode, message, data } = result;
        if (!data) {
          return res.status(httpStatusCode).json(
            new ErrorResponseDTO({ code: httpStatusCode, resultMessage: message })
          );
        }
        const shapedData = new TodosResponseDTO(data);
        res.status(httpStatusCode).json(
          new CrudOperationResponseDto({ code: httpStatusCode, resultMessage: message, data: shapedData })
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("todoController, updateTodo: " + error.message);
        } else {
          console.error("todoController, updateTodo: " + error);
        }
      }
    },

    deleteTodoHandler: async function (
      req: ListTodoByOwnerRequest,
      res: Response
    ) {
      try {
        const result: DeleteResponse = await todoService.deleteTodoByID(req);
        const { httpStatusCode, message } = result;
        res.status(httpStatusCode).json(
          new CrudOperationResponseDto({ code: httpStatusCode, resultMessage: message })
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("todoController, deleteTodo: " + error.message);
        } else {
          console.error("todoController, deleteTodo: " + error);
        }
      }
    },
  };
}
