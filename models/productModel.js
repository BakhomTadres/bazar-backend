import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  barcode: {
    type: String,
    required: true
  },
  buyPrice: {
    type: Number,
    required: true
  },
  sellPrice: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  minQuantity: {
    type: Number,
    required: true
  }
});

const Product = mongoose.model("Product", productSchema);
export default Product;