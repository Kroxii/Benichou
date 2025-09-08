const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const categories = [
  {
    name: 'Pokemon',
    description: 'Cartes à collectionner Pokemon - Boosters, decks et accessoires officiels',
    slug: 'pokemon',
    isActive: true,
    sortOrder: 1
  },
  {
    name: 'Yu-Gi-Oh!',
    description: 'Cartes Yu-Gi-Oh! officielles - Decks de structure, boosters et cartes singles',
    slug: 'yugioh',
    isActive: true,
    sortOrder: 2
  },
  {
    name: 'Magic: The Gathering',
    description: 'Magic: The Gathering - Boosters, decks préconçus et cartes à l\'unité',
    slug: 'magic',
    isActive: true,
    sortOrder: 3
  },
  {
    name: 'Lorcana',
    description: 'Disney Lorcana - Le nouveau TCG Disney avec vos personnages préférés',
    slug: 'lorcana',
    isActive: true,
    sortOrder: 4
  },
  {
    name: 'Altered',
    description: 'Altered TCG - Jeu de cartes stratégique dans un univers unique',
    slug: 'altered',
    isActive: true,
    sortOrder: 5
  },
  {
    name: 'Riftbound',
    description: 'Riftbound - TCG d\'aventure et de stratégie',
    slug: 'riftbound',
    isActive: true,
    sortOrder: 6
  },
  {
    name: 'Accessoires',
    description: 'Protège-cartes, classeurs, tapis de jeu et autres accessoires TCG',
    slug: 'accessoires',
    isActive: true,
    sortOrder: 7
  }
];

const seedCategories = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/benichou_db');
    console.log('Connexion à MongoDB réussie');

    // Supprimer les catégories existantes
    await Category.deleteMany({});
    console.log('Catégories existantes supprimées');

    // Insérer les nouvelles catégories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`${insertedCategories.length} catégories ajoutées avec succès`);

    // Afficher les catégories créées
    insertedCategories.forEach(category => {
      console.log(`- ${category.name} (${category.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding des catégories:', error);
    process.exit(1);
  }
};

// Exécuter le seeder si appelé directement
if (require.main === module) {
  seedCategories();
}

module.exports = seedCategories;
