const mongoose = require('mongoose');
const { validateEmail } = require('../Middleware/emailValidation');
const {Schema}  = mongoose;

const userSchema = mongoose.Schema({
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

const User = mongoose.model("User", userSchema);

module.exports = User;

// module.exports = mongoose.model('User', userSchema);