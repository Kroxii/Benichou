const mongoose = require('mongoose');
const Category = require('../../models/Category');
const User = require('../../models/User');
const Product = require('../../models/Product');
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
const users = [
  {
    username: 'admin',
    email: 'admin@benichou.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'Benichou',
    role: 'admin',
    isActive: true
  },
  {
    username: 'john_doe',
    email: 'john.doe@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    isActive: true
  },
  {
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'user',
    isActive: true
  },
  {
    username: 'mike_johnson',
    email: 'mike.johnson@example.com',
    password: 'password123',
    firstName: 'Mike',
    lastName: 'Johnson',
    role: 'user',
    isActive: true
  }
];
const seedAll = async () => {
  try {
    console.log('🌱 Début du seeding de la base de données...\n');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/benichou');
    console.log('✅ Connexion à MongoDB réussie\n');
    console.log('📂 Seeding des catégories...');
    await Category.deleteMany({});
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ ${insertedCategories.length} catégories ajoutées`);
    console.log('\n👥 Seeding des utilisateurs...');
    await User.deleteMany({});
    const insertedUsers = await User.insertMany(users);
    console.log(`✅ ${insertedUsers.length} utilisateurs ajoutés`);
    console.log('\n🛍️ Seeding des produits...');
    await Product.deleteMany({});
    const pokemon = insertedCategories.find(cat => cat.slug === 'pokemon');
    const yugioh = insertedCategories.find(cat => cat.slug === 'yugioh');
    const magic = insertedCategories.find(cat => cat.slug === 'magic');
    const lorcana = insertedCategories.find(cat => cat.slug === 'lorcana');
    const accessoires = insertedCategories.find(cat => cat.slug === 'accessoires');
    const products = [
      {
        name: 'Booster Pokemon Écarlate et Violet',
        description: 'Booster de 11 cartes de la série Écarlate et Violet avec une carte rare garantie.',
        price: 4.99,
        stock: 100,
        category: pokemon._id,
        sku: 'PKM-EV-BOOST-001',
        images: [{
          url: '/images/products/pokemon-ecarlate-violet-booster.jpg',
          alt: 'Booster Pokemon Écarlate et Violet',
          isPrimary: true
        }],
        isActive: true,
        isFeatured: true,
        tags: ['pokemon', 'booster', 'écarlate', 'violet', 'nouveau']
      },
      {
        name: 'Deck de Dresseur Elite Pokemon',
        description: 'Deck préconstruit de 60 cartes avec des cartes puissantes et un guide stratégique.',
        price: 14.99,
        stock: 50,
        category: pokemon._id,
        sku: 'PKM-DECK-ELITE-001',
        images: [{
          url: '/images/products/pokemon-deck-elite.jpg',
          alt: 'Deck de Dresseur Elite Pokemon',
          isPrimary: true
        }],
        isActive: true,
        isFeatured: false,
        tags: ['pokemon', 'deck', 'preconstruit', 'elite']
      },
      {
        name: 'Booster Yu-Gi-Oh! Power of the Elements',
        description: 'Booster de 9 cartes avec les dernières cartes de la série Power of the Elements.',
        price: 3.99,
        stock: 75,
        category: yugioh._id,
        sku: 'YGO-POTE-BOOST-001',
        images: [{
          url: '/images/products/yugioh-power-elements-booster.jpg',
          alt: 'Booster Yu-Gi-Oh! Power of the Elements',
          isPrimary: true
        }],
        isActive: true,
        isFeatured: true,
        tags: ['yugioh', 'booster', 'power', 'elements']
      },
      {
        name: 'Deck de Structure Yu-Gi-Oh! Albaz Strike',
        description: 'Deck de structure de 41 cartes prêt à jouer avec des stratégies Albaz.',
        price: 12.99,
        stock: 30,
        category: yugioh._id,
        sku: 'YGO-ALBAZ-DECK-001',
        images: [{
          url: '/images/products/yugioh-albaz-strike-deck.jpg',
          alt: 'Deck de Structure Yu-Gi-Oh! Albaz Strike',
          isPrimary: true
        }],
        isActive: true,
        isFeatured: false,
        tags: ['yugioh', 'deck', 'structure', 'albaz']
      },
      {
        name: 'Booster Magic The Gathering - Dominaria United',
        description: 'Booster de 15 cartes de l\'extension Dominaria United avec une carte rare.',
        price: 4.49,
        stock: 120,
        category: magic._id,
        sku: 'MTG-DMU-BOOST-001',
        images: [{
          url: '/images/products/mtg-dominaria-united-booster.jpg',
          alt: 'Booster Magic The Gathering - Dominaria United',
          isPrimary: true
        }],
        isActive: true,
        isFeatured: true,
        tags: ['magic', 'booster', 'dominaria', 'united']
      },
      {
        name: 'Deck Commander Magic - Draconic Dissent',
        description: 'Deck Commander préconstruit de 100 cartes avec des dragons puissants.',
        price: 39.99,
        stock: 25,
        category: magic._id,
        sku: 'MTG-CMD-DRAGON-001',
        images: [{
          url: '/images/products/mtg-commander-draconic.jpg',
          alt: 'Deck Commander Magic - Draconic Dissent',
          isPrimary: true
        }],
        isActive: true,
        isFeatured: false,
        tags: ['magic', 'commander', 'dragon', 'deck']
      },
      {
        name: 'Booster Disney Lorcana - The First Chapter',
        description: 'Booster de 12 cartes Disney Lorcana avec vos personnages Disney préférés.',
        price: 5.99,
        stock: 80,
        category: lorcana._id,
        sku: 'LOR-FC-BOOST-001',
        images: [{
          url: '/images/products/lorcana-first-chapter-booster.jpg',
          alt: 'Booster Disney Lorcana - The First Chapter',
          isPrimary: true
        }],
        isActive: true,
        isFeatured: true,
        tags: ['lorcana', 'disney', 'booster', 'first', 'chapter']
      },
      {
        name: 'Protège-cartes Standard (100 pièces)',
        description: 'Protège-cartes transparents de qualité premium pour cartes format standard.',
        price: 8.99,
        stock: 200,
        category: accessoires._id,
        sku: 'ACC-SLEEVE-STD-100',
        images: [{
          url: '/images/products/sleeves-standard-100.jpg',
          alt: 'Protège-cartes Standard (100 pièces)',
          isPrimary: true
        }],
        isActive: true,
        isFeatured: false,
        tags: ['accessoire', 'protège-cartes', 'sleeves', 'standard']
      },
      {
        name: 'Tapis de Jeu Dragon Noir',
        description: 'Tapis de jeu en néoprène avec motif dragon, dimensions 60x35cm.',
        price: 19.99,
        stock: 40,
        category: accessoires._id,
        sku: 'ACC-MAT-DRAGON-001',
        images: [{
          url: '/images/products/playmat-dragon-noir.jpg',
          alt: 'Tapis de Jeu Dragon Noir',
          isPrimary: true
        }],
        isActive: true,
        isFeatured: true,
        tags: ['accessoire', 'tapis', 'playmat', 'dragon']
      }
    ];
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ ${insertedProducts.length} produits ajoutés`);
    await mongoose.connection.close();
    console.log('\n🎉 Seeding terminé avec succès !');
    console.log('🔚 Connexion fermée');
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    process.exit(1);
  }
};
if (require.main === module) {
  seedAll();
}
module.exports = seedAll;
