import express from "express";

import {
  createPurchase,
  getPurchases,
    getPurchaseById,
} from "../controllers/purchaseController.js";

const purchaseRouter = express.Router();

purchaseRouter.post("/", createPurchase);
purchaseRouter.get("/", getPurchases);
purchaseRouter.get("/:id", getPurchaseById);

export default purchaseRouter;