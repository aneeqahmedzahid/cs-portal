const News = require('../models/News.cjs');

const serializeDocument = (doc) => {
  if (!doc) return doc;
  const serialized = { ...doc, id: doc._id?.toString?.() || doc.id };
  delete serialized._id;
  delete serialized.__v;
  return serialized;
};

const getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ created_at: -1 }).lean();
    res.json(news.map(serializeDocument));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).lean();
    if (!news) return res.status(404).json({ error: 'Not found' });
    res.json(serializeDocument(news));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createNews = async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateNews = async (req, res) => {
  try {
    req.body.updated_at = Date.now();
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getNews, getNewsById, createNews, updateNews, deleteNews };
