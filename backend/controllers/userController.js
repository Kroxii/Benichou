const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const authService = require('../services/authService');
const emailService = require('../services/emailService');

const userController = {
  register: async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone, username } = req.body;
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(400).json({
            error: 'Un utilisateur avec cet email existe déjà'
          });
        }
        if (existingUser.username === username) {
          return res.status(400).json({
            error: 'Ce nom d\'utilisateur est déjà pris'
          });
        }
      }

      const user = new User({
        email,
        password,
        firstName,
        lastName,
        phone,
        username,
        role: 'customer'
      });

      const verificationToken = user.generateEmailVerificationToken();
      
      await user.save();

      try {
        await emailService.sendEmailVerification(email, firstName, verificationToken);
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email de vérification:', emailError);
      }

      res.status(201).json({
        message: 'Utilisateur créé avec succès. Un email de vérification a été envoyé.',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          error: `Ce ${field === 'email' ? 'email' : 'nom d\'utilisateur'} est déjà utilisé`
        });
      }
      
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { token } = req.params;
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          error: 'Token de vérification invalide ou expiré'
        });
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      try {
        await emailService.sendWelcomeEmail(user.email, user.firstName);
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', emailError);
      }

      const jwtToken = authService.generateToken(user._id);

      res.json({
        message: 'Email vérifié avec succès. Bienvenue !',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        token: jwtToken
      });
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  resendVerificationEmail: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          error: 'Aucun utilisateur trouvé avec cet email'
        });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({
          error: 'Cet email est déjà vérifié'
        });
      }

      const verificationToken = user.generateEmailVerificationToken();
      await user.save();
      await emailService.sendEmailVerification(user.email, user.firstName, verificationToken);

      res.json({
        message: 'Email de vérification renvoyé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors du renvoi de l\'email de vérification:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          error: 'Email ou mot de passe incorrect'
        });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Email ou mot de passe incorrect'
        });
      }

      if (!user.isEmailVerified) {
        return res.status(401).json({
          error: 'Veuillez vérifier votre email avant de vous connecter',
          code: 'EMAIL_NOT_VERIFIED'
        });
      }

      user.lastLogin = new Date();
      await user.save();

      const token = authService.generateToken(user._id);

      res.json({
        message: 'Connexion réussie',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          role: user.role,
          isEmailVerified: user.isEmailVerified
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

  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
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
          username: user.username,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
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
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          error: 'Aucun utilisateur trouvé avec cet email'
        });
      }

      const resetToken = user.generatePasswordResetToken();
      await user.save();
      await emailService.sendPasswordResetEmail(user.email, user.firstName, resetToken);

      res.json({
        message: 'Un email de réinitialisation a été envoyé'
      });
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          error: 'Token de réinitialisation invalide ou expiré'
        });
      }

      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      const jwtToken = authService.generateToken(user._id);

      res.json({
        message: 'Mot de passe réinitialisé avec succès',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          role: user.role
        },
        token: jwtToken
      });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { firstName, lastName, username, phone } = req.body;
      const userId = req.user.userId;

      if (username) {
        const existingUser = await User.findOne({ 
          username, 
          _id: { $ne: userId } 
        });
        
        if (existingUser) {
          return res.status(400).json({
            error: 'Ce nom d\'utilisateur est déjà pris'
          });
        }
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { firstName, lastName, username, phone },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
          error: 'Utilisateur non trouvé'
        });
      }

      res.json({
        message: 'Profil mis à jour avec succès',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      const user = await User.findById(userId).select('+password');
      if (!user) {
        return res.status(404).json({
          error: 'Utilisateur non trouvé'
        });
      }

      const isValidPassword = await user.comparePassword(currentPassword);
      if (!isValidPassword) {
        return res.status(400).json({
          error: 'Mot de passe actuel incorrect'
        });
      }

      user.password = newPassword;
      await user.save();

      res.json({
        message: 'Mot de passe modifié avec succès'
      });
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      const userId = req.user.userId;

      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({
          error: 'Utilisateur non trouvé'
        });
      }

      res.json({
        message: 'Compte supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  }
};

module.exports = userController;
