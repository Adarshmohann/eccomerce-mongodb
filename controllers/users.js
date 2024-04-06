const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = process.env.secret

const createUser = async (req, res) => {
    try {
        const { username, password, mobile, email, image } = req.body

        if (!username || !password || !mobile || !email) {
            return res.status(400).send({
                status: false,
                error: true,
                message: "Missing mandatory fields"
            })
        }

         // Check if user with provided email already exists
        const isExistingUser = await User.findOne({ email })
         if (isExistingUser) {
             return res.status(400).send({
                 status: false,
                 error: true,
                 message: "User already exist with this email"
             })
        }
        
        //here the image should be send in raw json, from the imageupload api the frontend will get the -
        // image path and that path will be send to this api

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username: username,
            image: image ?? "/uploads/images/image_1712382996447.png",
            password: hashedPassword,
            mobile: mobile,
            email: email,
            userType : 1
        })

        const userData = await user.save()
        
        const tokenPayload = {
            userId: user._id,
            email: user.email,
            userType : user.userType
        }
        const token = jwt.sign(tokenPayload, secret, { expiresIn: '50d' })

        return res.status(200).send({
            status: true,
            error: false,
            message: "User created successfully",
            token
        })

    } catch (error) {
        console.error('Unhandled error:---', error);
        return res.status(500).send({
            status: false,
            error: true,
            message: 'Unhandled error'
        })
    }

}

const createAdmin = async (req, res) => {
    try {
        const { username, password, mobile, email } = req.body


        //validating the body
        if (!username || !password || !mobile || !email) {
            return res.status(400).send({
                status: false,
                error: true,
                message: "Missing mandatory fields"
            })
        }

         // Check if user with provided email already exists
        const isExistingUser = await User.findOne({ email })
         if (isExistingUser) {
             return res.status(400).send({
                 status: false,
                 error: true,
                 message: "User already exist with this email"
             })
         }

        //hashing the password
        const hashedPassword = await hashAsync(password, 10)
        const user = new User({
            username: username,
            image: image ?? "/uploads/images/image_1712382996447.png",
            password: hashedPassword,
            mobile: mobile,
            email: email,
            userType : 0
        })

        const userData = await user.save()
        
        //setting payload in the token
        const tokenPayload = {
            userId: user._id,
            email: user.email,
            userType : user.userType
        }
        const token = jwt.sign(tokenPayload, secret, { expiresIn: '50d' }) // expiry of token

        return res.status(200).send({
            status: true,
            error: false,
            message: "User created successfully",
            token
        })

    } catch (error) {
        console.error('Unhandled error:---', error);
        return res.status(500).send({
            status: false,
            error: true,
            message: 'Unhandled error'
        })
    }

}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // check if username and password are provided from the frontend
        if (!email || !password) {
            return res.status(400).json({
                status: false,
                error: true,
                message: "Please enter an email and password"
            })
        }

        // find user based on the username
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                status: false,
                error: true,
                message: "Sorry, this user does not exist"
            })
        }

        // compare the passwords using bcrypt
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        // if passwords match, generate token and return success response
        if (isPasswordValid) {
            const tokenPayload = {
                userId: user._id,
                email: user.email,
                userType : user.userType
            }
            const token = jwt.sign(tokenPayload, secret, { expiresIn: '50d' })
            return res.status(200).json({
                status: true,
                error: false,
                token,
                userType : user.userType,
                message: "Login Successful"
            })
        } else {
            return res.status(400).json({
                status: false,
                error: true,
                message: 'Incorrect email or password'
            })
        }
    } catch (error) {
        
        console.error("Unhandled error::-", error)
        return res.status(500).json({
            status: false,
            error: true,
            message: 'Unhandled Error'
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        
        return res.status(200).json({
            status: true,
            message: "Users retrieved successfully",
            users: users
        })
    }catch (error) {
        console.error("Unhandled error:---", error)
        return res.status(500).json({
            status: false,
            error: true,
            message: 'Unhandled Error'
        })
    }
}

module.exports = { createUser, userLogin, createAdmin, getAllUsers }