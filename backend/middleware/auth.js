const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = {
  // Middleware pour vérifier l'authentification
  requireAuth: async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          error: 'Token d\'authentification requis'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({
          error: 'Token invalide - utilisateur non trouvé'
        });
      }

      req.userId = user._id;
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'Token invalide'
        });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Token expiré'
        });
      }
      
      console.error('Erreur middleware auth:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  // Middleware pour vérifier le rôle admin
  requireAdmin: async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Accès refusé - privilèges administrateur requis'
        });
      }
      next();
    } catch (error) {
      console.error('Erreur middleware admin:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  // Middleware optionnel pour récupérer l'utilisateur si token présent
  optionalAuth: async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (user) {
          req.userId = user._id;
          req.user = user;
        }
      }
      
      next();
    } catch (error) {
      // En cas d'erreur avec le token optionnel, on continue sans authentification
      next();
    }
  }
};

module.exports = auth;
