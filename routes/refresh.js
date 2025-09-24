import express from "express";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const refreshRouter = express.Router();

refreshRouter.post("/", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token" });

    const user = await User.findOne({ refreshToken });
    if (!user)
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default refreshRouter;
