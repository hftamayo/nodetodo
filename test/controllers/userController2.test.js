const sinon = require("sinon");
const { expect } = require("chai");
const {
  mockUser,
  mockUserInvalid,
  mockUserUpdate,
  mockUserDelete,
} = require("../mocks/user.mock");
const User = require("../../models/User");
const userController = require("../../api/controllers/userController");
const userService = require("../../services/userService");

describe("userController", () => {
  describe("register", () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should register a new user", async function () {
      this.timeout(40000);
      const req = {
        body: {
          name: mockUser.name,
          email: mockUser.email,
          password: mockUser.password,
          age: mockUser.age,
        },
      };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub(),
      };

      const mockUserInstance = {
        save: sandbox.stub().resolves(mockUser),
      };

      sandbox.stub(User, "findOne").returns({
        exec: sandbox.stub().resolves(mockUser),
      });

      sandbox.stub(User, "create").resolves(mockUserInstance);

      sandbox.stub(userService, "signUpUser").resolves({
        httpStatusCode: 200,
        message: "User created successfully",
        user: mockUser,
      });

      await userController.register(req, res);

      console.log(res.status);
      console.log(res.json);

      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledOnce(res.json);
      sinon.assert.calledWith(res.json, {
        resultMessage: "User created successfully",
        newUser: mockUser,
      });
    });
  });
});
