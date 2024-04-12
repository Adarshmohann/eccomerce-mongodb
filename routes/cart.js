const express = require('express')

const { addToCart, getMyCart, incrementItemQuantity,
    decrementItemQuantity, removeFromCart } = require('../controllers/carts')
const { jwtDecoder } = require('../helpers/jwtdecoder')


const router = express.Router()

router.post('/addToCart',jwtDecoder, addToCart)
router.get('/getmycart',jwtDecoder, getMyCart)
router.put('/incrementQuantity/:productId',jwtDecoder, incrementItemQuantity )
router.put('/decrementQuantity/:productId', jwtDecoder,  decrementItemQuantity)
router.delete('/removeFromCart/:productId', jwtDecoder, removeFromCart)


module.exports = router