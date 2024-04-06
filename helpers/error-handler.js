function errorHandler(error, req, res, next) {
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: false,
      error:true,
      message: 'Unauthorized error',
      invalidToken :true
    })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      status: false,
      error: true,
      invalidToken: true,
      message: error.message
    })
  }
  return res.status(500).json({ message: error.message })
}
module.exports = errorHandler