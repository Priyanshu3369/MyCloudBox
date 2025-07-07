const File = require('../models/File');
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


exports.renameFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) return res.status(404).json({ error: 'Folder not found' });
    if (folder.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    folder.name = req.body.name;
    await folder.save();

    res.json({ message: 'Folder renamed', folder });
  } catch (err) {
    res.status(500).json({ error: 'Failed to rename folder' });
  }
};


exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) return res.status(404).json({ error: 'Folder not found' });
    if (folder.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    const { deleteFiles } = req.query;

    if (deleteFiles === 'true') {
      // Delete files in this folder
      await File.deleteMany({ folder: folder._id });
    } else {
      // Just remove folder association from files
      await File.updateMany({ folder: folder._id }, { $unset: { folder: '' } });
    }

    await folder.deleteOne();

    res.json({ message: 'Folder deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete folder' });
  }
};
