const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter your name!']
    },
    email: {
        type: String,
        required: [true, 'Please Enter Your email!'],
        unique: true,
        lower: true,
        validate: [validator.isEmail, 'Email is not Correct!']
    },
    password: {
        type: String,
        required: [true, 'Please Enter Your Password!'],
        min: [8, 'A password must be at-least of 8 Characters!']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please Enter Your passwordConfirm!'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'password and passwordConfirm are not same!'
        }
    },
    pic: String
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); //if password is not change don't rehash it
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next()
})

const User = mongoose.model('User', UserSchema);

module.exports = User;