import { expect } from "chai";
import User from "../../models/User.js";
import mongoose from "mongoose";
const db = "mongodb://localhost:27017/todoapp-test";

describe("User model Integration Tests", function () {
  this.timeout(10000); // Set timeout to 5000ms

  it("should create a new user", async () => {
    const user = new User({
      name: "Herbert Fernandez Tamayo",
      email: "hftamayo2031@gmail.com",
      password: "milucito2031",
      age: 40,
    });

    const savedUser = await user.save();

    expect(savedUser).to.exist;
    expect(savedUser.name).to.equal("Herbert Fernandez Tamayo");
    expect(savedUser.email).to.equal("hftamayo2031@gmail.com");
    expect(savedUser.age).to.equal(40);
  });
});
