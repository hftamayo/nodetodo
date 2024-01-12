const {
  signUpUser,
  loginUser,
  listUserByID,
  updateUserByID,
  updateUserPassword,
  deleteUserByID,
} = require("../../services/userService");

const register = async (req, res, signUpUser) => {
  try {
    const { httpStatusCode, message, user } = await signUpUser(req.body);
    if (httpStatusCode === 200) {
      const { password: pass, ...filteredUser } = user._doc;
      res
        .status(httpStatusCode)
        .json({ resultMessage: message, newUser: filteredUser });
    } else {
      res.status(httpStatusCode).json({ resultMessage: message });
    }
  } catch (error) {
    console.error("userController, register: " + error.message);
    res.status(500).json({ resultMessage: "Internal Server Error" });
  }
};

const login = async (req, res, loginUser) => {
  try {
    const { httpStatusCode, tokenCreated, message, user } = await loginUser(
      req.body
    );

    if (httpStatusCode === 200) {
      res.cookie("nodetodo", tokenCreated, {
        httpOnly: true,
        expiresIn: 360000,
      });
      //filtering password for not showing during the output
      const { password: pass, ...filteredUser } = user._doc;
      res
        .status(httpStatusCode)
        .json({ resultMessage: message, loggedUser: filteredUser });
    } else {
      res.status(httpStatusCode).json({ resultMessage: message });
    }
  } catch (error) {
    console.error("userController, login: " + error.message);
    res.status(500).json({ resultMessage: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("nodetodo");
    res.status(200).json({ msg: "User logged out successfully" });
  } catch (error) {
    console.error("userController, logout: " + error.message);
    res.status(500).json({ resultMessage: "Internal Server Error" });
  }
};

const getMe = async (req, res, listUserByID) => {
  try {
    const { httpStatusCode, message, user } = await listUserByID(req.user);
    if (httpStatusCode === 200) {
      const { password: pass, ...filteredUser } = user._doc;
      res
        .status(httpStatusCode)
        .json({ resultMessage: message, searchUser: filteredUser });
    } else {
      res.status(httpStatusCode).json({ resultMessage: message });
    }
  } catch (error) {
    console.error("userController, getMe: " + error.message);
    res.status(500).json({ resultMessage: "Internal Server Error" });
  }
};

const updateDetails = async (req, res, updateUserByID) => {
  try {
    const { httpStatusCode, message, user } = await updateUserByID(
      req.user,
      req.body
    );

    if (!user) {
      return res.status(httpStatusCode).json({ resultMessage: message });
    }

    const { password: pass, ...filteredUSer } = user._doc;
    res
      .status(httpStatusCode)
      .json({ resultMessage: message, updatedUser: filteredUSer });
  } catch (error) {
    console.error("userController, updateDetails: " + error.message);
    res.status(500).json({ resultMessage: "Internal Server Error" });
  }
};

const updatePassword = async (req, res, updateUserPassword) => {
  try {
    const { httpStatusCode, message, user } = await updateUserPassword(
      req.user,
      req.body
    );

    if (!user) {
      return res.status(httpStatusCode).json({ resultMessage: message });
    }

    const { password, ...filteredUser } = user._doc;
    res
      .status(httpStatusCode)
      .json({ resultMessage: message, deletedUser: filteredUser });
  } catch (error) {
    console.error("userController, updatePassword: " + error.message);
    res.status(500).json({ resultMessage: "Internal Server Error" });
  }
};

const deleteUser = async (req, res, deleteUserByID) => {
  try {
    const { httpStatusCode, message } = await deleteUserByID(req.user);

    if (httpStatusCode === 200) {
      res.clearCookie("nodetodo");
    }
    res.status(httpStatusCode).json({ resultMessage: message });
  } catch (error) {
    console.error("userController, deleteUser: " + error.message);
    res.status(500).json({ resultMessage: "Internal Server Error" });
  }
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
