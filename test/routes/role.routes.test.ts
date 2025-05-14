import request from "supertest";
import express from "express";

// Mock middleware
jest.mock("@middleware/authorize", () => () => (req: any, res: any, next: any) => next());
jest.mock("@middleware/validator", () => ({
  createRoleRules: [(req: any, res: any, next: any) => next()],
  updateRoleRules: [(req: any, res: any, next: any) => next()],
}));
jest.mock("@middleware/validationResults", () => (req: any, res: any, next: any) => next());

// Mock controller factory and its methods
const mockGetRolesHandler = jest.fn((req: any, res: any) => res.status(200).json({ message: "getRolesHandler called" }));
const mockGetRoleHandler = jest.fn((req: any, res: any) => res.status(200).json({ message: "getRoleHandler called" }));
const mockNewRoleHandler = jest.fn((req: any, res: any) => res.status(201).json({ message: "newRoleHandler called" }));
const mockUpdateRoleHandler = jest.fn((req: any, res: any) => res.status(200).json({ message: "updateRoleHandler called" }));
const mockDeleteRoleHandler = jest.fn((req: any, res: any) => res.status(200).json({ message: "deleteRoleHandler called" }));

jest.mock("@controllers/roleController", () => () => ({
  getRolesHandler: mockGetRolesHandler,
  getRoleHandler: mockGetRoleHandler,
  newRoleHandler: mockNewRoleHandler,
  updateRoleHandler: mockUpdateRoleHandler,
  deleteRoleHandler: mockDeleteRoleHandler,
}));

import roleRouter from "@/api/routes/role.routes";

const app = express();
app.use(express.json());
app.use("/roles", roleRouter);

afterEach(() => {
  jest.clearAllMocks();
});

describe("Role Router", () => {
  it("should call getRolesHandler on GET /roles/list", async () => {
    const response = await request(app).get("/roles/list");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("getRolesHandler called");
    expect(mockGetRolesHandler).toHaveBeenCalledTimes(1);
  });

  it("should call getRoleHandler on GET /roles/role/:id", async () => {
    const response = await request(app).get("/roles/role/123");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("getRoleHandler called");
    expect(mockGetRoleHandler).toHaveBeenCalledTimes(1);
  });

  it("should call newRoleHandler on POST /roles/create", async () => {
    const response = await request(app)
      .post("/roles/create")
      .send({ name: "admin", description: "desc", permissions: ["users"] });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("newRoleHandler called");
    expect(mockNewRoleHandler).toHaveBeenCalledTimes(1);
  });

  it("should call updateRoleHandler on PATCH /roles/update/:id", async () => {
    const response = await request(app)
      .patch("/roles/update/123")
      .send({ name: "admin", description: "desc", status: true, permissions: ["users"] });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("updateRoleHandler called");
    expect(mockUpdateRoleHandler).toHaveBeenCalledTimes(1);
  });

  it("should call deleteRoleHandler on DELETE /roles/delete/:id", async () => {
    const response = await request(app).delete("/roles/delete/123");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("deleteRoleHandler called");
    expect(mockDeleteRoleHandler).toHaveBeenCalledTimes(1);
  });
}); 