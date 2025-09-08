const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

const seedProducts = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/benichou_db');
    console.log('Connexion à MongoDB réussie');

    // Récupérer les catégories existantes
    const categories = await Category.find({});
    if (categories.length === 0) {
      console.log('Aucune catégorie trouvée. Veuillez d\'abord exécuter le seeder des catégories.');
      process.exit(1);
    }

    const pokemon = categories.find(cat => cat.slug === 'pokemon');
    const yugioh = categories.find(cat => cat.slug === 'yugioh');
    const magic = categories.find(cat => cat.slug === 'magic');
    const lorcana = categories.find(cat => cat.slug === 'lorcana');
    const accessoires = categories.find(cat => cat.slug === 'accessoires');

    const products = [
      // Pokemon
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

      // Yu-Gi-Oh!
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

      // Magic: The Gathering
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

      // Lorcana
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

      // Accessoires
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

    // Supprimer les produits existants
    await Product.deleteMany({});
    console.log('Produits existants supprimés');

    // Insérer les nouveaux produits
    const insertedProducts = await Product.insertMany(products);
    console.log(`${insertedProducts.length} produits ajoutés avec succès`);

    // Afficher les produits créés
    insertedProducts.forEach(product => {
      console.log(`- ${product.name} (${product.sku}) - ${product.price}€`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding des produits:', error);
    process.exit(1);
  }
};

// Exécuter le seeder si appelé directement
if (require.main === module) {
  seedProducts();
}

module.exports = seedProducts;
