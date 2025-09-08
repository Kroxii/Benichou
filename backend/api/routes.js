const express = require('express');
const router = express.Router();

// Import des contrôleurs
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');

// Import des middlewares
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');

// Routes de documentation API
router.get('/', (req, res) => {
  res.json({
    message: 'API Benichou TCG - Endpoints disponibles',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile (requires token)'
      },
      categories: {
        getAll: 'GET /api/categories',
        getBySlug: 'GET /api/categories/:slug'
      },
      products: {
        getAll: 'GET /api/products',
        getById: 'GET /api/products/:id',
        getByCategory: 'GET /api/products/category/:categorySlug',
        search: 'GET /api/products/search?q=searchTerm'
      },
      orders: {
        create: 'POST /api/orders (requires token)',
        getUserOrders: 'GET /api/orders (requires token)',
        getById: 'GET /api/orders/:id (requires token)'
      }
    }
  });
});

// Routes d'authentification
router.post('/auth/register', validation.validateRegister, userController.register);
router.post('/auth/login', validation.validateLogin, userController.login);
router.get('/auth/profile', auth.requireAuth, userController.getProfile);

// Routes des catégories
router.get('/categories', productController.getCategories);
router.get('/categories/:slug', productController.getCategoryBySlug);

// Routes des produits
router.get('/products', productController.getAllProducts);
router.get('/products/search', productController.searchProducts);
router.get('/products/category/:categorySlug', productController.getProductsByCategory);
router.get('/products/:id', productController.getProductById);

// Routes des commandes (authentifiées)
router.post('/orders', auth.requireAuth, orderController.createOrder);
router.get('/orders', auth.requireAuth, orderController.getUserOrders);
router.get('/orders/:id', auth.requireAuth, orderController.getOrderById);

// Route de test de l'API
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'API Benichou TCG fonctionne correctement'
  });
});

module.exports = router;
