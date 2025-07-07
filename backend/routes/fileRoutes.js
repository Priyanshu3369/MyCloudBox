const express = require('express');
const router = express.Router();
const { uploadFile, getUserFiles, deleteFile, getFilesByFolder, getFilePublic , renameFile } = require('../controllers/fileController');
const upload = require('../middleware/multer');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/upload', authMiddleware, upload.single('file'), uploadFile);
router.get('/my-files', authMiddleware, getUserFiles);
router.delete('/:id', authMiddleware, deleteFile);
router.get('/folder/:folderId', authMiddleware, getFilesByFolder);
router.get('/public/:id', getFilePublic);
router.put('/rename/:id', authMiddleware,  renameFile);
module.exports = router;