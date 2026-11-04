import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    // By default, Mongoose ignores empty objects (e.g., the default cartData)
    // and does not store them.
    // This option ensures empty objects are not omitted from the database.
    /*With mongoose an empty object is not normally saved to a document due to
    the minimize: true default settings so when you return the document from 
    a query won't show.
    To work around that you need to add the { minimize: false } option to your
    schema which tells mongoose not to minimize those empty objects when you
    convert to JSON. */
  },
  { minimize: false },
);

// Return the Created User Model or create a new User Model
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
