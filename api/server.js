import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initMongoConnection } from "../db/connection.js";
import petsRouter from "../routes/pets.js";
import { loginRouter, registerRouter } from "../routes/auth.js";
import refreshRouter from "../routes/refresh.js";
import logoutRouter from "../routes/logout.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/refresh", refreshRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/pets", petsRouter);
app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);

await initMongoConnection();

export default app;
