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

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  interests: { type: String, default: '' },
  image_url: { type: String, default: '' },
  link: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, transformSchema);

facultySchema.index({ name: 1 });

module.exports = mongoose.models.Faculty || mongoose.model('Faculty', facultySchema);
