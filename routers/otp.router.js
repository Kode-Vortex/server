// routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/nodemailer.js";
import User from "../models/user.model.js"; // Adjust the path as needed

const router = express.Router();

// Generate and send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 600000; // OTP valid for 10 minutes

    // Save OTP and expiry to the user document
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP to the user's email
    await sendEmail(email, "Password Reset OTP", `Your OTP is: ${otp}`);

    return res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Clear OTP and expiry after successful verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  const { email ,newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

   

    // Update the user's password
    user.password = newPassword; // Ensure password is hashed before saving
    await user.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;