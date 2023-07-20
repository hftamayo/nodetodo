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
    res.cookie("token", message, { httpOnly: true, expiresIn: "5h" });
  }
  res.status(type).json({ msg: message });
};

export const login = async (req, res) => {
  const { type, message } = await loginUser(req.body);

  if (type === 200) {
    res.cookie("token", message, { httpOnly: true, expiresIn: "5h" });
  }
  res.status(type).json({ msg: message });
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ msg: "User logged out successfully" });
};

export const getMe = async (req, res) => {
  const { type, message } = await listUserByID(req.user);
  res.status(type).json({ msg: message });
};

export const updateDetails = async (req, res) => {
  const { type, message } = await updateUserByID(req.user, req.body);
  res.status(type).json({ msg: message });
};

export const updatePassword = async (req, res) => {
  const { type, message } = await updateUserPassword(req.user, req.body);
  res.status(type).json({ msg: message });
};

export const deleteUser = async (req, res) => {
  const { type, message } = await deleteUserByID(req.user);

  if (type === 200) {
    res.clearCookie("token");
  }
  res.status(type).json({ msg: message });
};
