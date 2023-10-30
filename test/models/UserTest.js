import { expect } from "chai";
import User from "../../models/User";

describe("User Model", () => {
  it("should create a new user with valid data", async () => {
    const user = new User({
      name: "Herbert Fernandez Tamayo",
      email: "hftamayo@gmail.com",
      password: "milucito",
      age: 40,
    });
    await user.save();

    expect(user).to.exist;
    expect(user.name).to.equal("Herbert Fernandez Tamayo");
    expect(user.email).to.equal("hftamayo@gmail.com");
    expect(user.age).to.equal(40);
  });

  it("should throw an error if the user's name is missing", async () => {
    const user = new User({
      email: "hftamayo@gmail.com",
      password: "milucito",
      age: 30,
    });

    try {
      await user.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.message).to.equal(
        "User validation failed: `name` is required"
      );
    }
  });

  it("should throw an error if the user's email is missing", async () => {
    const user = new User({
      name: "Herbert Fernandez Tamayo",
      password: "milucito",
      age: 30,
    });

    try {
      await user.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.message).to.equal(
        "User validation failed: `email` is required"
      );
    }
  });

  it("should throw an error if the user's password is missing", async () => {
    const user = new User({
      name: "Herbert Fernandez Tamayo",
      email: "hftamayo@gmail.com",
      age: 30,
    });

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
      name: "Herbert Fernandez Tamayo",
      email: "hftamayo@gmail.com",
      password: "milucito",
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
