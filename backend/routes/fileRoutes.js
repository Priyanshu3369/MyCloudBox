const express = require('express');
const router = express.Router();
const { uploadFile, getUserFiles, deleteFile } = require('../controllers/fileController');
const upload = require('../middleware/multer');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/upload', authMiddleware, upload.single('file'), uploadFile);
router.post('/upload', authMiddleware, upload.single('file'), uploadFile);
router.get('/my-files', authMiddleware, getUserFiles);
router.delete('/:id', authMiddleware, deleteFile);

module.exports = router;