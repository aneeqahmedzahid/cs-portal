const express = require('express');
const router = express.Router();
const { getFaculty, createFaculty, updateFaculty, deleteFaculty } = require('../controllers/facultyController.cjs');
const authMiddleware = require('../middleware/authMiddleware.cjs');

router.get('/', getFaculty);
router.post('/', authMiddleware, createFaculty);
router.put('/:id', authMiddleware, updateFaculty);
router.delete('/:id', authMiddleware, deleteFaculty);

module.exports = router;
