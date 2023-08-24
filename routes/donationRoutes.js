const express = require("express");
const donationRequestModel = require("../model/DonationRequest.model");
const auth = require("../middleware/auth");
const donationRouter = express.Router();

donationRouter.get("/request", async (req, res) => {
  const { category, order, sort, goal, matched, raised, searched, page } =
    req.query;
  const pipeline = [];

  // Match stage: Filter based on query parameters
  const matchStage = {};
  if (category) {
    const categories = category ? JSON.parse(category) : [];
    console.log(typeof categories);
    matchStage.category = { $in: categories };
  }
  if (goal) {
    if (goal == 1) {
      matchStage.goal = { $lte: 50 };
    }
    if (goal == 2) {
      matchStage.goal = { $lte: 100 };
    }
    if (goal == 3) {
      matchStage.goal = { $lte: 250 };
    }
    if (goal == 4) {
      matchStage.goal = { $lte: 500 };
    }
    if (goal == 5) {
      matchStage.goal = { $lte: 1000 };
    }
    if (goal == 6) {
      matchStage.goal = { $gt: 1000 };
    }
  }
  if (matched) {
    matchStage.matched = true;
  }
  if (raised == 0) {
    matchStage.raised = 0;
  }
  if (searched) {
    matchStage.$or = [{ name: { $regex: searched, $options: "i" } }];
  }
  const getCount = await donationRequestModel.aggregate(pipeline);
  let current = +page || 1;
  pipeline.push({ $skip: (current - 1) * 5 }, { $limit: 5 });
  pipeline.push({ $match: matchStage });

  if (order) {
    pipeline.push({ $sort: { goal: order == "asc" ? 1 : -1 } });
  }

  try {
    const donationRequests = await donationRequestModel.aggregate(pipeline);
    res
      .status(200)
      .json({ data: donationRequests, totalCount: getCount.length });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// get all donation requests of that spercific user
donationRouter.get("/", auth, async (req, res) => {
  const { userID } = req.body;
  try {
    const donationRequests = await donationRequestModel.find({ userID });
    res.status(200).json(donationRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create a new donation request
donationRouter.post("/create", auth, async (req, res) => {
  const { title } = req.body;
  try {
    existing_title = donationRequestModel.findOne({ title: title });
    if (existing_title) {
      res.status(400).json({ message: "The donation Request already exist" });
    } else {
      const donationRequest = await donationRequestModel.create(req.body);
      donationRequest.save();
      res.status(201).json(donationRequest);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// edit a specific donation request
donationRouter.patch("/edit/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const isuser = await donationRequestModel.findById(id);
    if (isuser.userID !== req.body.userID) {
      res.status(401).json({ message: "Not Authorized" });
    } else {
      const donationRequest = await donationRequestModel.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      res.status(200).json("Donation Request updated successfully");
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// delete a specific donation request
donationRouter.delete("/delete/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const isuser = await donationRequestModel.findById(id);
    if (isuser.userID !== req.body.userID) {
      res.status(401).json({ message: "Not Authorized" });
    } else {
      const donationRequest = await donationRequestModel.findByIdAndDelete(id);
      res.status(200).json("Donation Request updated successfully");
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = donationRouter;