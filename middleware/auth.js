const jwt = require('express-jwt'),
      secret = require('../config/index').secret;

/**
 * Read Json Web Token from request header object
 * @param req
 * @returns {*}
 */
function getTokenFromHeader(req) {
  // look for header named "authorization" with value of "Token" or "Bearer"
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    // return the actual token after "Token" or "Bearer"
    return req.headers.authorization.split(' ')[1];
  }
  return null;
}

var auth = {
  required: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: secret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  })
};

module.exports = auth;
