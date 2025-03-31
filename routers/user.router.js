import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";
const router = express.Router();
import { google } from "googleapis";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()


const generateBothTokens = async (userid) => {
  try {
    const user = await User.findById(userid);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error!!!" });
  }
};

router.get("/" , async (req,res) => {
    res.send("Hello Harsh!!!")
})
router.post("/register" , async (req,res)=>{

  
     try {
        const { fullname, email, phone_no, password, message } = req.body;
    
        
    
        const isUserExist = await User.findOne({ email });
        
        if(isUserExist) {
          return res.status(201).json({ message: "Email Already exist." });
        }
    
        
    
        const user = await User.create({
          fullname,
    
          email,
          phone_no,
    
          password,
          message,
        });
    
    
        const createduser = await User.findById(user._id).select(
          "-password -refreshToken"
        );
    
        if (!createduser) {
          return res.status(202).json({ message: "Something went wrong!!!" });
        }
    
        return res.status(200).json({ message: "User Registered SuccessFully!!!" });
      } catch (error) {
        return 
      }
})
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User does not exist!" });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Password is incorrect!" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateBothTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Set cookie options correctly
    const cookieOptions = {
      httpOnly: true,
      secure: true, // Secure only in production
      sameSite: "None", // Required for cross-domain cookies
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 }) // 1 day
      .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }) // 7 days
      .json({
        user: loggedInUser,
        accessToken,
        refreshToken,
        message: "User logged in successfully",
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


router.get("/get-user" , authenticate  ,async (req,res)=>{
    try {

      console.log("xekjv bnm");
      
      
        const user = req.user;
    
        return res.status(200).json({ user: user });
      } catch (error) {
        return res.status(400).json({ message: "Internal Server Error" });
      }
})

router.get("/logout" , authenticate , async (req,res) => {
      await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
      );
      const options = {
        httpOnly: true,
        secure: true,
      };
    
      return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ message: "User logged Out" });
})

const GOOGLE_CLIENT_ID =  process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;




const oauth2client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:5173" // Ensure this matches your Google OAuth redirect URI
);


router.get("/google" , async (req,res) => {
    try {
        const { code } = req.query;
    
        if (!code) {
          return res
            .status(400)
            .json({ message: "Authorization code is required." });
        }
    
        // Exchange the code for tokens
        const { tokens } = await oauth2client.getToken(code);
        oauth2client.setCredentials(tokens);
    
        // Fetch user info from Google
        const userRes = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
        );
    
        const {
          email,
          given_name: fullname,
        } = userRes.data;
    
        // Find or create the user in your database
        let user = await User.findOne({ email });
        if (!user) {
          // user = await User.create({ username, firstname, lastname, email });
          return res.status(201).json({ message: "Registred First!!!" });
        }
    
        // Generate a JWT token
        const { accessToken, refreshToken } = await generateBothTokens(user._id);
    
    
        const loggedInuser = await User.findById(user._id).select(
          "-password -refreshToken"
        );
    
        const options = {
          httpOnly: true,
          secure: true,
        };
    
        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json({
            user: loggedInuser,
            accessToken,
            refreshToken,
            message: "User logged in successfully",
          });
      } catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
})


router.post("/forgot-password" , async (req,res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Generate a reset token
      const resetToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      // Save the reset token to the user document
      user.resetToken = resetToken;
      await user.save();
  
      // Send an email with the reset link
      const resetLink = `https://yourapp.com/reset-password?token=${resetToken}`;
      await sendEmail(
        email,
        "Password Reset",
        `Click here to reset your password: ${resetLink}`
      );
  
      return res
        .status(200)
        .json({ message: "Password reset link sent to your email." });
    } catch (error) {
      console.error("Forgot Password Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
})


export default router;

