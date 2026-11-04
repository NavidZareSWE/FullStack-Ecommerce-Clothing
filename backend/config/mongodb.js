import mongoose from "mongoose";

// Treat any `$`-prefixed keys coming from request data as literal values
// instead of query operators. This prevents NoSQL operator injection such as
// { "email": { "$ne": null } } in query filters.
mongoose.set("sanitizeFilter", true);

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB Connected");
  });
  await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
};
export default connectDB;
