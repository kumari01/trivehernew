// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const nodemailer = require("nodemailer");

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Reusable sendMail function
async function sendMail(to, subject, text, html) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };
  return transporter.sendMail(mailOptions);
}

// Test email endpoint
app.post("/api/test-email", async (req, res) => {
  const { to, subject, text, html } = req.body;
  try {
    await sendMail(
      to,
      subject || "Test Email from ThriveHer",
      text || "This is a test email.",
      html || "<b>This is a test email.</b>"
    );
    res.json({ message: "Email sent successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to send email.", error: err.message });
  }
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// In-memory store for pending signups (email -> { name, email, password, age, otp, expires })
const pendingSignups = {};

// Helper to generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Middleware to verify JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "No token provided." });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token." });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

// Protected profile route
app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ email: user.email, age: user.age });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// Signup route (step 1: send OTP)
app.post("/api/signup", async (req, res) => {
  const { name, email, password, age } = req.body;
  if (!name || !email || !password || !age) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }
    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);
    pendingSignups[email] = {
      name,
      email,
      password: hashedPassword,
      age,
      otp,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    };
    await sendMail(
      email,
      "Your ThriveHer Signup OTP",
      `Your OTP for ThriveHer signup is: ${otp}`,
      `<p>Your OTP for ThriveHer signup is: <b>${otp}</b></p><p>This code is valid for 10 minutes.</p>`
    );
    res.json({
      message: "OTP sent to your email. Please verify to complete signup.",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// OTP verification route (step 2: verify OTP and create user)
app.post("/api/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const pending = pendingSignups[email];
  if (!pending) {
    return res
      .status(400)
      .json({ message: "No pending signup for this email." });
  }
  if (pending.expires < Date.now()) {
    delete pendingSignups[email];
    return res
      .status(400)
      .json({ message: "OTP expired. Please sign up again." });
  }
  if (pending.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP." });
  }
  try {
    const user = new User({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      age: pending.age,
    });
    await user.save();
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    delete pendingSignups[email];
    res.status(201).json({
      token,
      user: { name: user.name, email: user.email, age: user.age },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.json({
      token,
      user: { name: user.name, email: user.email, age: user.age },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
