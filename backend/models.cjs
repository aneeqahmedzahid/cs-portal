const mongoose = require('mongoose');

// Configure Mongoose to return `id` instead of `_id` and remove `__v` when converting to JSON
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

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  event_date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, transformSchema);
eventSchema.index({ event_date: 1 });

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
}, transformSchema);
adminSchema.index({ created_at: -1 });

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

const News = mongoose.models.News || mongoose.model('News', newsSchema);
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', facultySchema);

module.exports = { News, Event, Admin, Faculty };
