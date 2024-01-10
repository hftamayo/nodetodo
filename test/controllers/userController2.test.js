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
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should register a new user", async function () {
      this.timeout(40000);
      await userController.register(req, res, signUpUserStub);

      sinon.assert.calledOnce(signUpUserStub);
      sinon.assert.calledWith(signUpUserStub, req.body);
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
