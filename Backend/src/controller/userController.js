import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { User } from "../schema/model.js";

const secretKey = "bookshelf";

// register, body - { name, email, password }
export const registerUser = expressAsyncHandler(async (req, res) => {
  // same email cannot register twice
  const oldUser = await User.findOne({ email: req.body.email });
  if (req.body.email && oldUser) {
    return res.status(400).json({
      success: false,
      message: "Email is already registered",
    });
  }
  const result = await User.create(req.body);
  const user = await User.findById(result._id).select("-password");
  res.status(201).json({
    success: true,
    message: "User created successfully",
    result: user,
  });
});

// login, body - { email, password }
export const loginUser = expressAsyncHandler(async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(403).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  const isPasswordMatched = await user.comparePassword(req.body.password);
  if (!isPasswordMatched) {
    return res.status(403).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1d" });
  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    result: {
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
});
