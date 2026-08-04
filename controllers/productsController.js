import Product from "../models/productModel.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ status: "success", data: { products } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, barcode, buyPrice, sellPrice, quantity, minQuantity } =
    req.body;
  const oldProduct = await Product.findOne({ barcode });
  if (oldProduct) {
    return res
      .status(400)
      .json({ status: "fail", message: "Product already exists" });
  }
  const product = new Product({
    name,
    barcode,
    buyPrice,
    sellPrice,
    quantity,
    minQuantity,
  });
  try {
    const savedProduct = await product.save();
    res
      .status(201)
      .json({ status: "success", data: { product: savedProduct } });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { barcode: req.params.id },
      req.body,
      { new: true },
    );
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ status: "fail", message: "Product not found" });
    }
    res.json({ status: "success", data: { product: updatedProduct } });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      barcode: req.params.id,
    });
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ status: "fail", message: "Product not found" });
    }
    res.json({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getProductByBarcode = async (req, res) => {
  try {
    const product = await Product.findOne({
      barcode: req.params.barcode,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};