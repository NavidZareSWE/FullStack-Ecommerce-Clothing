import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
const addProduct = async (req, res) => {
  /* Creating a middleware using multer, so if we send any file as form data,
   then that file will be parsed by multer. Multer handles file uploads and
   makes them accessible in req.file or req.files depending on the upload method.
    [ℹ️] what is middleware?
        Middleware in the context of web development, especially in frameworks
        like Express.js, refers to functions that are executed in the middle of
        the request-response cycle. These functions have access to the request
        object (req), the response object (res), and the next middleware function
        in the application’s request-response cycle.
    */

  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );
    let imagesURL = await Promise.all(
      images.map(async (item) => {
        try {
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        } catch (error) {
          console.error("Error uploading image:", item.originalname, error);
          throw new Error("Invalid image file");
        }
      }),
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesURL,
      date: Date.now(),
    };
    const product = new productModel(productData);
    // validate() resolves when valid and rejects with the validation error
    // otherwise (validateSync() is deprecated in Mongoose 9).
    const validationError = await product.validate().then(
      () => null,
      (error) => error,
    );
    if (validationError) {
      console.error("Validation failed:", validationError);
    } else {
      await product.save();
      console.log("Product saved successfully");
    }
    res.json({ success: true, message: "New product has been added." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: `Product has been removed` });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct, getSingleProduct };
