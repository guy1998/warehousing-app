const mongoose = require("mongoose");
const Sale = require("../models/sale.js");
const SaleReturn = require("../models/sale-return.js");
const { markVisitSuccessful } = require("../controllers/visit-repository.js");
const {
  decreaseQuantity,
  increaseQuantity,
  updateQuantityOnReturn,
} = require("../controllers/product-repository.js");

const createSale = async (visitId, notes, images, sale) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const newSale = new Sale({ ...sale });
    await newSale.save();
    const soldProducts = newSale.soldProducts;
    for (const product of soldProducts) {
      await decreaseQuantity(product.realProduct, product.quantity);
    }
    await markVisitSuccessful(visitId, notes, images);
    session.commitTransaction();
    session.endSession();
    return { result: true, message: "New sale created successfully!" };
  } catch (err) {
    session.abortTransaction();
    session.endSession();
    return { result: false, message: err.message };
  }
};

const editSale = async (saleId, newSoldProducts) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const sale = await Sale.findById(saleId);
    const soldProducts = sale.toObject().soldProducts;
    const editInformation = await generateEditInformation(newSoldProducts);
    const { returnedProducts, takenProducts } = await saleEditHelper(
      soldProducts,
      newSoldProducts,
      editInformation
    );
    const returnResult = await dataBaseReturner(returnedProducts);
    const addedResult = await dataBaseTaker(takenProducts);
    if (!returnResult || !addedResult)
      throw new Error("Could not update the sale!");
    sale.set("soldProducts", newSoldProducts);
    await sale.save();
    session.commitTransaction();
    session.endSession();
    return { result: true, message: 'Edited successfully!' };
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    return { result: false, message: error.message };
  }
};

const saleEditHelper = async (
  soldProducts,
  newSoldProducts,
  editInformation
) => {
  let returnedProducts = [];
  let takenProducts = [];
  soldProducts.forEach((product) => {
    if (editInformation[product.realProduct]) {
      if (editInformation[product.realProduct] > product.quantity) {
        takenProducts.push({
          ...product,
          quantity: editInformation[product.realProduct] - product.quantity,
        });
      } else {
        returnedProducts.push({
          ...product,
          quantity: product.quantity - editInformation[product.realProduct],
        });
      }
    } else {
      returnedProducts.push({
        ...product,
      });
    }
  });
  const realProducts = soldProducts.map(
    (soldProduct) => soldProduct.realProduct
  );
  newSoldProducts.forEach((product) => {
    if (!realProducts.includes(product.realProduct)) {
      takenProducts.push({ ...product });
    }
  });
  return { returnedProducts, takenProducts };
};

const generateEditInformation = async (newSoldProducts) => {
  const editInformation = {};
  newSoldProducts.forEach((soldProduct) => {
    editInformation[soldProduct.realProduct] = soldProduct.quantity;
  });
  return editInformation;
};

const saleReturnHelper = async (soldProducts, returnInformation) => {
  let returnedProducts = [];
  let newSoldProducts = [];
  soldProducts.forEach((product) => {
    if (returnInformation[product.realProduct]) {
      if (returnInformation[product.realProduct] === product.quantity) {
        returnedProducts.push({
          ...product,
        });
      } else {
        newSoldProducts.push({
          ...product,
          quantity:
            parseInt(product.quantity) -
            parseInt(returnInformation[product.realProduct]),
        });
        returnedProducts.push({
          ...product,
          quantity: returnInformation[product.realProduct],
        });
      }
    } else {
      newSoldProducts.push({
        ...product,
        quantity: product.quantity - returnInformation[product.realProduct],
      });
    }
  });
  return { newSoldProducts, returnedProducts };
};

const dataBaseTaker = async (takenProducts) => {
  const bulkOps = takenProducts.map((product) => ({
    updateOne: {
      filter: { _id: product.realProduct },
      update: { $inc: { quantity: -product.quantity } },
    },
  }));
  return await updateQuantityOnReturn(bulkOps);
};

