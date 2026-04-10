import User from "../models/zentora.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Canvas from "../models/canvas.model.js";

//signin
const cookieOptions = {
  httpOnly: true, // Prevents JavaScript access (protects against XSS)
  secure: false, // process.env.NODE_ENV === "production", // Ensures cookie is sent over HTTPS only
  sameSite: "Lax", // Prevents CSRF attacks
  maxAge: 3600000, // 1 hour in milliseconds
};

export const getZentora = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, cookieOptions);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// signup
export const createZentora = async (req, res) => {
  try {
    const data = req.body;

    // hash password
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    const newUser = new User(data);
    await newUser.save();

    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, cookieOptions);

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        errors: messages,
      });
    }

    // duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      return res.status(400).json({
        success: false,
        message: [`${field} already exists`],
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// signout
export const signOut =
  ("/logout",
  (req, res) => {
    res
      .cookie("token", null, { expires: new Date() })
      .send("user Logout Successfully");
  });

export const saveCanvas = async (req, res) => {
  try {
    const { rectangles, images, color } = req.body;

    console.log("recived: ", req.body);

    //first check if canvas exists for the user

    return res
      .status(200)
      .json({ success: true, data: "Canvas saved successfully" });

    let canvas = await Canvas.findOne({ userId });

    if (canvas) {
      //update
      canvas.rectangles = rectangles;
      canvas.images = images;
      canvas.color = color;
      await canvas.save();
    } else {
      //create new
      canvas = new Canvas({
        userId,
        rectangles,
        images,
        color,
      });
      await canvas.save();
    }

    // if exists update else create new

    res.json({ success: true, data: canvas });
  } catch (error) {
    console.log("Error saving canvas:", error);
    res.status(500).json({ message: "Server error" });
  }
};
