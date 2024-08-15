const mongoose = require('../db');

const categorySchema = new mongoose.Schema({
    
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

