import userModel from "../models/userModel.js";

// Cart keys come from the client. Reject anything that is not a plain string
// or that could reach Object.prototype (prototype pollution).
const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);
const isSafeKey = (key) =>
  typeof key === "string" &&
  key.length > 0 &&
  key.length <= 100 &&
  !FORBIDDEN_KEYS.has(key);
const invalidCartRequest = (res) =>
  res.json({ success: false, message: "Invalid cart item" });
const addToCart = async (req, res) => {
  try {
    const { userID, itemid, size } = req.body;
    if (!isSafeKey(itemid) || !isSafeKey(size)) return invalidCartRequest(res);
    const userData = await userModel.findById(userID);
    let cartData = await userData.cartData;
    if (Object.hasOwn(cartData, itemid))
      if (Object.hasOwn(cartData[itemid], size)) {
        cartData[itemid][size]++;
      } else {
        cartData[itemid][size] = 1;
      }
    else {
      cartData[itemid] = {};
      cartData[itemid][size] = 1;
    }
    await userModel.findByIdAndUpdate(userID, { cartData });
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
const updateCart = async (req, res) => {
  try {
    const { userID, itemid, size, quantity } = req.body;
    if (
      !isSafeKey(itemid) ||
      !isSafeKey(size) ||
      typeof quantity !== "number" ||
      !Number.isFinite(quantity) ||
      quantity < 0
    )
      return invalidCartRequest(res);
    const userData = await userModel.findById(userID);
    let cartData = await userData.cartData;
    if (!Object.hasOwn(cartData, itemid)) cartData[itemid] = {};
    cartData[itemid][size] = quantity;
    await userModel.findByIdAndUpdate(userID, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
const getUserCart = async (req, res) => {
  try {
    const { userID } = req.body;
    const userData = await userModel.findById(userID);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
