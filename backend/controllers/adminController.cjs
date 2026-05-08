const Admin = require('../models/Admin.cjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const serializeDocument = (doc) => {
  if (!doc) return doc;
  const serialized = { ...doc, id: doc._id?.toString?.() || doc.id };
  delete serialized._id;
  delete serialized.__v;
  return serialized;
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ error: 'Invalid email or password.' });

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password.' });

    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ session: { access_token: token, user: { email: admin.email, id: admin._id } } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, '-password').sort({ created_at: -1 }).lean();
    res.json(admins.map(serializeDocument));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Admin already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();

    const adminWithoutPassword = admin.toJSON();
    delete adminWithoutPassword.password;
    res.status(201).json(adminWithoutPassword);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`Uploading file: ${req.file.originalname}, size: ${req.file.size}`);

    // Wrap Cloudinary upload in a Promise for Vercel serverless stability
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'cs-portal',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload_stream error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(req.file.buffer);
    });

    console.log('Upload successful:', result.secure_url);
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error('Upload route catch error:', err);
    res.status(500).json({ 
      error: 'Upload failed. Please check backend logs.',
      details: err.message 
    });
  }
};

module.exports = { login, getAdmins, createAdmin, deleteAdmin, uploadFile };
