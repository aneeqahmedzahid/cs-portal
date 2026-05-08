const Event = require('../models/Event.cjs');

const serializeDocument = (doc) => {
  if (!doc) return doc;
  const serialized = { ...doc, id: doc._id?.toString?.() || doc.id };
  delete serialized._id;
  delete serialized.__v;
  return serialized;
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ event_date: 1 }).lean();
    res.json(events.map(serializeDocument));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) return res.status(404).json({ error: 'Not found' });
    res.json(serializeDocument(event));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    req.body.updated_at = Date.now();
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
