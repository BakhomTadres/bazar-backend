import Purchase from "../models/purchaseModel.js";
import Product from "../models/productModel.js";
import Supplier from "../models/supplierModel.js";

export const createPurchase = async (req, res) => {
  try {
    const { supplier, products } = req.body;

    // التأكد من وجود المورد
    if (!supplier) {
      return res.status(400).json({
        message: "Supplier is required",
      });
    }

    // التأكد من وجود المنتجات
    if (!products || products.length === 0) {
      return res.status(400).json({
        message: "Purchase must contain products",
      });
    }

    // التأكد أن المورد موجود
    const supplierExists = await Supplier.findById(supplier);

    if (!supplierExists) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    let totalPurchase = 0;
    const purchasedProducts = [];

    for (const item of products) {
      // البحث عن المنتج بالباركود
      const product = await Product.findOne({
        barcode: item.barcode,
      });

      if (!product) {
        return res.status(404).json({
          message: `Product with barcode ${item.barcode} not found`,
        });
      }

      // التأكد من البيانات
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          message: `Invalid quantity for ${product.name}`,
        });
      }

      if (item.buyPrice === undefined || item.buyPrice < 0) {
        return res.status(400).json({
          message: `Invalid buy price for ${product.name}`,
        });
      }

      const itemTotal = Number(item.buyPrice) * Number(item.quantity);

      purchasedProducts.push({
        productId: product._id,
        name: product.name,
        barcode: product.barcode,
        buyPrice: Number(item.buyPrice),
        quantity: Number(item.quantity),
        total: itemTotal,
      });

      totalPurchase += itemTotal;
    }

    // إنشاء رقم الفاتورة
    const lastPurchase = await Purchase.findOne().sort({
      invoiceNumber: -1,
    });

    const invoiceNumber =
      lastPurchase && lastPurchase.invoiceNumber
        ? lastPurchase.invoiceNumber + 1
        : 1001;

    // حفظ الفاتورة
    const purchase = await Purchase.create({
      invoiceNumber,
      supplier,
      products: purchasedProducts,
      totalPurchase,
    });

    // زيادة المخزون
    for (const item of products) {
      await Product.findOneAndUpdate(
        { barcode: item.barcode },
        {
          $inc: {
            quantity: Number(item.quantity),
          },
          $set: {
            buyPrice: Number(item.buyPrice),
          },
        },
      );
    }

    res.status(201).json({
      message: "Purchase created successfully",
      purchase,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// جلب كل فواتير الشراء
export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplier", "name phone address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("supplier", "name phone address")
      .populate("products.productId", "name barcode buyPrice quantity");

    if (!purchase) {
      return res.status(404).json({
        message: "Purchase not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
