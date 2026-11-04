import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
// Placing orders using COD method
const placeOrder = async (req, res) => {
  try {
    const { userID, items, amount, address } = req.body;
    const orderData = {
      userID,
      address,
      items,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userID, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
const placeOrderSepah = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
const placeOrderTejarat = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
// User Order Data For Frontend
const userOrders = async (req, res) => {
  try {
    const { userID } = req.body;
    const orders = await orderModel.find({ userID });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status, statusState } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status, statusState });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderSepah,
  placeOrderTejarat,
  allOrders,
  userOrders,
  updateStatus,
};
