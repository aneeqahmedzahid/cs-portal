const mongoose = require('mongoose');

const contributorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String },
  image_url: { type: String },
  github: { type: String },
  linkedin: { type: String },
  portfolio: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Contributor', contributorSchema);
