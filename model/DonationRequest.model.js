const mongoose = require("mongoose");

const donationRequestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    goal: { type: Number, required: true },
    date: { type: String, required: true },
    userID: { type: String, required: true },
    name: { type: String, required: true },
    organizationName: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    raised: { type: Number, required: true },
    matched: { type: Boolean, required: true },
  },
  { versionKey: false }
);

const donationRequestModel = mongoose.model(
  "donationRequest",
  donationRequestSchema
);

module.exports = donationRequestModel;
