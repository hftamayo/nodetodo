const User = require("../../src/models/User");

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

//this user is already created in the database
const mockUserLogin = {
  id: "658cb60218796c6f55f54fc4",
  name: "Sebastian Fernandez",
  email: "sebas@gmail.com",
  password: "password",
  age: 20,
};

const getNewUser = () => ({
  name: "Guadalupe Martinez Fernandez",
  email: `guadalupe${getRandomInt(1000000)}@gmail.com`,
  password: "password",
  age: 30,
})

//user for unit tests and update/delete operations
const mockUser = new User({
  id: "1234567890",
  name: "Herbert Fernandez Tamayo",
  email: `hftamayo${getRandomInt(1000000)}@gmail.com`,
  password: "password",
  age: 30,
});

const mockUserInvalid = {
  id: "123123123AAA",
  name: "Herbert Fernandez",
  email: "hftamayo2@gmail.com",
  password: "incorrect",
  age: 50,
};

const mockUserUpdate = {
  name: "Sebastian Fernandez",
  email: `sebas${getRandomInt(1000000)}@gmail.com`,
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
  mockUser,
  getNewUser,
  mockUserLogin,
  mockUserInvalid,
  mockUserUpdate,
  mockUserDelete,
};
