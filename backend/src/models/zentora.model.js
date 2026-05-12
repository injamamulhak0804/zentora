import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Invalid email format",
      },
    },

    password: {
      type: String,

      // required only for normal signup
      required: function () {
        return this.provider === "local";
      },

      minlength: [6, "Password must be at least 6 characters"],

      validate: {
        validator: function (value) {
          // skip validation for google users
          if (this.provider === "google") return true;

          return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/.test(
            value,
          );
        },

        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 6 characters long",
      },
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
    },

    picture: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
