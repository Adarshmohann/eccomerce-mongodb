const express = require('express')
const { addProduct, editProduct, getAllProducts, deleteProduct } = require('../controllers/products')
const { jwtDecoder, adminAuthorizer } = require('../helpers/jwtdecoder')


const router = express.Router()

router.post('/addproduct', adminAuthorizer, addProduct)
router.get('/getall-products', getAllProducts)
router.put('/editproduct/:productId', adminAuthorizer,  editProduct)
router.delete('/deleteproduct/:productId',adminAuthorizer,  deleteProduct)


module.exports = router