const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

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

const seedUsers = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/benichou_db');
    console.log('Connexion à MongoDB réussie');

    // Supprimer les utilisateurs existants
    await User.deleteMany({});
    console.log('Utilisateurs existants supprimés');

    // Insérer les nouveaux utilisateurs
    const insertedUsers = await User.insertMany(users);
    console.log(`${insertedUsers.length} utilisateurs ajoutés avec succès`);

    // Afficher les utilisateurs créés (sans les mots de passe)
    insertedUsers.forEach(user => {
      console.log(`- ${user.username} (${user.email}) - ${user.role}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding des utilisateurs:', error);
    process.exit(1);
  }
};

// Exécuter le seeder si appelé directement
if (require.main === module) {
  seedUsers();
}

module.exports = seedUsers;
