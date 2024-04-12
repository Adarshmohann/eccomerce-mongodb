const { jwtDecoder } = require('../helpers/jwtdecoder.js')
const Product = require('../models/products.js')
const jwt = require('jsonwebtoken')
const secret = process.env.secret


const addProduct = async (req, res) => {
    try {
        // const token = req.headers.authorization?.split(' ')[1]
        // const decodedToken = jwt.verify(token, secret)
        // const userType = decodedToken.userType
        const { name, images, price, description, brand, stockQuantity } = req.body

        // Check if the user is authorized to add a product
        // if (userType !== 0) {
        //     return res.status(403).json({
        //         status: false,
        //         error: true,
        //         message: "Access Denied, only admins can add product"
        //     })
        // }

     

        // Check for missing mandatory fields
        if (!name || !description || !brand || !images || images.length == 0 || !(parseInt(price) > 0)) {
            return res.status(400).json({
                status: false,
                error: true,
                message: "Please provide all mandatory fields"
            })
        }

        // Create a new product
        const product = new Product({
            name,
            images,
            price,
            description,
            brand,
            stockQuantity
        })

        // Saveing to the database
        await product.save()

        return res.status(201).json({
            status: true,
            error: false,
            message: "Product created successfully"
        })

    } catch (error) {
        console.error('Unhandled error:------', error)

        return res.status(500).json({
            status: false,
            error: true,
            message: 'Unhandled error'
        })
    }
}

const getAllProducts = async (req, res) => {
    try {

        const products = await Product.find().select('-__v -createdAt -updatedAt')

        // If there are no products found, return
        if (!products || products.length == 0) {
            return res.status(404).json({
                status: false,
                error: true,
                message: "No products found",
                products: [] // for frontend to check by the length of the array
            })
        }

        return res.status(200).json({
            status: true,
            error: false,
            message: "Products retrived successfully",
            products: products
        })

    } catch (error) {
        console.log("error:-----", error)
        return res.status(500).json({
            status: false,
            error: true,
            message: 'Unhandled error'
        })
    }
}

const editProduct = async (req, res) => {
    try {
        // const token = req.headers.authorization?.split(' ')[1]
        // const decodedToken = jwt.verify(token, secret)
        // const userType = decodedToken.userType

        const productId = req.params.productId
        const { name, images, price, description, brand, stockQuantity } = req.body

        // if (userType !== 0) {
        //     return res.status(403).json({
        //         status: false,
        //         error: true,
        //         message: "Access Denied"
        //     })
        // }

        if (!productId) {
            return res.status(400).json({
                status: false,
                error: true,
                message: "ProductId missing"
            })
        }

        // find the product by id
        let product = await Product.findById(productId);

        //check if the product exist
        if (!product) {
            return res.status(404).json({
                status: false,
                error: true,
                message: "Product not found"
            })
        }

        // update the product from the body otherwise the existing data
        product.name = name ?? product.name
        product.images = images ?? product.images
        product.price = price ?? product.price
        product.description = description ?? product.description
        product.brand = brand ?? product.brand
        product.stockQuantity = stockQuantity ?? product.stockQuantity

        // save the updated product
        await product.save()

        return res.status(200).json({
            status: true,
            error: false,
            message: "Product updated successfully"
        })

    } catch (error) {
        console.error('Unhandled error:------', error)
        return res.status(500).json({
            status: false,
            error: true,
            message: 'Unhandled error'
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        // const token = req.headers.authorization?.split(' ')[1];
        // const decodedToken = jwt.verify(token, secret);
        // const userType = decodedToken.userType;

        const productId = req.params.productId;

        // admin authrization
        // if (userType !== 0) {
        //     return res.status(403).json({
        //         status: false,
        //         error: true,
        //         message: "Access Denied"
        //     })
        // }

  
 //validating productid
        if (!productId) {
            return res.status(400).json({
                status: false,
                error: true,
                message: "ProductId missing"
            })
        }

        const deletedProduct = await Product.findByIdAndDelete(productId)

        if (!deletedProduct) {
            return res.status(404).json({
                status: false,
                error: true,
                message: "Product not found"
            })
        }

        return res.status(200).json({
            status: true,
            error: false,
            message: "Product deleted successfully"
        })

    } catch (error) {
        console.error('Unhandled error:----', error);
        return res.status(500).json({
            status: false,
            error: true,
            message: 'Unhandled error'
        })
    }
}

module.exports = { addProduct, deleteProduct, editProduct, getAllProducts }