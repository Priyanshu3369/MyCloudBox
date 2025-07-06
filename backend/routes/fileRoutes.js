const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/fileController');
const upload = require('../middleware/multer');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/upload', authMiddleware, upload.single('file'), uploadFile);

module.exports = router;
