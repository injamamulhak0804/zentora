import jwt from "jsonwebtoken";
import User from "../models/ zentora.model.js";

export const verifyAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedData;

    if (!(await User.findOne({ _id }))) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decodedData; // Attach user data to request object
    req.user = await User.findById(_id);
    next();
  } catch {
    return res.status(401).json({ message: "Token expired" });
  }
};
