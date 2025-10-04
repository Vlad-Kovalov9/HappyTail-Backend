import express from "express";
import { Review } from "../models/Review.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера" });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const { text, rating } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Текст відгуку обов’язковий" });
    }

    const newReview = new Review({
      user: req.userId,
      text,
      rating,
    });

    await newReview.save();
    const populatedReview = await newReview.populate("user", "name");

    res.status(201).json(populatedReview);
  } catch (err) {
    console.error("Помилка при створенні/видаленні відгуку:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Відгук не знайдено" });

    if (review.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Немає прав для видалення" });
    }

    await review.deleteOne();
    res.json({ message: "Відгук видалено" });
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера" });
  }
});

export default router;
