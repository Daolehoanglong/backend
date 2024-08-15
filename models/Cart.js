const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        min: 0
    },
    Name: {
        type: String,
        required: true,
        trim: true
    },
    Total: {
        type: Number,
        required: true,
        trim: true
    },
    Phone: {
        type: Number,
        required: true,
        trim: true
    },
    Email: {
        type: String,
        required: true,
        trim: true
    },
    Address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        required: true,
        trim: true
    },
    ward: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true 
});

const Cart = mongoose.model('Carts', CartSchema);

module.exports = Cart;