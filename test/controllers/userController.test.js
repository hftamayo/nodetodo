import { expect } from "chai";
import Sinon from "sinon";
import {
  register,
  login,
  logout,
  getMe,
} from "../../api/controllers/userController";
import {
  mockUser,
  mockUserInvalid,
  mockUserUpdate,
  mockUserDelete,
} from "../mocks/user.mock";
import {
  signUpUser,
  loginUser,
  listUserByID,
  updateUserByID,
  updateUserPassword,
  deleteUserByID,
} from "../../services/userService";

describe("User Controller Unit Test", () => {
  describe("register method", () => {
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

  describe("login method", () => {
    afterEach(() => {
      Sinon.restore();
    });

    it("should successfully login a user with valid credentials", async () => {
      const mockReq = {
        body: {
          email: mockUser.email,
          password: mockUser.password,
        },
      };

      const mockRes = {
        cookie: sinon.stub(),
        status: sinon.stub(),
        json: sinon.stub(),
      };

      Sinon.stub(userService, loginUser).resolves({
        httpStatusCode: 200,
        tokenCreated: "mockToken",
        message: "User login successfully",
        user: mockUser,
      });

      await login(mockReq, mockRes);

      expect(
        mockRes.cookie.calledWith("nodetodo", "mockToken", {
          httpOnly: true,
          expiresIn: 360000,
        })
      ).to.be.true;
      expect(mockRes.status.calledWith(200)).to.be.true;
      expect(
        mockRes.json.calledWith({
          resultMessage: "User login successfully",
          loggedUser: mockUser,
        })
      ).to.be.true;
    });

    it("should handle errors when logging in a user with invalid credentials", async () => {
      const mockReq = {
        body: {
          email: mockUserInvalid.email,
          password: mockUserInvalid.password,
        },
      };

      const mockRes = {
        status: sinon.stub(),
        json: sinon.stub(),
      };

      const mockError = new Error("User or Password does not match");

      Sinon.stub(userService, loginUser).rejects(mockError);

      await login(mockReq, mockRes);

      expect(mockRes.status.calledWith(404)).to.be.true;
      expect(
        mockRes.json.calledWith({
          resultMessage: "User or Password does not match",
        })
      ).to.be.true;
    });
  });

  describe("logout method", () => {
    afterEach(() => {
      Sinon.restore();
    });

    it("should clear the nodetodo cookie and send a logout", async () => {
      const mockReq = {};
      const mockRes = {
        clearCookie: sinon.stub(),
        status: sinon.stub(),
        json: sinon.stub(),
      };

      await logout(mockReq, mockRes);

      expect(mockRes.clearCookie.calledWith("nodetodo")).to.be.true;
      expect(mockRes.status.calledWith(200)).to.be.true;
      expect(mockRes.json.calledWith({ msg: "User logged out successfully" }))
        .to.be.true;
    });
  });

  describe("getme method", () => {
    afterEach(() => {
      Sinon.restore();
    });

    it("should return user details when listUserByID is valid", async () => {
      const validUser = {
        name: mockUser.name,
        email: mockUser.email,
        age: mockUser.age,
      };
      const mockListUserByID = sinon.stub(userService, listUserByID).resolves({
        httpStatusCode: 200,
        message: "User found",
        user: validUser,
      });

      const mockReq = { user: { _id: "123" } };
      const mockRes = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await getMe(mockReq, mockRes);

      expect(mockListUserByID.calledWith(mockReq.user)).to.be.true;
      expect(mockRes.status.calledWith(200)).to.be.true;
      expect(
        mockRes.json.calledWith({
          resultMessage: "User found",
          searchUser: {
            name: user.name,
            email: user.email,
            age: user.age,
          },
        })
      ).to.be.true;
    });

    it("should return error message when listUserByID returns non-200 status", async () => {
      const mockListUserByID = sinon.stub(userService, listUserByID).resolves({
        httpStatusCode: 404,
        message: "User not found",
      });

      const mockReq = { user: { _id: "123" } };
      const mockRes = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await getMe(mockReq, mockRes);

      expect(mockListUserByID.calledWith(mockReq.user)).to.be.true;
      expect(mockRes.status.calledWith(404)).to.be.true;
      expect(mockRes.json.calledWith({ resultMessage: "User not found" })).to.be
        .true;
    });
  });

  describe("updateDetails method", () => {});

  describe("updatePassword method", () => {});

  describe("deleteUser method", () => {
    const mockDeleteUserByID = sinon.stub(
      require("../../services/userService"),
      "deleteUserByID"
    );
    afterEach(() => {
      sinon.restore();
    });

    it("should successfully delete the user and clear the cookie", async () => {
      mockDeleteUserByID.resolves({
        httpStatusCode: 200,
        message: "User deleted successfully",
      });

      const mockReq = {
        user: {
          id: mockUserDelete.id,
        },
      };

      const mockRes = {
        clearCookie: sinon.stub(),
        status: sinon.stub(),
        json: sinon.stub(),
      };

      await deleteUserByID(mockReq, mockRes);

      expect(mockDeleteUserByID.calledOnceWithExactly(mockReq.user.id)).to.be
        .true;
      expect(mockRes.clearCookie.calledWith("nodetodo")).to.be.true;
      expect(mockRes.status.calledWith(200)).to.be.true;
      expect(
        mockRes.json.calledWith({ resultMessage: "User deleted successfully" })
      ).to.be.true;
    });

    it("should return an error if the user does not exist", async () => {
      mockDeleteUserByID.rejects(new Error("User not found"));

      const mockReq = {
        user: {
          id: mockUserDelete.id,
        },
      };

      const mockRes = {
        status: sinon.stub(),
        json: sinon.stub(),
      };

      await deleteUserByID(mockReq, mockRes);

      expect(mockDeleteUserByID.calledOnceWithExactly(mockReq.user.id)).to.be
        .true;
      expect(mockRes.clearCookie.notCalled).to.be.true;
      expect(mockRes.status.calledWith(404)).to.be.true;
      expect(mockRes.json.calledWith({ resultMessage: "User not found" })).to.be
        .true;
    });
  });
});
