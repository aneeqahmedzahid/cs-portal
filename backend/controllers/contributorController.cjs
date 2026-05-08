const Contributor = require('../models/Contributor.cjs');

exports.getContributors = async (req, res) => {
  try {
    const contributors = await Contributor.find().sort({ order: 1, createdAt: -1 });
    res.json(contributors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createContributor = async (req, res) => {
  try {
    const contributor = new Contributor(req.body);
    await contributor.save();
    res.status(201).json(contributor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateContributor = async (req, res) => {
  try {
    const contributor = await Contributor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contributor) return res.status(404).json({ error: 'Contributor not found' });
    res.json(contributor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteContributor = async (req, res) => {
  try {
    const contributor = await Contributor.findByIdAndDelete(req.params.id);
    if (!contributor) return res.status(404).json({ error: 'Contributor not found' });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
