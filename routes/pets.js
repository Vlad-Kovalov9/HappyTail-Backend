import express from "express";
import { Pet } from "../models/Pet.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find().sort({ _id: 1 });
    res.json(pets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
