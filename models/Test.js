const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true 
});

const Test = mongoose.model('Tests', TestSchema);

module.exports = Test;
