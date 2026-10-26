const mongoose = require("mongoose");
const config = require("./config");

async function connectDB() {
  const mongourl = config.MONGODB_URI;
  if (!mongourl) {
    throw new Error("MONGODB_URI is missing from environment variables");
  }
  await mongoose.connect(mongourl);

  console.log("mongodb is connected successfully");
}

module.exports = connectDB;
