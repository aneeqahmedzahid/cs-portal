const express = require('express');
const router = express.Router();
const multer = require('multer');
const { login, getAdmins, createAdmin, deleteAdmin, uploadFile } = require('../controllers/adminController.cjs');
const authMiddleware = require('../middleware/authMiddleware.cjs');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Auth routes
router.post('/auth/login', login);

// Admin management routes
router.get('/admins', authMiddleware, getAdmins);
router.post('/admins', authMiddleware, createAdmin);
router.delete('/admins/:id', authMiddleware, deleteAdmin);

// Upload routes
router.post('/upload', authMiddleware, upload.single('file'), uploadFile);

module.exports = router;
