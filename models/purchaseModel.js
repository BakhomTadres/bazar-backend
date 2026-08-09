import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: Number,
      unique: true,
      required: true,
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        barcode: {
          type: String,
          required: true,
        },

        buyPrice: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        total: {
          type: Number,
          required: true,
        },
      },
    ],

    totalPurchase: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;