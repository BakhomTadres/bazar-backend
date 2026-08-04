import express from "express";
import {createSale, getSales, getDashboardStats} from "../controllers/saleController.js";
import { protect } from "../middlewares/authMiddleware.js";
export const salesRouter = express.Router();
salesRouter.route("/").post(protect, createSale).get(protect, getSales);
salesRouter.route("/dashboard-stats").get(protect, getDashboardStats);
