import { expect } from "chai";
import User from "../../models/User.js";
import mongoose from "mongoose";
const db = "mongodb://localhost:27017/todoapp-test";

describe("User model Integration Tests", function () {
  this.timeout(20000);
  let user;

  beforeEach(async function () {
    this.timeout(20000);
    user = new User({
      name: "Herbert Fernandez Tamayo",
      email: "hftamayo2030@gmail.com",
      password: "milucito2030",
      age: 40,
    });
  });

  afterEach(async function () {
    this.timeout(20000);
    await User.deleteMany({});
  });

  after(async function () {
    await mongoose.disconnect();
  });

  it("should create a new user", async function () {
    this.timeout(20000);
    const savedUser = await user.save();

    expect(savedUser).to.exist;
    expect(savedUser.name).to.equal("Herbert Fernandez Tamayo");
    expect(savedUser.email).to.equal("hftamayo2030@gmail.com");
    expect(savedUser.age).to.equal(40);
  });

  it("should not create an existing user", async () => {
    try {
      await user.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.status).to.equal(400);
      expect(error.message).to.equal("User already exists");
    }
  });
});
