const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createFolder, getUserFolders } = require('../controllers/folderController');

router.post('/create', authMiddleware, createFolder);
router.get('/my-folders', authMiddleware, getUserFolders);

module.exports = router;
