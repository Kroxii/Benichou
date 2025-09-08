const mongoose = require('mongoose');
const seedCategories = require('./categoriesSeeder');
const seedUsers = require('./usersSeeder');
const seedProducts = require('./productsSeeder');
require('dotenv').config();

const seedAll = async () => {
  try {
    console.log('🌱 Début du seeding de la base de données...\n');

    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/benichou_db');
    console.log('✅ Connexion à MongoDB réussie\n');

    // Exécuter les seeders dans l'ordre
    console.log('📂 Seeding des catégories...');
    await seedCategories();
    
    console.log('\n👥 Seeding des utilisateurs...');
    await seedUsers();
    
    console.log('\n🛍️ Seeding des produits...');
    await seedProducts();

    console.log('\n🎉 Seeding terminé avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    process.exit(1);
  }
};

// Exécuter le seeder complet si appelé directement
if (require.main === module) {
  seedAll();
}

module.exports = seedAll;
