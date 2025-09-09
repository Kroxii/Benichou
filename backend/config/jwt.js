const jwt = require('jsonwebtoken');

const jwtConfig = {
  secret: process.env.JWT_SECRET || 'benichou_super_secret_jwt_key_2025',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};

const generateToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};

module.exports = {
  jwtConfig,
  generateToken,
  verifyToken
};
