// middleware/uploadIbr.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads/ibr exists
const uploadDir = path.join(__dirname, "..", "uploads", "ibr");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // ✅ absolute safe path
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  },
});

const uploadIbr = multer({ storage });
module.exports = uploadIbr;
