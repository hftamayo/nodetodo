const User = require("../../models/User");

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const mockUserLogin = {
  id: "658cb60218796c6f55f54fc4",
  name: "Sebastian Fernandez",
  email: "sebas@gmail.com",
  password: "milucito",
  age: 20,
};

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

const mockUserDelete = {
  id: "222222222",
};

module.exports = {
  mockUser,
  mockUserLogin,
  mockUserInvalid,
  mockUserUpdate,
  mockUserDelete,
};
