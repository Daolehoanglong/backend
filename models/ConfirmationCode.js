const mongoose = require('../db');

const ConfirmationCodeSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        min: 0
    },
    Code: {
        type: String,
        required: true,
        trim: true
    },
    Email: {
        type: String,
        required: true,
        trim: true
    },
}, {
    timestamps: true 
});

const ConfirmationCodes = mongoose.model('ConfirmationCodes', ConfirmationCodeSchema);

module.exports = ConfirmationCodes;

