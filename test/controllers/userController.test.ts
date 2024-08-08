import {
mockUserRoleUser,
mockUserInvalid,
mockUserUpdate,
mockUserDelete,
mockUserRoleAdmin,
} from "../mocks/user.mock";
import {
  UserRequest,
  UserIdRequest,
  LoginRequest,
  UpdateUserRequest,
  UserServices,
} from "../../src/types/user.interface";
import userController from "../../src/api/controllers/userController";

describe("userController Unit Test", () => {
  let req: { body?: UserRequest};
  let res: { status?: jest.Mock };
  let json: jest.Mock;
  let signUpUserStub: jest.Mock;
  let controller: ReturnType<typeof userController>;
  let mockUserService: UserServices;

  beforeEach(() => {
    req = {};
    json = jest.fn();
    res = {
      status : jest.fn().mockReturnValue({ json }),
    };

  signUpUserStub = jest.fn().mockResolvedValue({
    httpStatusCode: 200,
    message: "User created successfully",
    user: mockUserRoleUser,
  });

  mockUserService = {
    signUpUser: signUpUserStub,
    loginUser: jest.fn(),
    logoutUser: jest.fn(),
    listUserByID: jest.fn(),
    updateUserDetailsByID: jest.fn(),
    updateUserPasswordByID: jest.fn(),
    deleteUserByID: jest.fn(),
  };

  controller = userController(mockUserService);  
});
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("register method", () => {
    it.only("should register a new user", async () => {
      const { _id, ...userWithoutId} = mockUserRoleUser;
      req.body = userWithoutId;

      await controller.registerHandler(req, res);

      const { password, ...filteredMockUser } = mockUserRoleUser;

     expect(signUpUserStub).toHaveBeenCalledTimes(1);
      expect(signUpUserStub).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
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

      userController.setSignUpUser(signUpUserStub);

      await userController.registerHandler(req, res);

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
          email: mockUserUser.email,
          password: mockUserUser.password,
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
        user: mockUserUser,
        token: "token",
      });

      userController.setLoginUser(loginStub);

      await userController.loginHandler(req, res);

      const { password, ...filteredMockUser } = mockUserUser._doc;

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

      userController.setLoginUser(loginStub);

      await userController.loginHandler(req, res);

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

      await userController.logoutHandler(req, res);

      sinon.assert.calledOnce(res.clearCookie);
      sinon.assert.calledWith(res.clearCookie, "nodetodo");
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);
    });
  });

  describe("listUser method", () => {
    let req, res, json, cookie, sandbox, getMeStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should get details of a valid user", async () => {
      req = {
        user: mockUserUser,
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });
      res.cookie = cookie;

      getMeStub = sandbox.stub().resolves({
        httpStatusCode: 200,
        message: "User Found",
        user: mockUserUser,
      });

      userController.setListUser(getMeStub);

      await userController.listUserHandler(req, res);

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

      userController.setListUser(getMeStub);

      await userController.listUserHandler(req, res);

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
      const expectedUpdateProperties = {
        name: mockUserUpdate.name,
        email: mockUserUpdate.email,
        age: mockUserUpdate.age,
      };

      req = {
        user: mockUserUser,
        body: expectedUpdateProperties,
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });
      res.cookie = cookie;

      updateDetailsStub = sandbox.stub().resolves({
        httpStatusCode: 200,
        message: "Data updated successfully",
        user: mockUserUser,
      });

      userController.setUpdateUserDetails(updateDetailsStub);

      await userController.updateUserDetailsHandler(req, res);

      const { password, ...filteredMockUser } = mockUser._doc;

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
      const expectedUpdateProperties = {
        name: mockUserUpdate.name,
        email: mockUserUpdate.email,
        age: mockUserUpdate.age,
      };

      req = {
        user: mockUserInvalid,
        body: expectedUpdateProperties,
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });
      res.cookie = cookie;

      updateDetailsStub = sandbox.stub().resolves({
        httpStatusCode: 404,
        message: "User Not Found",
      });

      userController.setUpdateUserDetails(updateDetailsStub);

      await userController.updateUserDetailsHandler(req, res);

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

  describe("updatePassword method", () => {
    let req, res, json, cookie, sandbox, updatePasswordStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should update password of a valid user", async () => {
      const expectedUpdateProperties = {
        password: mockUserUpdate.oldPassword,
        newPassword: mockUserUpdate.newPassword,
      };

      req = {
        user: mockUserUser,
        body: expectedUpdateProperties,
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });
      res.cookie = cookie;

      updatePasswordStub = sandbox.stub().resolves({
        httpStatusCode: 200,
        message: "Password updated successfully",
        user: mockUserUser,
      });

      userController.setUpdateUserPassword(updatePasswordStub);

      await userController.updateUserPasswordHandler(req, res);

      const { password, ...filteredMockUser } = mockUserUser._doc;

      sinon.assert.calledOnce(updatePasswordStub);
      sinon.assert.calledWith(updatePasswordStub, req.user, req.body);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "Password updated successfully",
        updatedUser: filteredMockUser,
      });
    });

    it("should restrict to update password of an invalid user", async () => {
      const expectedUpdateProperties = {
        password: mockUserUpdate.oldPassword,
        newPassword: mockUserUpdate.newPassword,
      };

      req = {
        user: mockUserInvalid,
        body: expectedUpdateProperties,
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });
      res.cookie = cookie;

      updatePasswordStub = sandbox.stub().resolves({
        httpStatusCode: 404,
        message: "User Not Found",
      });

      userController.setUpdateUserPassword(updatePasswordStub);

      await userController.updateUserPasswordHandler(req, res);

      sinon.assert.calledOnce(updatePasswordStub);
      sinon.assert.calledWith(updatePasswordStub, req.user, req.body);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 404);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "User Not Found",
      });
    });

    it("should restrict to update password of a valid user with incorrect password", async () => {
      const expectedUpdateProperties = {
        password: mockUserUpdate.notMatchPassword,
        newPassword: mockUserUpdate.newPassword,
      };

      req = {
        user: mockUserUser,
        body: expectedUpdateProperties,
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });
      res.cookie = cookie;

      updatePasswordStub = sandbox.stub().resolves({
        httpStatusCode: 400,
        message: "The entered credentials are not valid",
      });

      userController.setUpdateUserPassword(updatePasswordStub);

      await userController.updateUserPasswordHandler(req, res);

      sinon.assert.calledOnce(updatePasswordStub);
      sinon.assert.calledWith(updatePasswordStub, req.user, req.body);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 400);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "The entered credentials are not valid",
      });
    });
  });

  describe("deleteUser method", () => {
    let req, res, sandbox, cookie, deleteUserStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should delete a valid user", async () => {
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

      userController.setDeleteUser(deleteUserStub);

      await userController.deleteUserHandler(req, res);

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

    it("should restrict to delete an invalid user", async () => {
      req = {
        user: {
          id: mockUserInvalid._id,
        },
      };
      res = {
        status: sandbox.stub().returns({ json: sandbox.spy() }),
        cookie: cookie,
        clearCookie: sandbox.spy(),
      };

      deleteUserStub = sandbox.stub().resolves({
        httpStatusCode: 404,
        message: "User Not Found",
      });

      userController.setDeleteUser(deleteUserStub);

      await userController.deleteUserHandler(req, res);

      sinon.assert.calledOnce(deleteUserStub);
      sinon.assert.calledWith(deleteUserStub, req.user);
      sinon.assert.notCalled(res.clearCookie);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 404);
      sinon.assert.calledOnce(res.status().json);
      sinon.assert.calledWith(res.status().json, {
        resultMessage: "User Not Found",
      });
    });
  });
});
