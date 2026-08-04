import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "./models/userModel.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URL);

const hashedPassword = await bcrypt.hash("b.a.k.h.o.m", 10);

const adminExists = await User.findOne({
  email: "admin@gmail.com",
});

if (adminExists) {
  console.log("Admin already exists");
  process.exit();
}

await User.create({
  name: "Admin",
  email: "admin@gmail.com",
  password: hashedPassword,
  role: "admin",
});

console.log("Admin created successfully");

process.exit();