const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

console.log('🔍 Test de création d\'utilisateur...');

async function testUserCreation() {
  try {
    // Connexion à la base de données
    console.log('⏳ Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    
    // Vérifier la collection cible
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections existantes:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Créer un utilisateur de test
    console.log('⏳ Création d\'un utilisateur de test...');
    const testUser = new User({
      username: 'test_user_' + Date.now(),
      email: `test_${Date.now()}@example.com`,
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User',
      role: 'customer'
    });
    
    await testUser.save();
    console.log('✅ Utilisateur créé avec succès');
    console.log('📍 ID utilisateur:', testUser._id);
    console.log('📍 Collection utilisée:', testUser.collection.name);
    
    // Vérifier dans quelle collection il a été sauvé
    const userFromDB = await User.findById(testUser._id);
    console.log('✅ Utilisateur trouvé dans la base:', userFromDB ? 'Oui' : 'Non');
    
    // Compter les utilisateurs dans la collection
    const userCount = await User.countDocuments();
    console.log('📊 Nombre d\'utilisateurs dans la collection:', userCount);
    
    // Lister quelques utilisateurs (sans mot de passe)
    const users = await User.find().limit(5).select('-password');
    console.log('👥 Utilisateurs existants:');
    users.forEach(user => {
      console.log(`  - ${user.username} (${user.email}) - ${user.firstName} ${user.lastName}`);
    });
    
    // Nettoyage - supprimer l'utilisateur de test
    await User.findByIdAndDelete(testUser._id);
    console.log('🧹 Utilisateur de test supprimé');
    
    await mongoose.disconnect();
    console.log('👋 Déconnecté de MongoDB');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

testUserCreation();
