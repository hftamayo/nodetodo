import Sinon from "sinon";
import { expect } from "chai";
import { register } from "../../api/controllers/userController.js";
import * as userService from "../../services/userService.js";
import {
  mockUser,
  mockUserInvalid,
  mockUserUpdate,
  mockUserDelete,
} from "../mocks/user.mock.js";

describe("userController", () => {
  describe("register", () => {
    afterEach(() => {
      Sinon.restore();
    });

    it("should register a new user", async () => {
      const req = {
        body: {
          name: mockUser.name,
          email: mockUser.email,
          password: mockUser.password,
          age: mockUser.age,
        },
      };
      const res = { status: Sinon.stub(), json: Sinon.stub() };

      Sinon.stub(userService, "signUpUser").resolves({
        httpStatusCode: 200,
        message: "User created successfully",
        user: mockUser,
      });

      await register(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(
        mockRes.json.calledWith({
          resultMessage: "User created successfully",
          newUser: mockUser,
        })
      ).to.be.true;
    });
  });
});
