const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        min: 0
    },
    idCart: {
        type: Number,
        required: true,
        min: 0
    },
    Name: {
        type: String,
        required: true,
        trim: true
    },
    Price: {
        type: Number,
        required: true,
        trim: true
    },
    Total: {
        type: Number,
        required: true,
        trim: true
    },
}, {
    timestamps: true
});

const Bill = mongoose.model('Bills', BillSchema);

module.exports = Bill;