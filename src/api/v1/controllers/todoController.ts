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
import { TodosResponseDTO } from "@/api/v1/dto/todos/todosResponse.dto";
import {
  successResponse,
  errorResponse,
} from "@/utils/endpoints/apiMakeResponse";
import { EndpointResponseDto } from "@/api/v1/dto/EndpointResponse.dto";

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
        const result: EntitiesResponse = await todoService.listTodos(
          listTodosByOwnerRequest
        );
        const { httpStatusCode, message, data } = result;
        if (!data || !Array.isArray(data) || data.length === 0) {
          const errorResp = errorResponse(httpStatusCode, message);
          return res.status(httpStatusCode).json(errorResp);
        }
        const shapedDataList = data.map((todo) => new TodosResponseDTO(todo));
        // Using EndpointResponseDto<TodosResponseDTO> for type safety
        const response: EndpointResponseDto<TodosResponseDTO> = successResponse(
          undefined,
          shapedDataList,
          httpStatusCode,
          message
        );
        res.status(httpStatusCode).json(response);
      } catch (error: unknown) {
        const errorResp = errorResponse(
          500,
          "Internal server error",
          error instanceof Error ? error.message : String(error)
        );
        return res.status(500).json(errorResp);
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
          const errorResp = errorResponse(httpStatusCode, message);
          return res.status(httpStatusCode).json(errorResp);
        }
        const shapedData = new TodosResponseDTO(data);
        // Using EndpointResponseDto<TodosResponseDTO> for type safety
        const response: EndpointResponseDto<TodosResponseDTO> = successResponse(
          shapedData,
          undefined,
          httpStatusCode,
          message
        );
        res.status(httpStatusCode).json(response);
      } catch (error: unknown) {
        const errorResp = errorResponse(
          500,
          "Internal server error",
          error instanceof Error ? error.message : String(error)
        );
        return res.status(500).json(errorResp);
      }
    },

    newTodoHandler: async function (req: NewTodoRequest, res: Response) {
      try {
        const result: EntityResponse = await todoService.createTodo(req);
        const { httpStatusCode, message, data } = result;
        if (!data) {
          const errorResp = errorResponse(httpStatusCode, message);
          return res.status(httpStatusCode).json(errorResp);
        }
        const shapedData = new TodosResponseDTO(data);
        // Using EndpointResponseDto<TodosResponseDTO> for type safety
        const response: EndpointResponseDto<TodosResponseDTO> = successResponse(
          shapedData,
          undefined,
          httpStatusCode,
          message
        );
        res.status(httpStatusCode).json(response);
      } catch (error: unknown) {
        const errorResp = errorResponse(
          500,
          "Internal server error",
          error instanceof Error ? error.message : String(error)
        );
        return res.status(500).json(errorResp);
      }
    },

    updateTodoHandler: async function (req: UpdateTodoRequest, res: Response) {
      try {
        const result: EntityResponse = await todoService.updateTodoByID(req);
        const { httpStatusCode, message, data } = result;
        if (!data) {
          const errorResp = errorResponse(httpStatusCode, message);
          return res.status(httpStatusCode).json(errorResp);
        }
        const shapedData = new TodosResponseDTO(data);
        // Using EndpointResponseDto<TodosResponseDTO> for type safety
        const response: EndpointResponseDto<TodosResponseDTO> = successResponse(
          shapedData,
          undefined,
          httpStatusCode,
          message
        );
        res.status(httpStatusCode).json(response);
      } catch (error: unknown) {
        const errorResp = errorResponse(
          500,
          "Internal server error",
          error instanceof Error ? error.message : String(error)
        );
        return res.status(500).json(errorResp);
      }
    },

    deleteTodoHandler: async function (
      req: ListTodoByOwnerRequest,
      res: Response
    ) {
      try {
        const result: DeleteResponse = await todoService.deleteTodoByID(req);
        const { httpStatusCode, message } = result;
        // Using EndpointResponseDto<null> for delete operations (no data returned)
        const response: EndpointResponseDto<null> = successResponse(
          null,
          undefined,
          httpStatusCode,
          message
        );
        res.status(httpStatusCode).json(response);
      } catch (error: unknown) {
        const errorResp = errorResponse(
          500,
          "Internal server error",
          error instanceof Error ? error.message : String(error)
        );
        return res.status(500).json(errorResp);
      }
    },
  };
}
