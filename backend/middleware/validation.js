const validation = {
  // Validation pour l'inscription
  validateRegister: (req, res, next) => {
    const { email, password, firstName, lastName, username } = req.body;
    const errors = [];

    // Validation email
    if (!email) {
      errors.push('L\'email est requis');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Format d\'email invalide');
    }

    // Validation username
    if (!username) {
      errors.push('Le nom d\'utilisateur est requis');
    } else if (username.length < 3) {
      errors.push('Le nom d\'utilisateur doit contenir au moins 3 caractères');
    } else if (username.length > 50) {
      errors.push('Le nom d\'utilisateur ne peut pas dépasser 50 caractères');
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores');
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
    } else if (firstName.length > 50) {
      errors.push('Le prénom ne peut pas dépasser 50 caractères');
    }

    // Validation nom
    if (!lastName) {
      errors.push('Le nom est requis');
    } else if (lastName.length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
    } else if (lastName.length > 50) {
      errors.push('Le nom ne peut pas dépasser 50 caractères');
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
  },

  // Validation pour l'email (mot de passe oublié, renvoi de vérification)
  validateEmail: (req, res, next) => {
    const { email } = req.body;
    const errors = [];

    if (!email) {
      errors.push('L\'email est requis');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Format d\'email invalide');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors
      });
    }

    next();
  },

  // Validation pour la réinitialisation de mot de passe
  validatePasswordReset: (req, res, next) => {
    const { password } = req.body;
    const errors = [];

    if (!password) {
      errors.push('Le nouveau mot de passe est requis');
    } else if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors
      });
    }

    next();
  },

  // Validation pour le changement de mot de passe
  validatePasswordChange: (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const errors = [];

    if (!currentPassword) {
      errors.push('Le mot de passe actuel est requis');
    }

    if (!newPassword) {
      errors.push('Le nouveau mot de passe est requis');
    } else if (newPassword.length < 8) {
      errors.push('Le nouveau mot de passe doit contenir au moins 8 caractères');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      errors.push('Le nouveau mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre');
    }

    if (currentPassword === newPassword) {
      errors.push('Le nouveau mot de passe doit être différent de l\'ancien');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors
      });
    }

    next();
  },

  // Validation pour la mise à jour du profil
  validateProfileUpdate: (req, res, next) => {
    const { firstName, lastName, username, phone } = req.body;
    const errors = [];

    // Validation prénom (optionnel mais si présent doit être valide)
    if (firstName !== undefined) {
      if (!firstName || firstName.length < 2) {
        errors.push('Le prénom doit contenir au moins 2 caractères');
      } else if (firstName.length > 50) {
        errors.push('Le prénom ne peut pas dépasser 50 caractères');
      }
    }

    // Validation nom (optionnel mais si présent doit être valide)
    if (lastName !== undefined) {
      if (!lastName || lastName.length < 2) {
        errors.push('Le nom doit contenir au moins 2 caractères');
      } else if (lastName.length > 50) {
        errors.push('Le nom ne peut pas dépasser 50 caractères');
      }
    }

    // Validation username (optionnel mais si présent doit être valide)
    if (username !== undefined) {
      if (!username || username.length < 3) {
        errors.push('Le nom d\'utilisateur doit contenir au moins 3 caractères');
      } else if (username.length > 50) {
        errors.push('Le nom d\'utilisateur ne peut pas dépasser 50 caractères');
      } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        errors.push('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores');
      }
    }

    // Validation téléphone (optionnel)
    if (phone !== undefined && phone && !/^[\d\s\-\+\(\)]+$/.test(phone)) {
      errors.push('Format de téléphone invalide');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors
      });
    }

    next();
  }
};

module.exports = validation;
