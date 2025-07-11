const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { type } = require('os');

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
    role: {
        type: String,
        enum: ['admin', 'user', 'guide', 'lead-guide'],
        default: 'user'
    }
    ,
    password: {
        type: String,
        required: [true, 'Please provide a password!'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password!'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Entered, Passwords are not same!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
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

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || !this.isNew) return next()
    this.passwordChangedAfter = Date.now() - 1000  // password should be saved/update beforetoken issue

    next()
})

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.passwordChangedAfter = function (JWTTimeStamps) {
    if (this.passwordChangedAt) {
        const changedTimestamps = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(changedTimestamps, JWTTimeStamps);

        return JWTTimeStamps < changedTimestamps  // 100<200
    }
    // means dosent change the password
    return false
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    console.log({ resetToken }, this.passwordResetToken);

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;