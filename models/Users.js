const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
    Password: {
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

const User = mongoose.model('Users', UserSchema);

module.exports = User;
