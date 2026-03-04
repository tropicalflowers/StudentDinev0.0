const express = require('express');
const router = express.Router();
const { getAllItems, getItemById, addItem, updateItem, deleteItem } = require('../controllers/menuController');

// GET  /api/menu          → get all items (supports ?type=veg&category=main&search=paneer)
router.get('/', getAllItems);

// GET  /api/menu/:id      → get one item
router.get('/:id', getItemById);

// POST /api/menu          → add new item (manager only)
router.post('/', addItem);

// PUT  /api/menu/:id      → update item
router.put('/:id', updateItem);

// DELETE /api/menu/:id    → delete item
router.delete('/:id', deleteItem);

module.exports = router;
