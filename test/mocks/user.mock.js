const { mongo } = require("mongoose");
const User = require("../../src/models/User");

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const mockUserAdmin = {
  id: "5f7f8b1e9f3f9c1d6c1e4d1e",
  name: "Administrator",
  email: "administrator@nodetodo.com",
  password: "password",
  age: 30,
  role: "admin",
}

const mockUserSupervisor = {
  id: "5f7f8b1e9f3f9c1d6c1e4d1f",
  name: "Sebastian Fernandez",
  email: "sebas@gmail.com",
  password: "password",
  age: 20,
  role: "supervisor",
}

const mockUserUser = {
  id: "5f7f8b1e9f3f9c1d6c1e4d20",
  name: "Lupita Martinez",
  email: "lupita@fundamuvi.com",
  password: "password",
  age: 25,
  role: "user",
}

const getNewUser = () => ({
  id: new mongo.Types.ObjectId(),
  name: "Milu Fernandez Martinez",
  email: `milu${getRandomInt(1000000)}@gmail.com`,
  password: "password",
  age: 18,
})


const mockUserInvalid = {
  id: "123123123AAA",
  name: "Herbert Fernandez",
  email: "hftamayo2@gmail.com",
  password: "incorrect",
  age: 50,
};

const mockUserUpdate = {
  name: "Yuki Fernandez Martinez",
  email: `yuki${getRandomInt(1000000)}@gmail.com`,
  emailTaken: "hftamayo@gmail.com",
  oldPassword: "password",
  newPassword: "milucito",
  notMatchPassword: "password2",
  age: 20,
};

//used just in unit testing
const mockUserDelete = {
  id: "222222222",
};

module.exports = {
  mockUserAdmin,
  mockUserSupervisor,
  mockUserUser,
  getNewUser,
  mockUserInvalid,
  mockUserUpdate,
  mockUserDelete,
};
