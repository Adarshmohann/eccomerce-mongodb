const Cart = require('../models/carts.js')
const Product = require('../models/products.js')
const User = require('../models/users.js')
const jwt = require('jsonwebtoken')
const secret = process.env.secret


const addToCart = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        const decodedToken = jwt.verify(token, secret)
        const userId = decodedToken.userId
        const { productId, quantity } = req.body
        

        //validating the body
        if (!productId || parseInt(quantity) <= 0) {
            return res.status(400).json({
                status: false,
                error: true,
                message: 'Missing mandatory data or invalid quantity'
            })
        }

        // check for user exist
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({
                status: false,
                error: true,
                message: 'User not found'
            })
        }

        // Check for product exists
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                status: false,
                error: true,
                message: 'Product not found'
            })
        }

        // create or update cart item
        let cart = await Cart.findOne({ userId: userId })
        if (!cart) {
            cart = new Cart({
                userId: userId,
                items: [],
            })
        }
 
        // check if the product already exists in the cart
        const existingItemIndex = cart.items.findIndex(item => item.productId.equals(productId))

        //-1 means the product does not exist in cart
        if (existingItemIndex !== -1) {
            cart.items[existingItemIndex].quantity += parseInt(quantity);
        } else {
            // adding new item to cart
            cart.items.push({
                productId: productId,
                quantity: quantity,
                price: product.price
            })
        }

        await cart.save()

        return res.status(200).json({
            status: true,
            error: false,
            message: 'Item added to cart successfully'
        })
    } catch (error) {
        console.error("Unhandled error:--------", error)
        return res.status(500).json({
            status: false,
            error: true,
            message: 'Unhandled Error'
        })
    }
}


const getMyCart = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decodedToken = jwt.verify(token, secret);
        const userId = decodedToken.userId;

        // finding the cart
        const cart = await Cart.findOne({ userId }).select('-createdAt -updatedAt -__v').lean()
    
        if (!cart) {
            return res.status(404).json({
                status: false,
                error: true,
                message: "Cart is empty",
                cartData: []
            })
        }

        let finalCartPrice = 0 // initial value of total cart price
        
        for (const item of cart.items) {
           
            const product = await Product.findById(item.productId).lean()

            //incase if the product got deleted but its id is still in the cart schema
            if (!product) {
                item.productName = null
                item.productDescription = null
                item.productImages = null
                item.productBrand = null
            } else {

               // adding the required data from the product shcema
                item.productName = product.name
                item.productDescription = product.description
                item.productImages = product.images
                item.productBrand = product.brand
                finalCartPrice += (item.price) * (item.quantity) // calculation for cart total
            }
        }


        return res.status(200).json({
            status: true,
            error: false,
            message: "Cart retrieved successfully",
            cartData: cart,
            finalCartPrice
        })

    } catch (error) {
        console.error("Unhandled error:--", error);
        return res.status(500).json({
            status: false,
            error: true,
            message: 'Unhandled Error'
        })
    }
}


const incrementItemQuantity = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        const decodedToken = jwt.verify(token, secret)
        const userId = decodedToken.userId

        const productId = req.params.productId

        //validation for productid
        if (!productId) {
            return res.status(404).json({
                status: false,
                error: true,
                message: "Please provide a productId",
            })
        }

        //finding cart
        let cart = await Cart.findOne({ userId })

        
        if (!cart) {
            return res.status(404).json({
                status: false,
                error: true,
                message: "Cart is empty"
            })
        }

        //finding index of the item
        const itemIndex = cart.items.findIndex(item => item.productId.equals(productId))

        if (itemIndex == -1) {
            return res.status(404).json({
                status: false,
                error: true,
                message: "Product not found in the cart",
            })
        }

        // incementing the quanity of the founded index
        cart.items[itemIndex].quantity++

        //saving the new data
        await cart.save()

        return res.status(200).json({
            status: true,
            error: false,
            message: "Item quantity increased successfully"
        })

    } catch (error) {
        console.error("Unhandled error:---", error);
        return res.status(500).json({
            status: false,
            error: true,
            message: 'Unhandled Error'
        });
    }
}

const decrementItemQuantity = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decodedToken = jwt.verify(token, secret);
        const userId = decodedToken.userId;

        const productId = req.params.productId;

        // validating product id
        if (!productId) {
            return res.status(404).json({
                status: false,
                error: true,
                message: "Please provide a productId",
            })
        }

        //finding cart
        let cart = await Cart.findOne({ userId })

        if (!cart) {
            return res.status(404).json({
                status: false,
                error: true,
                message: "Cart is empty",
                cartData: []
            })
        }

        //finding the index
        const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

        // -1 means the data is not present, there is no valid index
        if (itemIndex == -1) {
            return res.status(404).json({
                status: false,
                error: true,
                message: "Item not found in the cart",
            })
        }

        // check for the quantity atleast for 1
        if (cart.items[itemIndex].quantity > 1) {
            cart.items[itemIndex].quantity--
        } else {
            return res.status(404).json({
                status: false,
                error: true,
                message: "Sorry, the minimum quantity must be 1"
            })
        }

        // saving the data
        await cart.save();

        return res.status(200).json({
            status: true,
            error: false,
            message: "Item quantity decreased successfully",
        })

    } catch (error) {
        console.error("Unhandled error:", error);
        return res.status(500).json({
            status: false,
            error: true,
            message: 'Unhandled Error'
        })
    }
}


const removeFromCart = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decodedToken = jwt.verify(token, secret);
        const userId = decodedToken.userId;

        const productId = req.params.productId

        // validating product id
        if (!productId) {
            return res.status(404).json({
                status: false,
                error: true,
                message: "Please provide a productId",
            })
        }

        // finding the cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                status: false,
                error: true,
                message: "Cart is empty"
            })
        }

        // finding the index
        const itemIndex = cart.items.findIndex(item => item.productId.equals(productId))

        
        if (itemIndex == -1) {
            return res.status(404).json({
                status: false,
                error: true,
                message: "Item not found in the cart"
            })
        }

        // removing the data of that index by array.splice method
        cart.items.splice(itemIndex, 1)

        await cart.save()

        return res.status(200).json({
            status: true,
            error: false,
            message: "Item removed from the cart successfully"
        })

    } catch (error) {
        console.error("Unhandled error:", error);
        return res.status(500).json({
            status: false,
            error: true,
            message: 'Unhandled Error'
        })
    }
}





   
module.exports = {addToCart, getMyCart, incrementItemQuantity, decrementItemQuantity, removeFromCart}
