const mongoose = require('../db');

const categorySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        min: 0
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
}, {
    timestamps: true 
});

const Categories = mongoose.model('Categories', categorySchema);

module.exports = Categories;

