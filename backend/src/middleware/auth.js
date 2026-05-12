import jwt from "jsonwebtoken";
import User from "../models/zentora.model.js";

export const verifyAuth = async (req, res) => {
  try {
    console.log("logged", req.cookies.token);

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token is available" });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedData;

    if (!(await User.findOne({ _id }))) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decodedData; // Attach user data to request object
    req.user = await User.findById(_id);
    return res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.log("error: ", error);
    return res.status(401).json({ message: "Token expired" });
  }
};
