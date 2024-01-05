const User = require("../../models/User");

const mockUser = new User({
  id: "1234567890",
  name: "Herbert Fernandez Tamayo",
  email: "hftamayo@gmail.com",
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
  id: "11111111111",
  name: "Sebastian Fernandez",
  email: "sebas@gmail.com",
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
  mockUserInvalid,
  mockUserUpdate,
  mockUserDelete,
};
