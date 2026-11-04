import jwt from "jsonwebtoken";

const adminAuth = async (req, res, callback) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not authorized, Login Again",
      });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    // The admin token carries only a role and the admin email (never the
    // password), see adminLogin in controllers/userController.js
    if (
      !token_decode ||
      typeof token_decode !== "object" ||
      token_decode.role !== "admin" ||
      token_decode.email !== process.env.ADMIN_EMAIL
    ) {
      return res.json({
        success: false,
        message: "Not authorized, Login Again",
      });
    }
    callback();
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
export default adminAuth;
