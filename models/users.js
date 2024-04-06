const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 150
    },
    image: {
        type: String
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 150
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
    },
    userType: {
        type: Number, 
        required: true,
    }
}, {
    timestamps: true,
    id : false
})

userSchema.virtual('userId').get(function () {
    return this._id.toHexString()
})

userSchema.set('toJSON', {
    virtuals: true
})

module.exports = mongoose.model('users', userSchema)
