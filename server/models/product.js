const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true, unique: true },
  code: {
    type: String,
    required: true,
    validate: () => true,
    default: () => uuidv4(),
  },
  category: { type: String, required: true, default: "returned" },
  brand: { type: String, required: true, default: "returned" },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true },
  priceHoreca: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    default: 0,
  },
  priceRetail: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    default: 0,
  },
  stockAlertQuantity: { type: Number, required: true, default: 0 },
  description: { type: String, required: false },
});

productSchema.methods.increaseQuantity = async function (addedQuantity) {
  this.quantity = parseInt(this.quantity) + parseInt(addedQuantity);
  await this.save();
};

productSchema.methods.decreaseQuantity = async function (subtractedQuantity) {
  if (subtractedQuantity <= this.quantity) {
    this.quantity = parseInt(this.quantity) - parseInt(subtractedQuantity);
    await this.save();
  } else {
    throw new Error(
      "It seems like quantity of this product was decreased by another user!"
    );
  }
};

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
