const express = require("express");
const donationHistoryModel = require("../model/DonationHistory.model");
const auth = require("../middleware/auth");
const historyRouter = express.Router();

historyRouter.post("/create", async (req, res) => {
  const { donor, amount, date, time, message, userID, donationRequestID } =
    req.body;
  try {
    const donationHistory = new donationHistoryModel({
      donor,
      amount,
      date,
      time,
      message,
      userID,
      donationRequestID,
    });
    await donationHistory.save();
    res.status(201).json(donationHistory);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

historyRouter.get("/get", auth, async (req, res) => {
  const { donationRequestID } = req.body;
  try {
    const donationHistory = await donationHistoryModel.find({
      userID: req.body.userID,
      donationRequestID: donationRequestID,
    });
    res.status(200).json(donationHistory);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = historyRouter;