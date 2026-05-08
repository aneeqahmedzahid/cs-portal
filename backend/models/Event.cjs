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

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  event_date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, transformSchema);

eventSchema.index({ event_date: 1 });

module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);
