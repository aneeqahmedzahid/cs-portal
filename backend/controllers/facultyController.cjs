const Faculty = require('../models/Faculty.cjs');

const serializeDocument = (doc) => {
  if (!doc) return doc;
  const serialized = { ...doc, id: doc._id?.toString?.() || doc.id };
  delete serialized._id;
  delete serialized.__v;
  return serialized;
};

const getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find().sort({ name: 1 }).lean();
    res.json(faculty.map(serializeDocument));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createFaculty = async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    res.status(201).json(faculty);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateFaculty = async (req, res) => {
  try {
    req.body.updated_at = Date.now();
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    res.json(faculty);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getFaculty, createFaculty, updateFaculty, deleteFaculty };
