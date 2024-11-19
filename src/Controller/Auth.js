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
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(500).json({ message: "Failed to create user" });
    }
    // Create and assign a JWT token to the user
    const token = signJWTToken(user._id);
    res.status(201).json({
      status: "success",
      user,
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Server error" });
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
      return res.status(401).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    const token = signJWTToken(user._id);
    res.status(200).json({
      status: "user login successful",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user._id,
      },
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, password } = req.body;

    if (!firstName && !lastName && !email && !password) {
      return res.status(400).json({ msg: "No fields provided for update" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== userId) {
        return res.status(409).json({ msg: "Email already in use" });
      }
      user.email = email;
    }
    if (password) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    await user.deleteOne();
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); 
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  updateUser,
  deleteUser,
  getUsers
};
