const express = require('express')
const multer = require('multer')
const path = require('path')

const router = express.Router();

const storage = multer.diskStorage({
    destination: './uploads/images/',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage
})

router.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(500).json({
                error: true,
                status: false,
                message: "Image not provided"
            })
        }
        const imagePath = `/uploads/images/${req.file.filename}`

        return res.json({
            status: true,
            error: false,
            message: "Image added successfully",
            imagePath: imagePath
        })
    } catch (error) {
        console.error("Error:----", error);

        return res.status(400).json({
            status: false,
            error: true,
            message: "Unhandled error"
        })
    }
})

module.exports = router