import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import multer from "multer";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

/**********************************
 ********** App Config ************
 ********************************** */
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// The API is usually deployed behind a single reverse proxy (e.g. Vercel).
// Trusting exactly one hop lets rate limiting see the real client IP without
// allowing clients to spoof it through the X-Forwarded-For header.
app.set("trust proxy", 1);

/**********************************
 ********** Middlewares ***********
 ********************************** */
// Secure HTTP response headers (also removes the X-Powered-By header).
// Cross-origin resource policy is relaxed because the storefront and the admin
// panel are served from different origins than this API.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json());
// Express 5 leaves req.body undefined when no body was parsed. Keep the
// Express 4 behaviour (an empty object) that the controllers rely on.
app.use((req, res, next) => {
  if (req.body === undefined) req.body = {};
  next();
});
// CORS: by default the API can be accessed from any origin (previous behaviour).
// Set CORS_ORIGINS to a comma separated list of origins to restrict it, e.g.
// CORS_ORIGINS=https://shop.example.com,https://admin.example.com
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : undefined));

// Slow down brute-force attempts against the authentication endpoints.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res) =>
    res.status(429).json({
      success: false,
      message: "Too many attempts. Please wait a few minutes and try again.",
    }),
});

/**********************************
 ********* API Endpoints **********
 ********************************** */
app.use("/api/user", authLimiter, userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.get("/", (req, res) => {
  res.send("API is Working");
});

// Return errors (e.g. rejected uploads or malformed JSON) in the same
// { success, message } shape the clients already understand.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Each image must be 10 MB or smaller."
        : err.message;
    return res.status(400).json({ success: false, message });
  }
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    success: false,
    message: status >= 500 ? "Something went wrong." : err.message,
  });
});

app.listen(port, () => {
  console.log(`Server started on PORT : ${port}`);
});
