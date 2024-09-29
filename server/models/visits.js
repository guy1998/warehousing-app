const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  address: { type: String, required: true },
  timeStart: {
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
  duration: { type: Number, required: true, default: 0 },
  status: {
    type: String,
    enum: ["ongoing", "successful", "unsuccessful"],
    default: "ongoing",
  },
  imagePaths: [String],
  notes: { type: String, required: false },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Client",
  },
  location: { type: String, required: true },
});

const visitModel = mongoose.model("Visit", visitSchema);

module.exports = visitModel;
