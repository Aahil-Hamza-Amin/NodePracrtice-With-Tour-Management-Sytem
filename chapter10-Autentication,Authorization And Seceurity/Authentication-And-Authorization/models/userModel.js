const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Your name!']
    },
    email: {
        type: String,
        required: [true, 'Please Enter Your email!'],
        unique: true,
        lower: true,
        validate: [validator.isEmail, 'Please insert the valid email']
    },
    password: {
        type: String,
        required: [true, 'Please Enter Your password!'],
        minlength: [8, 'password should be equal or greater than 8 characters']
    },
    passwordConfirm:
    {
        type: String,
        required: [true, 'Please Enter Your passwordConfirm!'],
    },
    pic: String
})

const User = mongoose.model('User', userSchema);

module.exports = User;