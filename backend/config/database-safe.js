const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Essayer de se connecter à MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/benichou', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error.message);
    console.log('💡 Pour résoudre ce problème :');
    console.log('1. Installez MongoDB : https://www.mongodb.com/try/download/community');
    console.log('2. Ou utilisez MongoDB Atlas (cloud) : https://www.mongodb.com/cloud/atlas');
    console.log('3. Ou installez Docker et exécutez : docker run -d -p 27017:27017 --name mongodb mongo');
    console.log('');
    console.log('🚀 Le serveur continue en mode dégradé (sans base de données)');
    console.log('');
    return false;
  }
};

module.exports = connectDB;
