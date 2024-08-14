import { Request, Response } from "express";
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
import { cookie } from "express-validator";

describe("userController Unit Test", () => {
  let req: UserRequest | LoginRequest | Request | UserIdRequest;
  let res: Response<any, Record<string, any>>;
  let json: jest.Mock;
  let signUpUserStub: jest.Mock<any, any, any>;
  let loginStub: jest.Mock<any, any, any>;
  let logoutStub: jest.Mock<any, any, any>;
  let listUserByIDStub: jest.Mock<any, any, any>;
  let deleteUserByIDStub: jest.Mock<any, any, any>;
  let controller: ReturnType<typeof userController>;
  let mockUserService: UserServices;

  beforeEach(() => {
    req = {} as UserRequest | LoginRequest | Request | UserIdRequest;
    json = jest.fn();
    res = {
      status : jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response<any, Record<string, any>>;

  signUpUserStub = jest.fn((user) => {
    if(user === mockUserInvalid) {
      return Promise.resolve({
        httpStatusCode: 400,
        message: "Email already exists",
      });
    }
    return Promise.resolve({
    httpStatusCode: 200,
    message: "User created successfully",
    user: mockUserRoleUser,
  });
});

  loginStub = jest.fn((user) => {
    if(user.email === mockUserInvalid.email) {
      return Promise.resolve({
        httpStatusCode: 404,
        message: "User or Password does not match",
      });
    }
    return Promise.resolve({
      httpStatusCode: 200,
      message: "User login successfully",
      user: mockUserRoleUser,
      tokenCreated: "token",
      token: "token",
    });
  });

  logoutStub = jest.fn(() => {
    return Promise.resolve({
      httpStatusCode: 200,
      message: "User logged out successfully",
    });
  });  

  listUserByIDStub = jest.fn((user) => {
    if(user.id === mockUserInvalid.id) {
      return Promise.resolve({
        httpStatusCode: 404,
        message: "User Not Found",
      });
    }
    return Promise.resolve({
      httpStatusCode: 200,
      message: "User Found",
      user: mockUserRoleUser,
    });
  });

  deleteUserByIDStub = jest.fn((user) => {
    if(user.id === mockUserInvalid.id) {
      return Promise.resolve({
        httpStatusCode: 404,
        message: "User Not Found",
      });
    }
    return Promise.resolve({
      httpStatusCode: 200,
      message: "User deleted successfully",
    });
  });


  mockUserService = {
    signUpUser: signUpUserStub,
    loginUser: loginStub,
    logoutUser: logoutStub,
    listUserByID: listUserByIDStub,
    updateUserDetailsByID: jest.fn(),
    updateUserPasswordByID: jest.fn(),
    deleteUserByID: deleteUserByIDStub,
  };

  controller = userController(mockUserService);  
});
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("register method", () => {
    it.only("should register a new user", async () => {
      const { _id, ...userWithoutId} = mockUserRoleUser;
      req = userWithoutId as UserRequest;

      await controller.registerHandler(req as UserRequest, res);

      const { password, ...filteredMockUser } = mockUserRoleUser;

     expect(signUpUserStub).toHaveBeenCalledTimes(1);
      expect(signUpUserStub).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "User created successfully",
        newUser: filteredMockUser,
      });
    });

    it("should restrict to register an existing user", async () => {
      req = mockUserInvalid as UserRequest;

      await controller.registerHandler(req as UserRequest, res);

      expect(signUpUserStub).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "Email already exists",
      });
    });
  });

  describe("login method", () => {
    it("should login a valid user", async () => {
      const {email, password} = mockUserRoleUser;
      req = {email, password } as LoginRequest;

      await controller.loginHandler(req, res);

      const { password: _, ...filteredMockUser } = mockUserRoleUser;

      expect(loginStub).toHaveBeenCalledTimes(1);
      expect(loginStub).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "User login successfully",
        loggedUser: filteredMockUser,
      });
      expect(cookie).toHaveBeenCalledTimes(1);
      expect(cookie).toHaveBeenCalledWith("nodetodo", "token",{
        httpOnly: true,
        expiresIn: 360000,
      });

    it("should restrict login an invalid user", async () => {
      const {email, password} = mockUserInvalid;
      req = {email, password } as LoginRequest;

      await controller.loginHandler(req, res);

      expect(loginStub).toHaveBeenCalledTimes(1);
      expect(loginStub).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "User or Password does not match",
      });
    });
  });

  describe("logout method", () => {
    it("should logout a user", async () => {
      await controller.logoutHandler(req as Request, res);

      expect(res.clearCookie).toHaveBeenCalledTimes(1);
      expect(res.clearCookie).toHaveBeenCalledWith("nodetodo");
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("listUser method", () => {
    it("should get details of a valid user", async () => {
      const userId = mockUserRoleUser._id.toString();
      req = {userId} as UserIdRequest;

      await controller.listUserHandler(req, res);

      const { password, ...filteredMockUser } = mockUserRoleUser;

      expect(listUserByIDStub).toHaveBeenCalledTimes(1);
      expect(listUserByIDStub).toHaveBeenCalledWith(userId);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "User Found",
        searchUser: filteredMockUser,
      });
    });

    it("should restrict to get details of an invalid user", async () => {
      const userId = mockUserInvalid.id;
      req = {userId} as UserIdRequest;

      await controller.listUserHandler(req, res);

      expect(listUserByIDStub).toHaveBeenCalledTimes(1);
      expect(listUserByIDStub).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "User Not Found",
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

      expect(updateDetailsStub).toHaveBeenCalledTimes(1);
      expect(updateDetailsStub).toHaveBeenCalledWith(200);
      expect(updateDetailsStub).toHaveBeenCalledWith(mockUserRoleUser, expectedUpdateProperties);
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
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

      expect(updateDetailsStub).toHaveBeenCalledTimes(1);
      expect(updateDetailsStub).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
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
    it("should delete a valid user", async () => {
      const userId = mockUserDelete.id;
      req = {userId} as UserIdRequest;

      await controller.deleteUserHandler(req, res);

      expect(deleteUserByIDStub).toHaveBeenCalledTimes(1);
      expect(deleteUserByIDStub).toHaveBeenCalledWith(userId);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "User deleted successfully",
      });
    });

    it("should restrict to delete an invalid user", async () => {
      const userId = mockUserInvalid.id;
      req = {userId} as UserIdRequest;

      await controller.deleteUserHandler(req, res);

      expect(deleteUserByIDStub).toHaveBeenCalledTimes(1);
      expect(deleteUserByIDStub).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "User Not Found",
      });
    });
  });
});
