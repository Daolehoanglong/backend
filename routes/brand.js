const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand.js');

router.get('/', async (req, res) => {
    try {
        const products = await Brand.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;