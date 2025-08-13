const multer = require('multer');
const path = require('path');
// multer ---------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'assets', 'images')); // Directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});
const storageCv = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save the file in the 'public/assets/bulkorder' directory
    cb(null, path.join(__dirname, '..', 'public', 'assets', 'bulkorder'));
  },
  filename: function (req, file, cb) {
    // Save the file with a unique timestamp as the filename
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename based on timestamp
  }
});
const storageMLR = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save the file in the 'public/assets/bulkorder' directory
    cb(null, path.join(__dirname, '..', 'public', 'assets', 'manualLR'));
  },
  filename: function (req, file, cb) {
    // Save the file with a unique timestamp as the filename
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename based on timestamp
  }
});
const storageDeliveryInvoice = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save the file in the 'public/assets/bulkorder' directory
    cb(null, path.join(__dirname, '..', 'public', 'assets', 'DelhiveryInvoice'));
  },
  filename: function (req, file, cb) {
    // Save the file with a unique timestamp as the filename
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename based on timestamp
  }
});
const uploadInvoice = multer({ storage: storageDeliveryInvoice });

const uploadLR = multer({ storage: storageMLR });


// Create multer upload instance
const upload = multer({ storage: storage });


const uploadcv = multer({ storage: storageCv });

const storageclient = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'assets', 'clientdocs'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const clientdocs = multer({
  storage: storageclient,
  limits: { fileSize: 5 * 1024 * 1024 } 
}).fields([
  { name: 'selfie', maxCount: 1 },
  { name: 'aadhaarUpload', maxCount: 1 },
  { name: 'companyRegUpload', maxCount: 1 },
  { name: 'pandoc', maxCount: 1 },
  { name: 'gstdoc', maxCount: 1 },
  { name: 'clientLogo', maxCount: 1 },
  { name: 'cancelledCheckUpload', maxCount: 1 }

]);

// Configure multer for file uploads
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const storageExcel = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save the file in the 'public/assets/excel' directory
    cb(null, path.join(__dirname, '..', 'public', 'assets', 'excel'));
  },
  filename: function (req, file, cb) {
    // Save the file with a unique timestamp as the filename
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename based on timestamp
  }
});

const uploadExcel = multer({ storage: storageExcel });
const upload2 = multer({ storage: storage2 });

// ---------------- Exports ----------------
module.exports = {
  upload,        // for general images
  uploadcv,      // for bulkorder CSV
  uploadLR,      // for manualLR
  uploadInvoice, // for DelhiveryInvoice
  clientdocs,     // for multi-field client docs
  upload2,
  uploadExcel
};