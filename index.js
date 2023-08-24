const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connection = require("./DB");
dotenv.config();
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const donationRouter = require("./routes/donationRoutes");
const historyRouter = require("./routes/history");
app.use(express.json());
app.use(cors());

// Routes
app.use("/user", userRouter);
app.use("/donation", donationRouter);
app.use("/history", historyRouter);
app.get("/regentoken", (req, res) => {
  const rtoken = req.headers?.authorization?.split(" ")[1];
  if (!rtoken) {
    res.status(401).send({ error: "token missing" });
  } else {
    jwt.verify(rtoken, process.env.SECRET2, (err, decoded) => {
      if (err) {
        if (err.expiredAt) {
          res.status(401).send({ error: "token expired" });
        } else {
          res.status(500).send({ error: "internal server error" });
        }
      } else if (!decoded) {
        res.status(401).send({ error: "invalid refresh token" });
      } else if (decoded) {
        let token = jwt.sign(
          {
            name: decoded.name,
            id: decoded.id,
            organizationName: decoded.organizationName,
          },
          process.env.SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.send({ "regenerated token": token });
      }
    });
  }
});

// connect to DB using mongoose and dotenv from DB.js
app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
});
