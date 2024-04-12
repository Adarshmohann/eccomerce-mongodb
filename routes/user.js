const express = require('express')
const { createUser, userLogin, getAllUsers, createAdmin } = require('../controllers/users')
// const { jwtDecoder } = require('../helpers/jwtdecoder')


const router = express.Router()

router.post('/signup', createUser)
router.post('/createAdmin', createAdmin)
router.post('/login', userLogin)
router.get('/getAllUsers', getAllUsers)


module.exports = router