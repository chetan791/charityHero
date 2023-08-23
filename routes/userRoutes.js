const express = require("express");
const userModel = require("../model/userModel");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const blacklistModel = require("../model/blacklist");
dotenv.config();

userRouter.post("/register", async (req, res) => {
  const { name, password, email, organization } = req.body;
  try {
    const verify = await userModel.findOne({ email });
    if (verify) {
      res.status(401).json({ message: "User already exists" });
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          res.status(500).json({ message: err.message });
        }
        const user = new userModel({
          name,
          password: hash,
          email,
          organization,
        });
        await user.save();
        res.status(200).json({ message: "User created" });
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    user = await userModel.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email" });
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res.status(500).json({ message: "Internal server error" });
        } else if (result) {
          let token = jwt.sign(
            {
              name: user.name,
              id: user._id,
              organizationName: user.organization,
            },
            process.env.SECRET,
            {
              expiresIn: "1d",
            }
          );
          let rtoken = jwt.sign(
            {
              name: user.name,
              id: user._id,
              organizationName: user.organization,
            },
            process.env.SECRET2,
            {
              expiresIn: "7d",
            }
          );
          res.status(200).json({ message: "Login successful", token, rtoken });
        } else {
          res.status(401).json({ message: "Invalid password" });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRouter.post("/logout", async (req, res) => {
  const { token } = req.body;
  try {
    const blacklist = new blacklistModel({ token });
    await blacklist.save();
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = userRouter;
