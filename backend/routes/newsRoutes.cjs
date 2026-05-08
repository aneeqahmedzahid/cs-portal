const express = require('express');
const router = express.Router();
const { getNews, getNewsById, createNews, updateNews, deleteNews } = require('../controllers/newsController.cjs');
const authMiddleware = require('../middleware/authMiddleware.cjs');

router.get('/', getNews);
router.get('/:id', getNewsById);
router.post('/', authMiddleware, createNews);
router.put('/:id', authMiddleware, updateNews);
router.delete('/:id', authMiddleware, deleteNews);

module.exports = router;
