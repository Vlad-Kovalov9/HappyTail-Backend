import express from "express";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginRouter = express.Router();
const registerRouter = express.Router();

registerRouter.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const registeredUser = await User.findOne({ email });
    if (registeredUser) {
      return res
        .status(400)
        .json({ message: "Користувач з таким email вже існує" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });

    const accessToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера" });
  }
});

loginRouter.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Невірний email або пароль" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: "Невірний email або пароль" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    console.log("Login success:", user.email);

    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

export { loginRouter, registerRouter };