const dataBaseReturner = async (returnedProducts) => {
  const bulkOps = returnedProducts.map((product) => ({
    updateOne: {
      filter: { _id: product.realProduct },
      update: {
        $inc: { quantity: product.quantity },
        $set: {
          priceHoreca: product.priceHoreca,
          priceRetail: product.priceRetail,
          productName: product.productName,
          unit: product.unit,
        },
      },
      upsert: true,
    },
  }));
  return await updateQuantityOnReturn(bulkOps);
};

const addSaleReturn = async (saleId, returnInformation) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const sale = await Sale.findById(saleId);
    const soldProducts = sale.toObject().soldProducts;
    const { newSoldProducts, returnedProducts } = await saleReturnHelper(
      soldProducts,
      returnInformation
    );
    const result = await dataBaseReturner(returnedProducts);
    if (!result)
      throw new Error("Could not update the products in the database!");
    sale.set("soldProducts", newSoldProducts);
    const newReturn = new SaleReturn({
      products: returnedProducts,
      client: sale.client,
      type: sale.type,
    });
    sale.set("saleReturn", newReturn._id);
    await sale.save();
    await newReturn.save();
    session.commitTransaction();
    session.endSession();
    return { result: true, message: "Sale return saved" };
  } catch (err) {
    session.abortTransaction();
    session.endSession();
    return { result: false, message: err.message };
  }
};

const confirmSale = async (saleId) => {
  try {
    const sale = await Sale.findByIdAndUpdate(saleId, { status: "confirmed" });
    return { result: true, message: "Sale confirmed successfully!" };
  } catch (err) {
    return { result: false, message: err.message };
  }
};

const dispatchSale = async (saleId) => {
  try {
    const sale = await Sale.findByIdAndUpdate(saleId, { status: "dispatched" });
    return { result: true, message: "Sale dispatched!" };
  } catch (err) {
    return { result: false, message: err.message };
  }
};

const markSaleAsDone = async (saleId) => {
  try {
    const sale = await Sale.findByIdAndUpdate(saleId, { status: "done" });
    return { result: true, message: "Sale marked as done!" };
  } catch (err) {
    return { result: false, message: err.message };
  }
};

const getAllSales = async () => {
  try {
    const sales = await Sale.find({})
      .populate("client")
      .populate("saleReturn")
      .populate("agent")
      .exec();
    return { result: true, sales: sales };
  } catch (err) {
    return { result: false, sales: [], message: err.message };
  }
};

const filterSales = async (filter) => {
  try {
    const sales = await Sale.find({ ...filter })
      .populate("client")
      .populate("saleReturn")
      .populate("agent")
      .exec();
    return { result: true, sales: sales };
  } catch (err) {
    return { result: false, sales: [], message: err.message };
  }
};

const getSaleReturns = async () => {
  try {
    const saleReturns = await SaleReturn.find({}).populate("client").exec();
    return { result: true, saleReturns };
  } catch (err) {
    return { result: false, saleReturns: [], message: err.message };
  }
};

const markReturnAsReceived = async (returnId) => {
  try {
    const edited = await SaleReturn.findByIdAndUpdate(returnId, {
      status: "received",
    });
    return { result: true, message: "Marked as received!" };
  } catch (err) {
    return { result: false, message: err.message };
  }
};

const markReturnAsLost = async (returnId) => {
  try {
    const edited = await SaleReturn.findByIdAndUpdate(returnId, {
      status: "lost",
    });
    return { result: true, message: "Marked as lost!" };
  } catch (err) {
    return { result: false, message: err.message };
  }
};

module.exports = {
  createSale,
  editSale,
  addSaleReturn,
  confirmSale,
  dispatchSale,
  markSaleAsDone,
  getAllSales,
  filterSales,
  getSaleReturns,
  markReturnAsReceived,
  markReturnAsLost,
};
