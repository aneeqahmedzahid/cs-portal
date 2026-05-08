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

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
}, transformSchema);

adminSchema.index({ created_at: -1 });

module.exports = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
