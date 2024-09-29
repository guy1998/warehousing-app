const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { passwordHasher } = require("../utils/security-ground");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, validate: () => true, unique: true },
  phone: { type: String, required: true, validate: () => true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "retail_agent", "horeca_agent"] },
  url_identifier: { type: String, default: () => uuidv4() },
  status: { type: String, enum: ["active", "banned"], default: "active" },
});

userSchema.pre("save", async function (next) {
  const user = this;
  // Only hash the password if it has been modified or is new
  if (!user.isModified("password")) return next();

  user.password = passwordHasher(user.password);
  next();
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
