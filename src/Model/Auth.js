const mongoose = require('mongoose');
const { validateEmail } = require('../Middleware/emailValidation');
const {Schema}  = mongoose;

const AuthSchema = Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: [validateEmail, "please enter a valid email"],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "password must be at least 6 characters"]
    }
}, {timestamps: true});

module.exports = mongoose.model('Auth', AuthSchema);