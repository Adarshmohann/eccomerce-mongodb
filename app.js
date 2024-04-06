const express = require('express')
require('dotenv').config()
const cors = require('cors')
const errorHandler = require('./helpers/error-handler.js')
const bodyparser = require('body-parser')
const authJwt = require('./helpers/jwt')
const path = require('path')
const corsHandler = require('./helpers/cors-handler.js')
const mongoose = require("mongoose")


const userRoutes = require('./routes/user.js')
const productRoutes = require('./routes/product.js')
const cartRoutes = require('./routes/cart.js')
const imageRoutes = require('./routes/imageupload.js')

const app = express()
const port = process.env.port || 3050

app.use('/uploads', express.static(path.join(__dirname, '/uploads'))) 

// middlewares
app.use(corsHandler)
app.use(cors())
app.use(bodyparser.json())
app.use(errorHandler)
app.use(authJwt)


// connecting to mongodb database
// create a cluster and generate a connection string  and add that in the env
// based on that connection string the db gets connected and after the successfull conection you will get a log of "db connected"

mongoose.connect(process.env.mongo_connection_url)
  .then(() => {
    console.log('db connected')
  }).catch((error) => {
    console.log("error", error)
  })

mongoose.connection.on('error',error => {
  console.log('error', error.message)
  res.status(500).json({
    message: "failed to connect with db",
    reason : error.message
  })
})


app.use('/user', userRoutes)
app.use('/products', productRoutes)
app.use('/cart', cartRoutes)
app.use('/image', imageRoutes)

app.listen(port, function () {
  console.log('server listeneing')
})