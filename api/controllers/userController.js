const {
  signUpUser,
  loginUser,
  listUserByID,
  updateUserByID,
  updateUserPassword,
  deleteUserByID,
} = require("../../services/userService");

const register = async (req, res) => {
  const { httpStatusCode, message, user } = await signUpUser(req.body);
  if (httpStatusCode === 200) {
    const { password: pass, ...filteredUser } = user._doc;
    res
      .status(httpStatusCode)
      .json({ resultMessage: message, newUser: filteredUser });
  } else {
    res.status(httpStatusCode).json({ resultMessage: message });
  }
};

const login = async (req, res) => {
  const { httpStatusCode, tokenCreated, message, user } = await loginUser(
    req.body
  );

  if (httpStatusCode === 200) {
    res.cookie("nodetodo", tokenCreated, { httpOnly: true, expiresIn: 360000 });
    //filtering password for not showing during the output
    const { password: pass, ...filteredUser } = user._doc;
    res
      .status(httpStatusCode)
      .json({ resultMessage: message, loggedUser: filteredUser });
  } else {
    res.status(httpStatusCode).json({ resultMessage: message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("nodetodo");
  res.status(200).json({ msg: "User logged out successfully" });
};

const getMe = async (req, res) => {
  const { httpStatusCode, message, user } = await listUserByID(req.user);
  if (httpStatusCode === 200) {
    const { password: pass, ...filteredUser } = user._doc;
    res
      .status(httpStatusCode)
      .json({ resultMessage: message, searchUser: filteredUser });
  } else {
    res.status(httpStatusCode).json({ resultMessage: message });
  }
};

const updateDetails = async (req, res) => {
  const { httpStatusCode, message, user } = await updateUserByID(
    req.user,
    req.body
  );
  const { password: pass, ...filteredUSer } = user._doc;
  res
    .status(httpStatusCode)
    .json({ resultMessage: message, updatedUser: filteredUSer });
};

const updatePassword = async (req, res) => {
  const { httpStatusCode, message, user } = await updateUserPassword(
    req.user,
    req.body
  );
  const { password: pass, ...filteredUser } = user._doc;
  res
    .status(httpStatusCode)
    .json({ resultMessage: message, deletedUser: filteredUser });
};

const deleteUser = async (req, res) => {
  const { httpStatusCode, message } = await deleteUserByID(req.user);

  if (httpStatusCode === 200) {
    res.clearCookie("nodetodo");
  }
  res.status(httpStatusCode).json({ resultMessage: message });
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  deleteUser,
};
