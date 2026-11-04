import express from "express";
import {
  addProduct,
  listProducts,
  removeProduct,
  getSingleProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminauth.js";

const productRouter = express.Router();

/* [ℹ️] Some APIs use POST for all write operations(insert, update, delete),
 including deletions, to maintain consistency in their API design.*/
productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct,
);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/single", getSingleProduct);
productRouter.get("/list", listProducts);

export default productRouter;

/**[ℹ️]
 * Reasons to Use POST for getSingleProduct

Sensitive Data:
If the request involves sending sensitive information (such as an authentication
token or other data) that shouldn't be exposed in the URL or query parameters, 
POST is more secure as it includes the data in the body of the request.

Complex Queries:
If the query to get a single product involves complex filtering criteria that 
cannot be easily or cleanly expressed in a URL query string, POST allows you to
send a more complex JSON payload in the body.

Payload Size:
URLs have length limitations, and if the request data is large,
using POST with a body allows for sending larger payloads compared to GET.

Consistency:
Some APIs use POST for all operations to maintain consistency in request
handling and processing.

State Changes:
Although GET should be idempotent and not change server state,
if the getSingleProduct operation triggers some internal logging,
tracking, or other state changes, POST might be preferred.

API Design Choices:
Some APIs are designed this way to leverage features like validation,
authorization, and auditing more efficiently within a unified POST request
processing framework.
*/

/**
 *  
The 'upload.fields' method specifies that the form data may contain fields for 'image1', 'image2', 'image3', and 'image4'(multipart form data), each allowing a maximum of 1 file.
 After processing the file uploads, the 'addProduct' function is called to handle the request.

(method) multer.Multer.fields(fields: readonly multer.Field[]): express.RequestHandler
Returns middleware that processes multiple files associated with the given form fields.
The Request object will be populated with a files object which maps each field name to an array of the associated file information objects.

param fields — Array of Field objects describing multipart form fields to process.

throws — MulterError('LIMIT_UNEXPECTED_FILE') if more than maxCount files are associated with fieldName for any field.

 * [ℹ️]
 * No, the users do not need to rename their images to image1, image2, image3, or image4. The upload.fields configuration expects the fields in the form data to be named image1, image2, image3, and image4, but the actual filenames of the uploaded images can remain unchanged.

The key here is that the names used in the name attributes of the HTML form's file input elements match those specified in the upload.fields configuration.

[ℹ️]
Optional Fields: The upload.fields configuration expects up to four image fields, but it doesn't require all of them to be present. If the user uploads only one, two, or three images, Multer will process whatever is provided.

[ℹ️]
upload.any(): This method tells Multer to accept files from any field names. All files will be available in req.files as an array.

[ℹ️]
<input type="file" name="images" id="images" multiple>
The multiple attribute is a boolean attribute.

When present, it specifies that the user is allowed to enter more than one value in the <input> element.

Note: The multiple attribute works with the following input types: email, and file.
source: https://www.w3schools.com/tags/att_input_multiple.asp

[ℹ️]
upload.fields:
Purpose: Defines where Multer should look for file inputs in the form and specifies how many files each field can accept.

Function: This configuration directs Multer to retrieve files from the specified fields and make them available in your route handler (e.g., addProduct).

file.originalname:
Purpose: Maintains the original file name as given by the client.

Function: When saving files (e.g., to a Cloudinary database), using file.originalname helps keep the filenames intuitive and organized without needing complex logic to rename or manage them. This ensures the files retain their user-provided names, making it easier to retrieve and organize both new and old files.

By combining these two features, you streamline the file upload process, ensuring that the server knows where to look for files and preserving the original filenames for easier management and organization.


*/
