import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
} from "../controllers/userController.js";

// Create a new Router object to handle routes related to user operations
const userRouter = express.Router();

// Define the route for user registration which triggers the registerUser function
// Define the route for user login which triggers the loginUser function
// Define the route for admin login which triggers the adminLogin function
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

export default userRouter;
