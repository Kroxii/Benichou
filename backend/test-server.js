const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Simuler une base de données en mémoire
const users = [];
let userIdCounter = 1;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper functions
const generateId = () => userIdCounter++;

const findUserByEmail = (email) => users.find(user => user.email === email);
const findUserByUsername = (username) => users.find(user => user.username === username);
const findUserById = (id) => users.find(user => user.id === parseInt(id));

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'API Benichou TCG (Mode Test - Sans MongoDB)',
    version: '1.0.0',
    status: 'running',
    users: users.length,
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      verifyEmail: 'GET /api/auth/verify-email/:token',
      profile: 'GET /api/auth/profile',
      forgotPassword: 'POST /api/auth/forgot-password',
      resetPassword: 'POST /api/auth/reset-password/:token'
    }
  });
});

// Routes d'authentification simplifiées pour les tests
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, firstName, lastName, username, phone } = req.body;

    // Vérifications basiques
    if (!email || !password || !firstName || !lastName || !username) {
      return res.status(400).json({
        error: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    if (findUserByEmail(email)) {
      return res.status(400).json({
        error: 'Un utilisateur avec cet email existe déjà'
      });
    }

    if (findUserByUsername(username)) {
      return res.status(400).json({
        error: 'Ce nom d\'utilisateur est déjà pris'
      });
    }

    // Créer l'utilisateur
    const user = {
      id: generateId(),
      email,
      password, // En vrai, il faut hasher le mot de passe
      firstName,
      lastName,
      username,
      phone: phone || null,
      role: 'customer',
      isEmailVerified: false,
      emailVerificationToken: 'test_token_' + Date.now(),
      createdAt: new Date(),
      lastLogin: null
    };

    users.push(user);

    console.log(`📧 Email de vérification envoyé à ${email}`);
    console.log(`🔗 Lien de vérification: http://localhost:3000/verify-email.html?token=${user.emailVerificationToken}`);

    res.status(201).json({
      message: 'Utilisateur créé avec succès. Un email de vérification a été envoyé.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.get('/api/auth/verify-email/:token', (req, res) => {
  try {
    const { token } = req.params;
    
    const user = users.find(u => u.emailVerificationToken === token);
    
    if (!user) {
      return res.status(400).json({
        error: 'Token de vérification invalide ou expiré'
      });
    }

    // Marquer l'email comme vérifié
    user.isEmailVerified = true;
    user.emailVerificationToken = null;

    console.log(`✅ Email vérifié pour ${user.email}`);

    res.json({
      message: 'Email vérifié avec succès. Bienvenue !',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      token: 'jwt_token_' + user.id
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email et mot de passe requis'
      });
    }

    const user = findUserByEmail(email);
    
    if (!user || user.password !== password) {
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

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      token: 'jwt_token_' + user.id
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.post('/api/auth/resend-verification', (req, res) => {
  try {
    const { email } = req.body;
    
    const user = findUserByEmail(email);
    
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

    user.emailVerificationToken = 'test_token_' + Date.now();
    
    console.log(`📧 Email de vérification renvoyé à ${email}`);
    console.log(`🔗 Nouveau lien: http://localhost:3000/verify-email.html?token=${user.emailVerificationToken}`);

    res.json({
      message: 'Email de vérification renvoyé avec succès'
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.post('/api/auth/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    
    const user = findUserByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        error: 'Aucun utilisateur trouvé avec cet email'
      });
    }

    user.passwordResetToken = 'reset_token_' + Date.now();
    
    console.log(`📧 Email de réinitialisation envoyé à ${email}`);
    console.log(`🔗 Lien de réinitialisation: http://localhost:3000/reset-password.html?token=${user.passwordResetToken}`);

    res.json({
      message: 'Un email de réinitialisation a été envoyé'
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.post('/api/auth/reset-password/:token', (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    const user = users.find(u => u.passwordResetToken === token);
    
    if (!user) {
      return res.status(400).json({
        error: 'Token de réinitialisation invalide ou expiré'
      });
    }

    user.password = password;
    user.passwordResetToken = null;

    console.log(`🔒 Mot de passe réinitialisé pour ${user.email}`);

    res.json({
      message: 'Mot de passe réinitialisé avec succès',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role
      },
      token: 'jwt_token_' + user.id
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Middleware simple d'authentification
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  const userId = token.replace('jwt_token_', '');
  const user = findUserById(userId);
  
  if (!user) {
    return res.status(401).json({ error: 'Token invalide' });
  }

  req.user = { userId: user.id };
  next();
};

app.get('/api/auth/profile', authMiddleware, (req, res) => {
  try {
    const user = findUserById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé'
      });
    }

    res.json({
      user: {
        id: user.id,
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
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Middleware de gestion d'erreur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur s\'est produite'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur de test Benichou TCG démarré sur le port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🧪 Mode: Test (sans MongoDB)`);
  console.log(`📝 Utilisateurs enregistrés: ${users.length}`);
});

// Ajouter un utilisateur de test
users.push({
  id: generateId(),
  email: 'test@benichou.com',
  password: 'Test123!',
  firstName: 'Test',
  lastName: 'User',
  username: 'testuser',
  phone: null,
  role: 'customer',
  isEmailVerified: true,
  emailVerificationToken: null,
  createdAt: new Date(),
  lastLogin: null
});

console.log('👤 Utilisateur de test créé: test@benichou.com / Test123!');
