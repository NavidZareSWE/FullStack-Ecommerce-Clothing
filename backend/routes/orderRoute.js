import express from "express";
import {
  placeOrder,
  placeOrderSepah,
  placeOrderTejarat,
  allOrders,
  userOrders,
  updateStatus,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminauth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin Features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Payment Features
// Route to place a new order for COD
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/sepah", authUser, placeOrderSepah);
orderRouter.post("/tejarat", authUser, placeOrderTejarat);

// User Feature
orderRouter.post("/userorders", authUser, userOrders);

export default orderRouter;
