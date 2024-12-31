import request from "supertest";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import authorize from "../../src/api/middleware/authorize";

jest.mock("jsonwebtoken");
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

const app = express();
app.use(express.json());

app.get("/protected", authorize, (req: Request, res: Response) => {
  res.status(200).json({ message: "Authorized" });
});

describe("authorize Middleware", () => {
  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/protected").send();

    expect(response.status).toBe(401);
    expect(response.body.resultMessage).toBe(
      "Not authorized, please login first"
    );
  });

  it("should return 500 if masterKey is not set", async () => {
    jest.spyOn(process.env, "MASTER_KEY", "get").mockReturnValue(undefined);

    const response = await request(app)
      .get("/protected")
      .set("Cookie", "nodetodo=valid-token")
      .send();

    expect(response.status).toBe(500);
    expect(response.body.resultMessage).toBe("Internal Server Error");

    jest.spyOn(process.env, "MASTER_KEY", "get").mockRestore();
  });

  it("should return 401 if token is invalid", async () => {
    mockedJwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const response = await request(app)
      .get("/protected")
      .set("Cookie", "nodetodo=invalid-token")
      .send();

    expect(response.status).toBe(401);
    expect(response.body.resultMessage).toBe(
      "Not authorized, please login first"
    );
  });

  it("should return 200 if token is valid", async () => {
    mockedJwt.verify.mockImplementation(() => ({
      searchUser: "user-id",
    }));

    const response = await request(app)
      .get("/protected")
      .set("Cookie", "nodetodo=valid-token")
      .send();

    console.log("response.status:", response.status);
    console.log("response.body:", response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Authorized");
  });
});
