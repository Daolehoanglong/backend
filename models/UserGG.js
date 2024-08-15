const mongoose = require('mongoose');

const UserGGSchema = new mongoose.Schema({
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
    Email: {
        type: String,
        required: true,
        trim: true
    },
    Role: {
        type: String,
        required: true,
        trim: true
    },
}, {
    timestamps: true 
});

const UserGG = mongoose.model('UsersGG', UserGGSchema);

module.exports = UserGG;
