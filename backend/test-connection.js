const mongoose = require('mongoose');
require('dotenv').config();
const testConnection = async () => {
  try {
    console.log('🔄 Tentative de connexion à MongoDB...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/benichou';
    console.log(`📍 URI de connexion: ${mongoUri}`);
    const options = {
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
    };
    const conn = await mongoose.connect(mongoUri, options);
    console.log('✅ Connexion à MongoDB réussie !');
    console.log(`🏠 Hôte: ${conn.connection.host}`);
    console.log(`🗄️  Base de données: ${conn.connection.name}`);
    console.log(`🔗 État de connexion: ${conn.connection.readyState === 1 ? 'Connecté' : 'Déconnecté'}`);
    console.log('\n🧪 Test d\'une opération simple...');
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📂 Collections existantes: ${collections.length}`);
    if (collections.length > 0) {
      collections.forEach(col => {
        console.log(`  - ${col.name}`);
      });
    } else {
      console.log('  Aucune collection trouvée (base de données vide)');
    }
    await mongoose.connection.close();
    console.log('\n🔚 Connexion fermée avec succès');
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error.message);
    if (error.name === 'MongoServerSelectionError') {
      console.log('\n💡 Solutions possibles:');
      console.log('1. Installer MongoDB localement: https://docs.mongodb.com/manual/installation/');
      console.log('2. Utiliser MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
      console.log('3. Utiliser Docker: docker run -d -p 27017:27017 --name mongodb mongo');
      console.log('4. Vérifier que MongoDB est démarré (service mongod)');
    }
    process.exit(1);
  }
};
if (require.main === module) {
  testConnection();
}
module.exports = testConnection;
