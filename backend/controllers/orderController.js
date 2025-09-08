const Order = require('../models/Order');
const Product = require('../models/Product');

const orderController = {
  // Créer une nouvelle commande
  createOrder: async (req, res) => {
    try {
      const { items, shippingAddress, billingAddress, paymentMethod } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({
          error: 'La commande doit contenir au moins un article'
        });
      }

      // Vérifier et calculer le total
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(400).json({
            error: `Produit non trouvé: ${item.productId}`
          });
        }

        if (!product.isActive) {
          return res.status(400).json({
            error: `Le produit "${product.name}" n'est plus disponible`
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            error: `Stock insuffisant pour "${product.name}". Stock disponible: ${product.stock}`
          });
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          total: itemTotal
        });
      }

      // Créer la commande
      const order = new Order({
        user: req.userId,
        items: orderItems,
        totalAmount,
        shippingAddress,
        billingAddress,
        paymentMethod,
        status: 'pending'
      });

      await order.save();

      // Mettre à jour le stock des produits
      for (const item of items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        );
      }

      // Peupler la commande avec les détails des produits
      await order.populate('items.product', 'name slug images');
      await order.populate('user', 'firstName lastName email');

      res.status(201).json({
        success: true,
        message: 'Commande créée avec succès',
        order
      });
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  // Obtenir les commandes de l'utilisateur connecté
  getUserOrders: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const orders = await Order.find({ user: req.userId })
        .populate('items.product', 'name slug images')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Order.countDocuments({ user: req.userId });

      res.json({
        success: true,
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  },

  // Obtenir une commande par ID
  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;

      const order = await Order.findOne({ _id: id, user: req.userId })
        .populate('items.product', 'name slug images')
        .populate('user', 'firstName lastName email');

      if (!order) {
        return res.status(404).json({
          error: 'Commande non trouvée'
        });
      }

      res.json({
        success: true,
        order
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur'
      });
    }
  }
};

module.exports = orderController;
