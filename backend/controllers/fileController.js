const cloudinary = require('../utils/cloudinary');
const File = require('../models/File');

// Upload file with optional folderId
exports.uploadFile = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto'
    });

    const { folderId } = req.body;

    const file = await File.create({
      userId: req.user.id,
      public_id: result.public_id,
      url: result.secure_url,
      name: result.original_filename,
      format: result.format,
      size: result.bytes,
      folderId: folderId || null  // ✅ new: assign to folder if provided
    });

    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Files for the logged-in user
exports.getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};

// ✅ NEW: Get files inside a specific folder
exports.getFilesByFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const files = await File.find({
      userId: req.user.id,
      folderId: folderId
    }).sort({ createdAt: -1 });

    res.json(files);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch files for folder' });
  }
};


// 🌐 Public File Access
exports.getFilePublic = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json({
      name: file.name,
      format: file.format,
      url: file.url,
      createdAt: file.createdAt
    });
  } catch (err) {
    console.error("❌ Public file fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch file" });
  }
};



// Delete a file
exports.deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    console.log("🧪 Requested delete for file ID:", fileId);

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (file.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    console.log("🧾 File data:", file);

    if (file.public_id) {
      let resourceType = 'raw'; // default
      const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      const videoFormats = ['mp4', 'mov', 'avi', 'webm'];

      if (imageFormats.includes(file.format)) {
        resourceType = 'image';
      } else if (videoFormats.includes(file.format)) {
        resourceType = 'video';
      }

      try {
        const result = await cloudinary.uploader.destroy(file.public_id, {
          resource_type: resourceType,
        });
        console.log(`✅ Cloudinary (${resourceType}) delete result:`, result);
      } catch (cloudErr) {
        console.error("❌ Cloudinary error:", cloudErr.message);
        return res.status(500).json({ error: 'Cloudinary deletion failed' });
      }
    }

    await file.deleteOne();
    console.log("✅ File deleted from DB:", file.name);
    res.json({ message: 'File deleted successfully' });

  } catch (err) {
    console.error("🔥 Server error during file delete:", err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};
