// middlewares/uploadExcel.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.xlsx';
    cb(null, `express-orders-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  cb(/\.(xlsx|xls)$/i.test(file.originalname) ? null : new Error('Only .xlsx/.xls allowed'), /\.(xlsx|xls)$/i.test(file.originalname));
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});
