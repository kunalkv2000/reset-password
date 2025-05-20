import express from "express";
import {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyAccount,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
  getUser,
  verifyResetOtp,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", userAuth, logout);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyAccount);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/user", userAuth, getUser);
authRouter.post("/verify-reset-otp", verifyResetOtp);

export default authRouter;
