let signUpUser;

const userController = {
  setSignUpUser: function (newSignUpUser) {
    signUpUser = newSignUpUser;
  },

  register: async function (req, res) {
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
  },

  login: async function (req, res) {
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
  },

  logout: async function (req, res) {
    try {
      res.clearCookie("nodetodo");
      res.status(200).json({ msg: "User logged out successfully" });
    } catch (error) {
      console.error("userController, logout: " + error.message);
      res.status(500).json({ resultMessage: "Internal Server Error" });
    }
  },

  getMe: async function (req, res) {
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
  },

  updateDetails: async function (req, res) {
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
  },

  updatePassword: async function (req, res) {
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
        .json({ resultMessage: message, updatedUser: filteredUser });
    } catch (error) {
      console.error("userController, updatePassword: " + error.message);
      res.status(500).json({ resultMessage: "Internal Server Error" });
    }
  },

  deleteUser: async function (req, res) {
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
  },
};

module.exports = userController;
