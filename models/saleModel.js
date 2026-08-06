import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: Number,
      unique: true,
      required: true,
    },
     currency: {
      type: String,
      enum: ["USD", "EUR", "EGP"],
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        name: String,

        barcode: String,

        sellPrice: Number,

        buyPrice: Number,

        quantity: Number,
      },
    ],

    totalSale: {
      type: Number,
      required: true,
    },
    totalProfit: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Sale", saleSchema);
