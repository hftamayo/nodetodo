const sinon = require("sinon");
const proxyquire = require("proxyquire");
const {
  mockUser,
  mockUserInvalid,
  mockUserUpdate,
  mockUserDelete,
} = require("../mocks/user.mock");
const userController = require("../../api/controllers/userController");
const userService = require("../../services/userService");

describe("userController Unit Test", () => {
  describe("register method", () => {
    let req, res, json, sandbox, userServiceStub, userController;

    beforeEach(() => {
      sandbox = sinon.createSandbox();

      req = {
        body: {
          name: mockUser.name,
          email: mockUser.email,
          password: mockUser.password,
          age: mockUser.age,
        },
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });

      userServiceStub = {
        signUpUser: sandbox.stub().resolves({
          httpStatusCode: 200,
          message: "User created successfully",
          user: mockUser,
        }),
      };

      userController = proxyquire("../../api/controllers/userController", {
        "../../services/userService": userServiceStub,
      });
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should register a new user", async function () {
      this.timeout(40000);
      await userController.register(req, res);

      sinon.assert.calledOnce(userService.signUpUser);
      sinon.assert.calledWith(userService.signUpUser, req.body);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "User created successfully",
        newUser: mockUser,
      });
    });
  });
});
