import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import crypto from "node:crypto";

// Constant-time string comparison to avoid leaking information through timing.
const safeEqual = (a, b) => {
  const hashA = crypto.createHash("sha256").update(String(a)).digest();
  const hashB = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
};

const createToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
  );
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string")
      return res.json({ success: false, message: "Invalid credentials." });
    const user = await userModel.findOne({ email });
    // Use the same generic message for unknown emails and wrong passwords so
    // the login form cannot be used to discover which emails are registered.
    if (!user)
      return res.json({
        success: false,
        message: "Invalid credentials.",
      });
    /*
      The bcrypt.compare function internally hashes the plain text password
      using the same salt and algorithm that was used to create the original
      hashed password.
      It then compares the newly generated h ash with the stored hash.
      */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({
        success: false,
        message: "Invalid credentials.",
      });
    else {
      const token = createToken(user._id);
      return res.json({
        success: true,
        token,
      });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    )
      return res.json({
        success: false,
        message: "Please fill in your name, email and password",
      });
    const exists = await userModel.findOne({ email });
    if (exists)
      return res.json({
        success: false,
        message: "User with this email already exists",
      });

    if (!validator.isEmail(email))
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    // Validating password strength using the validator library and ensuring it is longer than 8 characters
    /**
             * isStrongPassword(str [, options])
             * check if the string can be considered a strong password or not. Allows for custom requirements or scoring rules. If returnScore is true, then the function returns an integer score for the password rather than a boolean.
                Default options:
                { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
             */
    if (!validator.isStrongPassword(password) || password.length <= 8)
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      typeof email === "string" &&
      typeof password === "string" &&
      process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD &&
      safeEqual(email, process.env.ADMIN_EMAIL) &&
      safeEqual(password, process.env.ADMIN_PASSWORD)
    ) {
      // Never put the admin password inside the token: JWT payloads are only
      // base64-encoded, so anyone holding the token could read it.
      const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials." });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
export { loginUser, registerUser, adminLogin };
