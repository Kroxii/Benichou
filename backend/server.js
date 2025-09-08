const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const apiRoutes = require('./api/routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
