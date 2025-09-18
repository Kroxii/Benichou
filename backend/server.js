const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const apiRoutes = require('./api/routes');
const security = require('./middleware/security');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔒 MIDDLEWARES DE SÉCURITÉ (PRIORITÉ ABSOLUE)
app.use(security.cleanHeaders);
app.use(security.securityMiddleware());
app.use(security.sanitizeRequest);
app.use(security.antiNoSQLInjection);

// Middleware CORS sécurisé
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Remplacer par votre domaine en production
    : ['http://localhost:8000', 'http://127.0.0.1:8000'],
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Protection basique contre CSRF
app.use((req, res, next) => {
  // Vérifier que les requêtes POST/PUT/DELETE proviennent d'AJAX
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const requestedWith = req.get('X-Requested-With');
    const origin = req.get('Origin');
    const referer = req.get('Referer');
    
    // Permettre si c'est une requête AJAX ou si l'origine est autorisée
    if (requestedWith === 'XMLHttpRequest' || 
        (origin && corsOptions.origin.includes(origin)) ||
        (referer && corsOptions.origin.some(allowedOrigin => referer.startsWith(allowedOrigin)))) {
      return next();
    }
    
    return res.status(403).json({
      error: 'Requête CSRF détectée - Origin non autorisée'
    });
  }
  next();
});

// Middlewares de parsing avec limites de sécurité
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Vérifier la taille et le contenu
    if (buf.length > 10 * 1024 * 1024) {
      throw new Error('Payload trop volumineux');
    }
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Routes
app.use('/api', apiRoutes);

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'API Benichou TCG',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      categories: '/api/categories',
      products: '/api/products',
      users: '/api/users',
      orders: '/api/orders'
    }
  });
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
const startServer = async () => {
  try {
    // Tentative de connexion à la base de données
    const dbConnected = await connectDB();
    
    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur Benichou TCG démarré sur le port ${PORT}`);
      console.log(`📱 API disponible sur: http://localhost:${PORT}`);
      console.log(`🔗 Documentation API: http://localhost:${PORT}/api`);
      
      if (dbConnected) {
        console.log(`🌱 Pour initialiser les données: npm run seed`);
        console.log(`✅ Base de données connectée`);
      } else {
        console.log(`⚠️  Base de données non connectée - Mode démo actif`);
        console.log(`📖 Consultez les instructions ci-dessus pour installer MongoDB`);
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    console.log('⚠️  Le serveur démarre quand même en mode dégradé...');
    
    app.listen(PORT, () => {
      console.log(`🚀 Serveur Benichou TCG démarré sur le port ${PORT} (mode dégradé)`);
      console.log(`📱 API disponible sur: http://localhost:${PORT}`);
      console.log(`⚠️  Certaines fonctionnalités nécessitent MongoDB`);
    });
  }
};

startServer();
