const validation = {
  // Validation pour l'inscription
  validateRegister: (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;
    const errors = [];

    // Validation email
    if (!email) {
      errors.push('L\'email est requis');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Format d\'email invalide');
    }

    // Validation mot de passe
    if (!password) {
      errors.push('Le mot de passe est requis');
    } else if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre');
    }

    // Validation prénom
    if (!firstName) {
      errors.push('Le prénom est requis');
    } else if (firstName.length < 2) {
      errors.push('Le prénom doit contenir au moins 2 caractères');
    }

    // Validation nom
    if (!lastName) {
      errors.push('Le nom est requis');
    } else if (lastName.length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors
      });
    }

    next();
  },

  // Validation pour la connexion
  validateLogin: (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email) {
      errors.push('L\'email est requis');
    }

    if (!password) {
      errors.push('Le mot de passe est requis');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors
      });
    }

    next();
  },

  // Validation pour les commandes
  validateOrder: (req, res, next) => {
    const { items, shippingAddress, paymentMethod } = req.body;
    const errors = [];

    // Validation des articles
    if (!items || !Array.isArray(items) || items.length === 0) {
      errors.push('La commande doit contenir au moins un article');
    } else {
      items.forEach((item, index) => {
        if (!item.productId) {
          errors.push(`Article ${index + 1}: ID du produit requis`);
        }
        if (!item.quantity || item.quantity < 1) {
          errors.push(`Article ${index + 1}: Quantité invalide`);
        }
      });
    }

    // Validation adresse de livraison
    if (!shippingAddress) {
      errors.push('L\'adresse de livraison est requise');
    } else {
      const { firstName, lastName, address, city, postalCode, country } = shippingAddress;
      if (!firstName) errors.push('Prénom requis dans l\'adresse de livraison');
      if (!lastName) errors.push('Nom requis dans l\'adresse de livraison');
      if (!address) errors.push('Adresse requise');
      if (!city) errors.push('Ville requise');
      if (!postalCode) errors.push('Code postal requis');
      if (!country) errors.push('Pays requis');
    }

    // Validation méthode de paiement
    if (!paymentMethod) {
      errors.push('Méthode de paiement requise');
    } else if (!['card', 'paypal', 'transfer'].includes(paymentMethod)) {
      errors.push('Méthode de paiement invalide');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors
      });
    }

    next();
  },

  // Validation des paramètres de pagination
  validatePagination: (req, res, next) => {
    const { page = 1, limit = 20 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        error: 'Le numéro de page doit être un entier positif'
      });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        error: 'La limite doit être un entier entre 1 et 100'
      });
    }

    req.query.page = pageNum;
    req.query.limit = limitNum;
    next();
  }
};

module.exports = validation;
