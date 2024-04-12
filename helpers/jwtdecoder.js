const jwt = require('jsonwebtoken')
const secret = process.env.secret


const adminAuthorizer = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, secret)
        const userType = decodedToken.userType
        if (userType !== 0) {
            return res.status(401).json({
                status: false,
                error: true,
                message: 'Access Denied'
            })
        }
        req.userType = decodedToken.userType
        req.userId = decodedToken.userId
        req.email = decodedToken.email
        next()
    } catch (error) {
        console.log("errorrrr", error)
        return res.status(401).json({
            status: false,
            error: true,
            message: 'unhandled error'
        })
    }
}

const jwtDecoder = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, secret)

        req.userType = decodedToken.userType
        req.userId = decodedToken.userId
        req.email = decodedToken.email

        next()
    } catch (error) {
        console.log("errorrrr", error)
        return res.status(401).json({
            status: false,
            error: true,
            message: 'unhandled error'
        })
    }
}


module.exports = { jwtDecoder, adminAuthorizer }
