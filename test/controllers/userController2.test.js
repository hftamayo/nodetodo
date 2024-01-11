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

  describe("login method", () => {
    let req, res, json, cookie, sandbox, loginStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should login a valid user", async () => {
      req = {
        body: {
          email: mockUser.email,
          password: mockUser.password,
        },
      };
      res = {};
      json = sandbox.spy();
      cookie = sandbox.spy();
      res.status = sandbox.stub().returns({ json });
      res.cookie = cookie;

      loginStub = sandbox.stub().resolves({
        httpStatusCode: 200,
        tokenCreated: "token",
        message: "User login successfully",
        user: mockUser,
        token: "token",
      });

      await userController.login(req, res, loginStub);

      const { password, ...filteredMockUser } = mockUser._doc;

      sinon.assert.calledOnce(loginStub);
      sinon.assert.calledWith(loginStub, req.body);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "User login successfully",
        loggedUser: filteredMockUser,
      });
      sinon.assert.calledOnce(cookie);
      sinon.assert.calledWith(cookie, "nodetodo", "token", {
        httpOnly: true,
        expiresIn: 360000,
      });
    });

    it("should restrict login an invalid user", async () => {
      req = {
        body: {
          email: mockUserInvalid.email,
          password: mockUserInvalid.password,
        },
      };
      res = {};
      json = sandbox.spy();
      cookie = sandbox.spy();
      res.status = sandbox.stub().returns({ json });
      res.cookie = cookie;

      loginStub = sandbox.stub().resolves({
        httpStatusCode: 404,
        message: "User or Password does not match",
      });

      await userController.login(req, res, loginStub);


      sinon.assert.calledOnce(loginStub);
      sinon.assert.calledWith(loginStub, req.body);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 404);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "User or Password does not match",
      });


    });
    


  });
});
