const mongoose = require('mongoose');

const transformSchema = {
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
};

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  image_url: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, transformSchema);

newsSchema.index({ created_at: -1 });

module.exports = mongoose.models.News || mongoose.model('News', newsSchema);
