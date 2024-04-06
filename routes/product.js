const express = require('express')
const { addProduct, editProduct, getAllProducts, deleteProduct } = require('../controllers/products')


const router = express.Router()

router.post('/addproduct', addProduct)
router.get('/getall-products', getAllProducts)
router.put('/editproduct/:productId', editProduct)
router.delete('/deleteproduct/:productId', deleteProduct)


module.exports = router