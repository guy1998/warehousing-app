const mongoose = require("mongoose");
const moment = require("moment");

const soldProduct = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  priceHoreca: { type: mongoose.Schema.Types.Decimal128, required: true },
  priceRetail: { type: mongoose.Schema.Types.Decimal128, required: true },
  soldPrice: { type: mongoose.Schema.Types.Decimal128, required: true },
  unit: { type: String, required: true },
  realProduct: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "product",
  },
});

const saleSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Client",
  },
  agent: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  soldProducts: { type: [soldProduct], required: true },
  status: {
    type: String,
    enum: ["pending", "dispatched", "done", "confirm"],
    default: "pending",
  },
  saleReturn: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "SaleReturn",
  },
  date: {
    type: Date,
    required: true,
    default: () => {
      const now = new Date();
      return new Date(
        Date.UTC(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes(),
          now.getSeconds()
        )
      );
    },
  },
  paymentType: { type: String, enum: ["Bank", "Cash"] },
  type: { type: String, enum: ["horeca", "retail"] },
});

const saleModel = mongoose.model("Sale", saleSchema);
const soldProductModel = mongoose.model("SoldProduct", soldProduct);

module.exports = saleModel;
