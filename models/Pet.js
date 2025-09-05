import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  pet: String,
  name: String,
  gender: String,
  age: String,
  image: String,
  city: String,
  description: String,
  sterilization: Boolean,
});

export const Pet = mongoose.model("Pet", petSchema);
