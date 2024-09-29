const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  clientname: { type: String, required: true },
  company_name: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  zone: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true, validate: () => true },
  email: { type: String, required: true, validate: () => true },
  type: { type: String, enum: ["horeca", "retail"], default: "retail" },
});

const clientModel = mongoose.model("Client", clientSchema);

module.exports = clientModel;
