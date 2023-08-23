const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// connect to DB using mongoose and dotenv
const connection = mongoose.connect(process.env.mongoURL);

module.exports = connection;
