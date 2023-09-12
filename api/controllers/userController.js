import {
  signUpUser,
  loginUser,
  listUserByID,
  updateUserByID,
  updateUserPassword,
  deleteUserByID,
} from "../../services/userService.js";

export const register = async (req, res) => {
  const { httpStatusCode, message, user } = await signUpUser(req.body);
  if (httpStatusCode === 200) {
    res.status(httpStatusCode).json({ resultMessage: message, newUser : user });
  } else {
    res.status(httpStatusCode).json({ resultMessage: message });
  }

};

export const login = async (req, res) => {
  const { httpStatusCode, tokenCreated, user, message } = await loginUser(req.body);

  if (httpStatusCode === 200) {
    res.cookie("token", tokenCreated, { httpOnly: true, expiresIn: 360000 });
    //filtering password for not showing during the output
    const { password: pass, ...rest } = user._doc;
    res.status(httpStatusCode).json({ resultMessage: rest });
  } else {
    res.status(httpStatusCode).json({ resultMessage: message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ msg: "User logged out successfully" });
};

export const getMe = async (req, res) => {
  const { type, message } = await listUserByID(req.user);
  if (type === 200) {
    const { password: pass, ...rest } = message._doc;
    res.status(type).json({ msg: rest });
  } else {
    res.status(type).json({ msg: message });
  }
};

export const updateDetails = async (req, res) => {
  const { type, message } = await updateUserByID(req.user, req.body);
  const { password: pass, ...rest } = message._doc;
  res.status(type).json({ msg: rest });
};

export const updatePassword = async (req, res) => {
  const { type, message } = await updateUserPassword(req.user, req.body);
  const { password: pass, ...rest } = message._doc;
  res.status(type).json({ msg: rest });
};

export const deleteUser = async (req, res) => {
  const { type, message } = await deleteUserByID(req.user);

  if (type === 200) {
    res.clearCookie("token");
  }
  res.status(type).json({ msg: message });
};
