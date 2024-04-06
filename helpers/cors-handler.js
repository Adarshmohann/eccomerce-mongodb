function corsHandler(error, req, res, next) {
    if (req.method == 'OPTIONS') {

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.sendStatus(200);
      } else {
        res.on('finish', () => {
          if (req.method == 'POST' || req.method == 'DELETE' || req.method == 'PUT') {
            // console.log('Response headers:', res.getHeaders());
          }
        })
        next()
      }
  }
  module.exports = corsHandler