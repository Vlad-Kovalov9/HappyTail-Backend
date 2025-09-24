import express from "express";
import { User } from "../models/User.js";
import { authenticate } from "../middleware/authMiddleware.js";

const logoutRouter = express.Router();

logoutRouter.post("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user)
      return res.status(404).json({ message: "Користувач не знайдений" });

    user.refreshToken = null;
    await user.save();

    res.json({ message: "Ви успішно вийшли з акаунту" });
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера" });
  }
});

export default logoutRouter;
