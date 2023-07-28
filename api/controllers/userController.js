import {
  signUpUser,
  loginUser,
  listUserByID,
  updateUserByID,
  updateUserPassword,
  deleteUserByID,
} from "../../services/userService.js";

export const register = async (req, res) => {
  const { type, message } = await signUpUser(req.body);
  if (type === 200) {
    res.cookie("token", message, { httpOnly: true, expiresIn: 360000 });
  }
  res.status(type).json({ msg: "User created successfully. Please log in" });
};

export const login = async (req, res) => {
  const { type, message, user } = await loginUser(req.body);

  if (type === 200) {
    res.cookie("token", message, { httpOnly: true, expiresIn: 360000 });
    //filtering password for not showing during the output
    const { password: pass, ...rest } = user._doc;
    res.status(type).json({ msg: rest });
  } else {
    res.status(type).json({ msg: message });
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
