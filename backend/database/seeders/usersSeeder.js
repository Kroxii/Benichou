const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
require('dotenv').config();
const users = [
  {
    username: 'admin',
    email: 'admin@benichou.com',
    password: 'Admin123!',
    firstName: 'Admin',
    lastName: 'Benichou',
    role: 'admin',
    isActive: true
  },
  {
    username: 'john_doe',
    email: 'john.doe@example.com',
    password: 'Password123!',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer',
    isActive: true
  },
  {
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    password: 'Password123!',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'customer',
    isActive: true
  },
  {
    username: 'mike_johnson',
    email: 'mike.johnson@example.com',
    password: 'Password123!',
    firstName: 'Mike',
    lastName: 'Johnson',
    role: 'customer',
    isActive: true
  }
];
const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/benichou');
    console.log('Connexion à MongoDB réussie');
    await User.deleteMany({});
    console.log('Utilisateurs existants supprimés');
    const insertedUsers = await User.insertMany(users);
    console.log(`${insertedUsers.length} utilisateurs ajoutés avec succès`);
    insertedUsers.forEach(user => {
      console.log(`- ${user.username} (${user.email}) - ${user.role}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding des utilisateurs:', error);
    process.exit(1);
  }
};
if (require.main === module) {
  seedUsers();
}
module.exports = seedUsers;
