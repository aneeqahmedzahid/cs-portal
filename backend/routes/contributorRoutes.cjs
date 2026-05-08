const express = require('express');
const router = express.Router();
const { getContributors, createContributor, updateContributor, deleteContributor } = require('../controllers/contributorController.cjs');
const authMiddleware = require('../middleware/authMiddleware.cjs');

router.get('/', getContributors);
router.post('/', authMiddleware, createContributor);
router.put('/:id', authMiddleware, updateContributor);
router.delete('/:id', authMiddleware, deleteContributor);

module.exports = router;
