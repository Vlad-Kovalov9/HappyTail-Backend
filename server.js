import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initMongoConnection } from "./db/connection.js";
import petsRouter from "./routes/pets.js";
import { loginRouter, registerRouter } from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/pets", petsRouter);

app.use("/api/login", loginRouter);

app.use("/api/register", registerRouter);

const PORT = process.env.PORT || 5000;

initMongoConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
