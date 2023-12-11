import { expect } from "chai";
import Sinon from "sinon";
import User from "../../models/User.js";
import { mockUser } from "../mocks/user.mock.js";

describe("User Model", () => {
  it("should create a new user with valid data", async () => {
    const saveStub = Sinon.stub(User.prototype, "save");

    saveStub.resolves({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
      age: mockUser.age,
    });

    const user = new User({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
      age: mockUser.age,
    });

    await user.save();

    expect(user).to.exist;
    expect(user.name).to.equal("Herbert Fernandez Tamayo");
    expect(user.email).to.equal("hftamayo@gmail.com");
    expect(user.age).to.equal(30);

    saveStub.restore();
  });

  it("should throw an error if the user's name is missing", async () => {
    const user = new User({
      name: "",
      email: mockUser.email,
      password: mockUser.password,
      age: mockUser.age,
    });

    const saveStub = Sinon.stub(User.prototype, "save");

    saveStub.rejects(new Error("User validation failed: `name` is required"));

    try {
      await user.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.message).to.equal(
        "User validation failed: `name` is required"
      );
    }
    saveStub.restore();
  });

  it("should throw an error if the user's email is missing", async () => {
    const user = new User({
      name: mockUser.name,
      email: "",
      password: mockUser.password,
      age: mockUser.age,
    });

    const saveStub = Sinon.stub(User.prototype, "save");

    saveStub.rejects(new Error("User validation failed: `email` is required"));

    try {
      await user.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.message).to.equal(
        "User validation failed: `email` is required"
      );
    }
    saveStub.restore();
  });

  it.only("should throw an error if the user's password is missing", async () => {
    const user = new User({
      name: mockUser.name,
      email: mockUser.email,
      password: "",
      age: mockUser.age,
    });

    const saveStub = Sinon.stub(User.prototype, "save");

    saveStub.rejects(new Error("User validation failed: `password` is required"));    

    try {
      await user.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.message).to.equal(
        "User validation failed: `password` is required"
      );
    }
  });

  it("should throw an error if the user's age is missing", async () => {
    const user = new User({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
      age: "",
    });

    try {
      await user.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.message).to.equal(
        "User validation failed: `age` is required"
      );
    }
  });
});
