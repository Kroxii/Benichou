const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Test de connexion MongoDB...');
console.log('📍 URI:', process.env.MONGODB_URI ? 'Configurée' : 'Non configurée');

async function testConnection() {
  try {
    console.log('⏳ Tentative de connexion...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 secondes
    });
    
    console.log('✅ Connexion réussie !');
    console.log('🏠 Hôte:', conn.connection.host);
    console.log('🗄️ Base de données:', conn.connection.name);
    
    // Test d'écriture simple
    const testCollection = conn.connection.db.collection('test');
    await testCollection.insertOne({ test: 'connexion', date: new Date() });
    console.log('✅ Test d\'écriture réussi !');
    
    // Nettoyage
    await testCollection.deleteOne({ test: 'connexion' });
    console.log('✅ Test complet !');
    
    await mongoose.disconnect();
    console.log('👋 Déconnexion réussie');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 MongoDB n\'est pas démarré localement');
    } else if (error.message.includes('authentication failed')) {
      console.log('💡 Vérifiez votre nom d\'utilisateur/mot de passe');
    } else if (error.message.includes('serverSelectionTimeoutMS')) {
      console.log('💡 Vérifiez votre URL de connexion et votre connexion internet');
    }
    
    process.exit(1);
  }
}

testConnection();
