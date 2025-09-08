const mongoose = require('mongoose');
const Category = require('./models/Category');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();
const showData = async () => {
  try {
    console.log('🔍 Affichage des données de la base MongoDB...\n');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/benichou');
    console.log('✅ Connexion à MongoDB réussie\n');
    console.log('📂 CATÉGORIES:');
    const categories = await Category.find({}).sort({ sortOrder: 1 });
    categories.forEach(cat => {
      console.log(`  ${cat.sortOrder}. ${cat.name} (${cat.slug}) - ${cat.isActive ? '✅' : '❌'}`);
    });
    console.log('\n👥 UTILISATEURS:');
    const users = await User.find({}).select('-password');
    users.forEach(user => {
      console.log(`  ${user.username} (${user.email}) - ${user.role} - ${user.isActive ? '✅' : '❌'}`);
    });
    console.log('\n🛍️ PRODUITS:');
    const products = await Product.find({}).populate('category', 'name slug');
    products.forEach(product => {
      const featured = product.isFeatured ? '⭐' : '';
      const active = product.isActive ? '✅' : '❌';
      console.log(`  ${product.name} - ${product.price}€ ${featured} ${active}`);
      console.log(`    Catégorie: ${product.category.name} | Stock: ${product.stock} | SKU: ${product.sku}`);
      console.log(`    Tags: ${product.tags.join(', ')}`);
      console.log('');
    });
    console.log('📊 STATISTIQUES:');
    console.log(`  Catégories actives: ${categories.filter(c => c.isActive).length}/${categories.length}`);
    console.log(`  Utilisateurs actifs: ${users.filter(u => u.isActive).length}/${users.length}`);
    console.log(`  Produits actifs: ${products.filter(p => p.isActive).length}/${products.length}`);
    console.log(`  Produits en vedette: ${products.filter(p => p.isFeatured).length}/${products.length}`);
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    console.log(`  Stock total: ${totalStock} unités`);
    console.log(`  Valeur du stock: ${totalValue.toFixed(2)}€`);
    await mongoose.connection.close();
    console.log('\n🔚 Connexion fermée');
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};
if (require.main === module) {
  showData();
}
module.exports = showData;
