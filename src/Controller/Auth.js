require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("./../Model/Auth");
const bcrypt = require("bcryptjs");

const signJWTToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Passwords do not match" });
      }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(404).json({ msg: "Failed to create user" });
    }

    const token = signJWTToken(user._id);
    res.status(200).json({
      status: "success",
      user,
      token,
    });

  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = signJWTToken(user._id);
    res.status(200).json({
      status: "user login successful",
      user,
      token,
    });

  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  register,
  login,
};
