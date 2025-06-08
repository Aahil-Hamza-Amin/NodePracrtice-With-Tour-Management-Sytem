const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide valid email!']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password!'],
        minlength: 8,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please conform your password!'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Entered, Passwords are not same!'
        }
    }
})
// Would Fired only in case of .create() or .save() 
userSchema.pre('save', async function (next) {
    // Run where there is no updatation of password
    if (!this.isModified('password')) return next();
    // Hashed version of password with a cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    // we won't to make persistent passwordConfirm into DB
    this.passwordConfirm = undefined;
})

const User = mongoose.model('User', userSchema);

module.exports = User;