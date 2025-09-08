const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/benichou', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error.message);
    console.log('');
    console.log('💡 SOLUTIONS POUR INSTALLER MONGODB :');
    console.log('');
    console.log('🔧 Option 1 - MongoDB Community Server (Recommandé):');
    console.log('   1. Téléchargez: https://www.mongodb.com/try/download/community');
    console.log('   2. Installez le fichier .msi');
    console.log('   3. Redémarrez ce serveur');
    console.log('');
    console.log('🔧 Option 2 - MongoDB Atlas (Cloud gratuit):');
    console.log('   1. Créez un compte: https://www.mongodb.com/cloud/atlas');
    console.log('   2. Créez un cluster gratuit');
    console.log('   3. Copiez la chaîne de connexion dans .env');
    console.log('');
    console.log('🔧 Option 3 - Docker (si installé):');
    console.log('   docker run -d -p 27017:27017 --name mongodb mongo');
    console.log('');
    console.log('🚀 Le serveur continue en mode dégradé...');
    console.log('');
    return false;
  }
};

module.exports = connectDB;
