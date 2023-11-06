import { expect } from "chai";
import Sinon from "sinon";
import { register, login } from "../../api/controllers/userController";
import { mockUser } from "../mocks/user.mock";
import {
  signUpUser,
  loginUser,
  listUserByID,
  updateUserByID,
  updateUserPassword,
  deleteUserByID,
} from "../../services/userService";

describe("User Controller", () => {
  afterEach(() => {
    Sinon.restore();
  });

  it("should register successfully a new user", async () => {
    const mockReq = {
      body: {
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
        age: mockUser.age,
      },
    };

    const mockRes = {
      status: Sinon.stub(),
      json: Sinon.stub(),
    };

    Sinon.stub(signUpUser).resolves({
      httpStatusCode: 200,
      message: "User created successfully",
      user: mockUser,
    });

    await register(mockReq, mockRes);

    expect(mockRes.status.calledWith(200)).to.be.true;
    expect(
      mockRes.json.calledWith({
        resultMessage: "User created successfully",
        newUser: mockUser,
      })
    ).to.be.true;
  });

  it("should restrict to register an existing user", async () => {
    const mockReq = {
      body: {
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
        age: mockUser.age,
      },
    };

    const mockRes = {
      status: Sinon.stub(),
      json: Sinon.stub(),
    };

    const mockError = new Error("User already exists");

    Sinon.stub(signUpUser).rejects(mockError);

    await register(mockReq, mockRes);

    expect(mockRes.status.calledWith(400)).to.be.true;
    expect(
      mockRes.json.calledWith({
        resultMessage: "User already exists",
      })
    ).to.be.true;
  });
});
