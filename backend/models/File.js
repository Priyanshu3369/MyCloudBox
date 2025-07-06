const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  public_id: String,
  url: String,
  name: String,
  format: String,
  size: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
