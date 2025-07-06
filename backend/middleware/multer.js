const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (![".jpg", ".jpeg", ".png", ".pdf", ".docx", ".xlsx", ".txt", ".mp4"].includes(ext.toLowerCase())) {
    return cb(new Error("Unsupported file type"), false);
  }
  cb(null, true);
};

module.exports = multer({ storage, fileFilter });
