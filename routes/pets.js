import express from "express";
import { Pet } from "../models/Pet.js";
import { authenticate } from "../middleware/authMiddleware.js";

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

router.get("/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/adopt/:id", authenticate, async (req, res) => {
  const petId = req.params.id;
  const userId = req.userId;

  res.json({ message: `User ${userId} wants to adopt pet ${petId}` });
});

export default router;
