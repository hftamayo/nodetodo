const expect = require("chai").expect;
const sinon = require("sinon");
const User = require("../../src/models/User");
const { mockUserUser } = require("../mocks/user.mock");

describe("User Model", () => {
  it("should create a new user with valid data", async () => {
    const saveStub = sinon.stub(User.prototype, "save");

    saveStub.resolves({
      name: mockUserUser.name,
      email: mockUserUser.email,
      password: mockUserUser.password,
      age: mockUserUser.age,
    });

    const user = new User({
      name: mockUserUser.name,
      email: mockUserUser.email,
      password: mockUserUser.password,
      age: mockUserUser.age,
    });

    await user.save();

    expect(user).to.exist;
    expect(user.name).to.equal(mockUserUser.name);
    expect(user.email).to.equal(mockUserUser.email);
    expect(user.age).to.equal(mockUserUser.age);

    saveStub.restore();
  });

  it("should throw an error if the user's name is missing", async () => {
    const user = new User({
      name: "",
      email: mockUserUser.email,
      password: mockUserUser.password,
      age: mockUserUser.age,
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
      name: mockUserUser.name,
      email: "",
      password: mockUserUser.password,
      age: mockUserUser.age,
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
      name: mockUserUser.name,
      email: mockUserUser.email,
      password: "",
      age: mockUserUser.age,
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
      name: mockUserUser.name,
      email: mockUserUser.email,
      password: mockUserUser.password,
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
