const express = require('express');
const router = express.Router();
const Category = require('../models/Categories');
router.get('/', async (req, res) => {
    try {
        const Categories = await Category.find();
        res.json(Categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const category = await Category.findOne({ id: categoryId });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

