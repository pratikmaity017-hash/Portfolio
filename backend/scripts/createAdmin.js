require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../src/models/admin.model");
const connectDB = require("../src/config/db");

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  }

  if (password.length < 12) {
    throw new Error("Admin password must be at least 12 characters");
  }

  await connectDB();

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    throw new Error("This admin account already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await Admin.create({ email, passwordHash });

  console.log("Admin account created successfully");
}

createAdmin()
  .catch((error) => {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
