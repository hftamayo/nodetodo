const expect = require("chai").expect;
const sinon = require("sinon");
const User = require("../../models/User");
const { mockUser } = require("../mocks/user.mock");

describe("User Model", () => {
  it("should create a new user with valid data", async () => {
    const saveStub = sinon.stub(User.prototype, "save");

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
    expect(user.name).to.equal(mockUser.name);
    expect(user.email).to.equal(mockUser.email);
    expect(user.age).to.equal(mockUser.age);

    saveStub.restore();
  });

  it("should throw an error if the user's name is missing", async () => {
    const user = new User({
      name: "",
      email: mockUser.email,
      password: mockUser.password,
      age: mockUser.age,
    });

    const saveStub = sinon.stub(User.prototype, "save");

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

    const saveStub = sinon.stub(User.prototype, "save");

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

  it("should throw an error if the user's password is missing", async () => {
    const user = new User({
      name: mockUser.name,
      email: mockUser.email,
      password: "",
      age: mockUser.age,
    });

    const saveStub = sinon.stub(User.prototype, "save");

    saveStub.rejects(new Error("User validation failed: `password` is required"));    

    try {
      await user.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.message).to.equal(
        "User validation failed: `password` is required"
      );
    }
    saveStub.restore();
  });

  it("should throw an error if the user's age is missing", async () => {
    const user = new User({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
      age: "",
    });

    const saveStub = sinon.stub(User.prototype, "save");

    saveStub.rejects(new Error("User validation failed: `age` is required"));        

    try {
      await user.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.message).to.equal(
        "User validation failed: `age` is required"
      );
    }
    saveStub.restore();
  });
});
