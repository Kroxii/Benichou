const Product = require('../models/Product');
const Category = require('../models/Category');
const security = require('../middleware/security');

const productController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find({ isActive: true })
        .sort({ sortOrder: 1 })
        .select('name description slug sortOrder');

      res.json({
        success: true,
        categories
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  getCategoryBySlug: async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await Category.findOne({ slug, isActive: true });

      if (!category) {
        return res.status(404).json({
          error: 'Catégorie non trouvée'
        });
      }

      res.json({
        success: true,
        category
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la catégorie:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const { page = 1, limit = 20, category, minPrice, maxPrice, inStock } = req.query;
      
      const filter = { isActive: true };
      
      if (category) {
        const categoryDoc = await Category.findOne({ slug: category });
        if (categoryDoc) {
          filter.category = categoryDoc._id;
        }
      }
      
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
      }
      
      if (inStock === 'true') {
        filter.stock = { $gt: 0 };
      }

      const products = await Product.find(filter)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Product.countDocuments(filter);

      res.json({
        success: true,
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validation stricte de l'ObjectId
      if (!security.validateObjectId(id)) {
        return res.status(400).json({
          error: 'ID de produit invalide'
        });
      }
      
      const product = await Product.findOne({ _id: id, isActive: true })
        .populate('category', 'name slug');

      if (!product) {
        return res.status(404).json({
          error: 'Produit non trouvé'
        });
      }

      res.json({
        success: true,
        product
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  getProductsByCategory: async (req, res) => {
    try {
      const { categorySlug } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const category = await Category.findOne({ slug: categorySlug, isActive: true });
      if (!category) {
        return res.status(404).json({
          error: 'Catégorie non trouvée'
        });
      }

      const products = await Product.find({ 
        category: category._id, 
        isActive: true 
      })
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Product.countDocuments({ 
        category: category._id, 
        isActive: true 
      });

      res.json({
        success: true,
        category,
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des produits par catégorie:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  searchProducts: async (req, res) => {
    try {
      const { q, page = 1, limit = 20 } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          error: 'Le terme de recherche doit contenir au moins 2 caractères'
        });
      }

      const searchRegex = new RegExp(q.trim(), 'i');
      const filter = {
        isActive: true,
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { tags: { $in: [searchRegex] } }
        ]
      };

      const products = await Product.find(filter)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Product.countDocuments(filter);

      res.json({
        success: true,
        query: q,
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erreur lors de la recherche de produits:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  }
};

module.exports = productController;
