import User from "../models/zentora.model.js";

export const getZentora = async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ["User not found"],
      });
    }

    if (user.name !== name) {
      return res.status(400).json({
        success: false,
        message: ["Invalid credentials"],
      });
    }

    return res.status(200).json({
      success: true,
      data: `Welcome, ${user.name}! Your email is ${user.email}.`,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        errors: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createZentora = async (req, res) => {
  try {
    const data = req.body;
    const user = await User.create(data);

    return res.status(201).json({
      success: true,
      data: user,
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
