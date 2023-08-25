const mongoose = require("mongoose");

const donationHistorySchema = new mongoose.Schema(
  {
    donor: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    phone: { type: Number, required: true },
    message: { type: String },
    userID: { type: String, required: true },
    donationRequestID: { type: String, required: true },
  },
  { versionKey: false }
);

const donationHistoryModel = mongoose.model(
  "donationHistory",
  donationHistorySchema
);

module.exports = donationHistoryModel;
