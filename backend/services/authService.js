const jwt = require('jsonwebtoken');

const authService = {
  generateToken: (userId) => {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token invalide');
    }
  },

  generateResetToken: (userId) => {
    return jwt.sign(
      { userId, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  },

  verifyResetToken: (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type !== 'password_reset') {
        throw new Error('Type de token invalide');
      }
      return decoded;
    } catch (error) {
      throw new Error('Token de réinitialisation invalide ou expiré');
    }
  }
};

module.exports = authService;
