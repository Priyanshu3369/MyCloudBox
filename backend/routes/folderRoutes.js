const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createFolder, getUserFolders,renameFolder, deleteFolder } = require('../controllers/folderController');

router.post('/create', authMiddleware, createFolder);
router.get('/my-folders', authMiddleware, getUserFolders);
router.put('/rename/:id', authMiddleware, renameFolder);
router.delete('/:id', authMiddleware, deleteFolder);

module.exports = router;
