import Supplier from "../models/supplierModel.js";

// إضافة مورد
export const createSupplier = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Supplier name is required",
      });
    }

    const supplier = await Supplier.create({
      name,
      phone,
      address,
    });

    res.status(201).json({
      message: "Supplier created successfully",
      supplier,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// جلب كل الموردين
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: suppliers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// جلب مورد واحد
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: supplier,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// تعديل مورد
export const updateSupplier = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      {
        name,
        phone,
        address,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      message: "Supplier updated successfully",
      supplier,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// حذف مورد
export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};