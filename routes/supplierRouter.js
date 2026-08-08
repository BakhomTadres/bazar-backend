import express from "express";

import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";

const supplierRouter = express.Router();

supplierRouter.post("/", createSupplier);

supplierRouter.get("/", getSuppliers);

supplierRouter.get("/:id", getSupplierById);

supplierRouter.patch("/:id", updateSupplier);

supplierRouter.delete("/:id", deleteSupplier);

export default supplierRouter;