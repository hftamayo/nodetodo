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

  describe("logout method", () => {
    let req, res, clearCookie, sandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should logout a user", async () => {
      req = {};
      res = {};
      clearCookie = sandbox.spy();
      res.status = sandbox.stub().returns({ json: sandbox.spy() });
      res.clearCookie = clearCookie;

      await userController.logout(req, res);

      sinon.assert.calledOnce(res.clearCookie);
      sinon.assert.calledWith(res.clearCookie, "nodetodo");
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);
    });
  });

  describe("getMe method", () => {
    let req, res, json, cookie, sandbox, getMeStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should get details of a valid user", async () => {
      req = {
        user: mockUser,
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });
      res.cookie = cookie;

      getMeStub = sandbox.stub().resolves({
        httpStatusCode: 200,
        message: "User Found",
        user: mockUser,
      });

      await userController.getMe(req, res, getMeStub);

      const { password, ...filteredMockUser } = mockUser._doc;

      sinon.assert.calledOnce(getMeStub);
      sinon.assert.calledWith(getMeStub, req.user);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "User Found",
        searchUser: filteredMockUser,
      });
    });

    it("should restrict to get details of an invalid user", async () => {
      req = {
        user: mockUserInvalid,
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });
      res.cookie = cookie;

      getMeStub = sandbox.stub().resolves({
        httpStatusCode: 404,
        message: "User Not Found",
      });

      await userController.getMe(req, res, getMeStub);

      sinon.assert.calledOnce(getMeStub);
      sinon.assert.calledWith(getMeStub, req.user);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 404);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "User Not Found",
      });
    });
  });

  describe("updateDetails method", () => {
    let req, res, json, cookie, sandbox, updateDetailsStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should update details of a valid user", async () => {
      req = {
        user: mockUser,
        body: mockUserUpdate,
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });
      res.cookie = cookie;

      updateDetailsStub = sandbox.stub().resolves({
        httpStatusCode: 200,
        message: "Data updated successfully",
        user: {
          _doc: {
            ...mockUserUpdate,
            password: mockUserUpdate.oldPassword,
          },
        },
      });

      await userController.updateDetails(req, res, updateDetailsStub);

      const { password, ...filteredMockUser } = mockUserUpdate._doc;

      sinon.assert.calledOnce(updateDetailsStub);
      sinon.assert.calledWith(updateDetailsStub, req.user, req.body);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "Data updated successfully",
        updatedUser: filteredMockUser,
      });
    });

    it("should restrict to update details of an invalid user", async () => {
      req = {
        user: mockUserInvalid,
        body: mockUserUpdate,
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });
      res.cookie = cookie;

      updateDetailsStub = sandbox.stub().resolves({
        httpStatusCode: 404,
        message: "User Not Found",
      });

      await userController.updateDetails(req, res, updateDetailsStub);

      sinon.assert.calledOnce(updateDetailsStub);
      sinon.assert.calledWith(updateDetailsStub, req.user, req.body);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 404);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "User Not Found",
      });
    });
  });

  describe("updatePassword method", () => {});

  describe("deleteUser method", () => {
    let req, res, json, sandbox, cookie, clearCookie, deleteUserStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it.only("should delete a valid user", async () => {
      req = {
        user: {
          id: mockUserDelete._id,
        },
      };
      res = {
        status: sandbox.stub().returns({ json: sandbox.spy() }),
        cookie: cookie,
        clearCookie: sandbox.spy(),
      };

      deleteUserStub = sandbox.stub().resolves({
        httpStatusCode: 200,
        message: "User deleted successfully",
      });

      await userController.deleteUser(req, res, deleteUserStub);

      sinon.assert.calledOnce(deleteUserStub);
      sinon.assert.calledWith(deleteUserStub, req.user);
      sinon.assert.calledOnce(res.clearCookie);
      sinon.assert.calledWith(res.clearCookie, "nodetodo");
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledOnce(res.status().json);
      sinon.assert.calledWith(res.status().json, {
        resultMessage: "User deleted successfully",
      });
    });
  });
});
