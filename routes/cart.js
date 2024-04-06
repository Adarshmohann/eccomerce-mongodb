const express = require('express')
const { createUser, userLogin } = require('../controllers/users')
const { addToCart, getMyCart, incrementItemQuantity,
    decrementItemQuantity, removeFromCart } = require('../controllers/carts')


const router = express.Router()

router.post('/addToCart', addToCart)
router.get('/getmycart', getMyCart)
router.put('/incrementQuantity/:productId',incrementItemQuantity )
router.put('/decrementQuantity/:productId', decrementItemQuantity)
router.delete('/removeFromCart/:productId', removeFromCart)


module.exports = router