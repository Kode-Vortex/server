import express from "express";
import {RegisterUser , LoginUser, authUser , getUser , LogoutUser , Forgotpasword } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/register").post(RegisterUser)
router.route("/login").post(LoginUser)
router.route("/get-user").get(authenticate , getUser)
router.route("/logout").get(authenticate ,LogoutUser)
router.route("/google").get(authUser)
router.route("/forgot-password").post(Forgotpasword)


export default router;

