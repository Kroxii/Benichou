const cors = require('cors');

// Configuration CORS personnalisée
const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (ex: applications mobiles, Postman)
    if (!origin) return callback(null, true);
    
    // Liste des domaines autorisés
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8080',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:8080',
      // Ajouter ici les domaines de production
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`Origine CORS refusée: ${origin}`);
      callback(new Error('Origine non autorisée par la politique CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ],
  optionsSuccessStatus: 200 // Pour supporter les anciens navigateurs
};

// En développement, autoriser toutes les origines
if (process.env.NODE_ENV === 'development') {
  corsOptions.origin = true;
}

module.exports = cors(corsOptions);
