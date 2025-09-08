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
    // Connexion à la base de données
    await connectDB();
    
    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur Benichou TCG démarré sur le port ${PORT}`);
      console.log(`📱 API disponible sur: http://localhost:${PORT}`);
      console.log(`🔗 Documentation API: http://localhost:${PORT}/api`);
      console.log(`🌱 Pour initialiser les données: npm run seed`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();
