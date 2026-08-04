import Sale from "../models/saleModel.js";
import Product from "../models/productModel.js";
export const createSale = async (req, res) => {
  try {
    const { cart, currency } = req.body;
    if (!cart || cart.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }
    let totalSale = 0;

    let totalProfit = 0;

    const soldProducts = [];

    for (const item of cart) {
      const product = await Product.findOne({
        barcode: item.barcode,
      });

      if (!product) {
        return res.status(404).json({
          message: `Product with barcode ${item.barcode} not found`,
        });
      }

      if (item.quantity > product.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }
      soldProducts.push({
        productId: product._id,
        name: product.name,
        barcode: product.barcode,
        buyPrice: product.buyPrice,
        sellPrice: item.sellPrice,
        quantity: item.quantity,
      });
      totalSale += item.sellPrice * item.quantity;

      totalProfit += (item.sellPrice - product.buyPrice) * item.quantity;
    }

    const lastSale = await Sale.findOne().sort({ invoiceNumber: -1 });

    const invoiceNumber =
      lastSale && lastSale.invoiceNumber ? lastSale.invoiceNumber + 1 : 1001;

    const sale = await Sale.create({
      invoiceNumber,
      products: soldProducts,
      totalSale,
      totalProfit,
      currency,
    });

    for (const item of cart) {
      await Product.findOneAndUpdate(
        { barcode: item.barcode },
        {
          $inc: {
            quantity: -item.quantity,
          },
        },
      );
    }

    res.status(201).json({
      message: "Sale completed successfully",
      sale,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: sales,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const calculateStats = async (startDate, endDate) => {
  const sales = await Sale.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  let totalSales = 0;
  let totalProfit = 0;

  sales.forEach((sale) => {
    totalSales += sale.totalSale;
    totalProfit += sale.totalProfit;
  });

  return {
    totalSales,
    totalProfit,
  };
};

export const getDashboardStats = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);


    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );

    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const startOfThreeMonths = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 2,
      1,
    );

    const endOfThreeMonths = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );


    const startOfYear = new Date(new Date().getFullYear(), 0, 1);

    const endOfYear = new Date(
      new Date().getFullYear(),
      11,
      31,
      23,
      59,
      59,
      999,
    );

    const [today, month, threeMonths, year] = await Promise.all([
  calculateStats(startOfDay, endOfDay),
  calculateStats(startOfMonth, endOfMonth),
  calculateStats(startOfThreeMonths, endOfThreeMonths),
  calculateStats(startOfYear, endOfYear),
]);
    res.status(200).json({
      success: true,
      data: {
        today,
        month,
        threeMonths,
        year,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
