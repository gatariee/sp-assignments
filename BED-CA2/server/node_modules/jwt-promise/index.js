const jwt = require('jsonwebtoken')
const { promisify } = require('util')
let jwtPromise = {...jwt}
jwtPromise.sign = promisify(jwt.sign)
jwtPromise.verify = promisify(jwt.verify)
module.exports = jwtPromise
