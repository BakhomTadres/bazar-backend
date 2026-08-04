import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import productRouter from "./routes/productsRoute.js";
import { salesRouter } from "./routes/salesRouter.js";
import authRouter from "./routes/authRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/products", productRouter);
app.use("/api/sales", salesRouter);
app.use("/api/auth", authRouter);

export default app;