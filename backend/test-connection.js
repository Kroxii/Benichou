const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔌 Test de connexion à MongoDB...');
    console.log(`📍 URI: ${process.env.MONGODB_URI}`);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log(`✅ Connexion réussie à MongoDB!`);
    console.log(`🏢 Host: ${conn.connection.host}`);
    console.log(`📊 Base de données: ${conn.connection.name}`);
    console.log(`🔗 État de connexion: ${conn.connection.readyState === 1 ? 'Connecté' : 'Déconnecté'}`);
    
    // Test d'une opération simple
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📋 Collections disponibles: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('📁 Noms des collections:');
      collections.forEach(col => console.log(`   - ${col.name}`));
    }
    
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée proprement');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.error('🔍 Détails de l\'erreur:', error);
  }
};

testConnection();
