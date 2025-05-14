import seedTodos from "@/utils/seedTodos";
import Todo from "@models/Todo";
import seedUsers from "@/utils/seedUsers";
import mongoose from "mongoose";

jest.mock("@models/Todo");
jest.mock("@/utils/seedUsers");

const mockSession = {} as mongoose.ClientSession;

const mockUsers = [
  { _id: "user1", email: "bob@tamayo.com" },
  { _id: "user2", email: "mary@tamayo.com" },
];

describe("seedTodos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (seedUsers as jest.Mock).mockResolvedValue(mockUsers);
  });

  it("should delete all todos and create new ones", async () => {
    (Todo.deleteMany as jest.Mock).mockReturnValue({
      session: jest.fn().mockResolvedValue(undefined),
    });
    (Todo.create as jest.Mock).mockResolvedValue([
      { _id: "todo1", title: "Foreign language class" },
    ]);
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    await seedTodos(mockSession);

    expect(seedUsers).toHaveBeenCalledWith(mockSession);
    expect(Todo.deleteMany).toHaveBeenCalledWith({});
    expect(Todo.create).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Todos created: ") ?? expect.anything()
    );
    consoleSpy.mockRestore();
  });

  it("should handle errors and log them", async () => {
    (Todo.deleteMany as jest.Mock).mockImplementation(() => {
      throw new Error("delete error");
    });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    await seedTodos(mockSession);
    expect(consoleSpy).toHaveBeenCalledWith("seedTodos: ", "delete error");
    consoleSpy.mockRestore();
  });

  it("should throw if users are not found", async () => {
    (seedUsers as jest.Mock).mockResolvedValue(undefined);
    await expect(seedTodos(mockSession)).rejects.toThrow(
      "Users not found in the database"
    );
  });

  it("should throw if user Bob is not found", async () => {
    (seedUsers as jest.Mock).mockResolvedValue([
      { _id: "user2", email: "mary@tamayo.com" },
    ]);
    await expect(seedTodos(mockSession)).rejects.toThrow(
      "User Bob not found in the database"
    );
  });
});
