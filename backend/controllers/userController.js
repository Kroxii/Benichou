const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

const userController = {
  // Inscription d'un utilisateur
  register: async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          error: 'Un utilisateur avec cet email existe déjà'
        });
      }

      // Hasher le mot de passe
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Créer l'utilisateur
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: 'customer'
      });

      await user.save();

      // Générer le token JWT
      const token = authService.generateToken(user._id);

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  // Connexion d'un utilisateur
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Trouver l'utilisateur
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          error: 'Email ou mot de passe incorrect'
        });
      }

      // Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Email ou mot de passe incorrect'
        });
      }

      // Mettre à jour la dernière connexion
      user.lastLogin = new Date();
      await user.save();

      // Générer le token JWT
      const token = authService.generateToken(user._id);

      res.json({
        message: 'Connexion réussie',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  // Obtenir le profil de l'utilisateur connecté
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          error: 'Utilisateur non trouvé'
        });
      }

      res.json({
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  }
};

module.exports = userController;
