import jwt from "jsonwebtoken";
import { masterKey } from "../../config/envvars.js";

const authorize = async (req, res, next) => {
  const token = req.cookies.nodetodo;
  if (!token) {
    return res
      .status(401)
      .json({ resultMessage: "Not authorized, please login first" });
  }
  try {
    const decoded = jwt.verify(token, masterKey);
    req.user = decoded.searchUser;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ resultMessage: "Internal Server Error" });
  }
};

export default authorize;
