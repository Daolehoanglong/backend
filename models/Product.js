const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    categoryID: {
        type: Number,
        required: true
    },
    img: {
        type: [String],
        required: true,
    },
    hot: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true 
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
