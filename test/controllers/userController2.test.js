const sinon = require("sinon");
const {
  mockUser,
  mockUserInvalid,
  mockUserUpdate,
  mockUserDelete,
} = require("../mocks/user.mock");
const userController = require("../../api/controllers/userController");

describe("userController Unit Test", () => {
  describe("register method", () => {
    let req, res, json, sandbox, signUpUserStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should register a new user", async () => {
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

      signUpUserStub = sandbox.stub().resolves({
        httpStatusCode: 200,
        message: "User created successfully",
        user: mockUser,
      });

      await userController.register(req, res, signUpUserStub);

      const { password, ...filteredMockUser } = mockUser._doc;

      sinon.assert.calledOnce(signUpUserStub);
      sinon.assert.calledWith(signUpUserStub, req.body);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "User created successfully",
        newUser: filteredMockUser,
      });
    });

    it("should restrict to register an existing user", async () => {
      req = {
        body: {
          name: mockUserInvalid.name,
          email: mockUserInvalid.email,
          password: mockUserInvalid.password,
          age: mockUserInvalid.age,
        },
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });

      signUpUserStub = sandbox.stub().resolves({
        httpStatusCode: 400,
        message: "Email already exists",
      });

      await userController.register(req, res, signUpUserStub);

      sinon.assert.calledOnce(signUpUserStub);
      sinon.assert.calledWith(signUpUserStub, req.body);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 400);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "Email already exists",
      });
    });
  });
});
