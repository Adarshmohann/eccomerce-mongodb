const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [{
        type: String,
        required: true,
    }],
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    brand: {
        type: String,
        required: true,
    },
    stockQuantity: {
        type: Number,
        default: 0,
    }
},
    {
        timestamps: true,
        id: false
    })

    productSchema.virtual('productId').get(function () {
        return this._id.toHexString()
    })
    
    productSchema.set('toJSON', {
        virtuals: true
    })

module.exports = mongoose.model('products', productSchema)
