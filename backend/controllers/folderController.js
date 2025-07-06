const Folder = require('../models/Folder');

exports.createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const newFolder = new Folder({ name, userId: req.user.id });
    await newFolder.save();
    res.status(201).json(newFolder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create folder' });
  }
};

exports.getUserFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
};
