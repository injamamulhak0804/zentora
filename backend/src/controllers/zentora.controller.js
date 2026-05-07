import User from "../models/zentora.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Canvas from "../models/canvas.model.js";

const cookieOptions = {
  httpOnly: true, // Prevents JavaScript access (protects against XSS)
  secure: false, // process.env.NODE_ENV === "production", // Ensures cookie is sent over HTTPS only
  sameSite: "Lax", // Prevents CSRF attacks
  maxAge: 3600000, // 1 hour in milliseconds
};

//signin
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
export const signOut = (req, res) => {
  res
    .cookie("token", "", { expires: new Date(), httpOnly: true })
    .status(200)
    .json({ message: "Logged out successfully" });
};

// save canva data
export const saveCanvas = async (req, res) => {
  try {
    const { rectangles, images, color } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedData;

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
    return res.status(500).json({ message: "Server error" });
  }
};

// get canva data
export const getCanvas = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedData;

    let canvas = await Canvas.findOne({ userId });
    console.log("canvas: ", canvas);

    return res
      .status(200)
      .json({ message: "you got the data: ", data: canvas });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

//login with google
export const getLoginWithGoogle = async (req, res) => {
  const { access_token } = req.body;

  const googleRes = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  const user = await googleRes.json();

  console.log("=========user: ", user);
};
