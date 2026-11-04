import multer from "multer";
import crypto from "node:crypto";
import path from "node:path";
// Returns a StorageEngine implementation configured to store files on the local file system.
/*
There are two options available, destination and filename. They are both functions that determine where the file should be stored.
If no destination is given, the operating system's default directory for temporary files is used.
filename is used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn't include any file extension.
Source: https://github.com/expressjs/multer
*/
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    // Prefix a random id so concurrent uploads with the same original name
    // never overwrite each other, and strip any directory components.
    const safeName = path
      .basename(file.originalname)
      .replace(/[^\w.-]/g, "_")
      .slice(-100);
    callback(null, `${crypto.randomUUID()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  // Product images only: max 10 MB each, at most 4 files.
  limits: { fileSize: 10 * 1024 * 1024, files: 4 },
  fileFilter: function (req, file, callback) {
    if (ALLOWED_IMAGE_TYPES.has(file.mimetype)) return callback(null, true);
    const error = new multer.MulterError(
      "LIMIT_UNEXPECTED_FILE",
      file.fieldname,
    );
    error.message = "Only JPEG, PNG, WebP, GIF or AVIF images can be uploaded.";
    callback(error);
  },
});
export default upload;
