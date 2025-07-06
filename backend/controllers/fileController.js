const cloudinary = require('../utils/cloudinary');
const File = require('../models/File');

exports.uploadFile = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto'
    });

    const file = await File.create({
      userId: req.user.id,
      public_id: result.public_id,
      url: result.secure_url,
      name: result.original_filename,
      format: result.format,
      size: result.bytes,
    });

    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
