const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
        price: {
            type: Number,
            required: true,
        },
        itemId: {
            type: String,
            get: function () {
                return this._id.toHexString();
            }
        }
    }],
}, {
    timestamps: true,
    id: false
})

cartSchema.virtual('cartId').get(function () {
    return this._id.toHexString()
})

cartSchema.set('toJSON', {
    virtuals: true
})

module.exports = mongoose.model('Cart', cartSchema)
