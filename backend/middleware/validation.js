const security = require('./security');

const validation = {
  // Validation pour l'inscription
  validateRegister: (req, res, next) => {
    const { email, password, firstName, lastName, username } = req.body;
    const errors = [];

    // Validation email avec sécurité renforcée
    if (!email) {
      errors.push('L\'email est requis');
    } else if (!security.validateEmail(email)) {
      errors.push('Format d\'email invalide');
    }

    // Validation username avec sécurité renforcée
    if (!username) {
      errors.push('Le nom d\'utilisateur est requis');
    } else {
      const usernameValidation = security.validateUsername(username);
      if (!usernameValidation.valid) {
        errors.push(...usernameValidation.errors);
      }
    }

    // Validation mot de passe avec sécurité renforcée
    if (!password) {
      errors.push('Le mot de passe est requis');
    } else {
      const passwordValidation = security.validatePassword(password);
      if (!passwordValidation.valid) {
        errors.push(...passwordValidation.errors);
      }
    }

    // Validation prénom avec sécurité renforcée
    if (!firstName) {
      errors.push('Le prénom est requis');
    } else {
      const nameValidation = security.validateName(firstName);
      if (!nameValidation.valid) {
        errors.push('Prénom: ' + nameValidation.errors.join(', '));
      }
    }

    // Validation nom avec sécurité renforcée
    if (!lastName) {
      errors.push('Le nom est requis');
    } else {
      const nameValidation = security.validateName(lastName);
      if (!nameValidation.valid) {
        errors.push('Nom: ' + nameValidation.errors.join(', '));
      }
    }

    if (errors.length > 0) {
      security.logSecurityEvent('INVALID_REGISTRATION_ATTEMPT', req, { errors });
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
    } else if (!security.validateEmail(email)) {
      errors.push('Format d\'email invalide');
    }

    if (!password) {
      errors.push('Le mot de passe est requis');
    } else if (typeof password !== 'string' || password.length > 128) {
      errors.push('Mot de passe invalide');
    }

    if (errors.length > 0) {
      security.logSecurityEvent('INVALID_LOGIN_ATTEMPT', req, { email, errors });
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

    // Validation des articles avec sécurité renforcée
    if (!items || !Array.isArray(items) || items.length === 0) {
      errors.push('La commande doit contenir au moins un article');
    } else if (items.length > 50) {
      errors.push('Trop d\'articles dans la commande (maximum 50)');
    } else {
      items.forEach((item, index) => {
        if (!item.productId || !security.validateObjectId(item.productId)) {
          errors.push(`Article ${index + 1}: ID du produit invalide`);
        }
        if (!security.validateQuantity(item.quantity)) {
          errors.push(`Article ${index + 1}: Quantité invalide`);
        }
        if (item.price !== undefined && !security.validatePrice(item.price)) {
          errors.push(`Article ${index + 1}: Prix invalide`);
        }
      });
    }

    // Validation adresse de livraison avec sécurité
    if (!shippingAddress) {
      errors.push('L\'adresse de livraison est requise');
    } else {
      const { firstName, lastName, address, city, postalCode, country } = shippingAddress;
      
      if (!firstName) {
        errors.push('Prénom requis dans l\'adresse de livraison');
      } else {
        const nameValidation = security.validateName(firstName);
        if (!nameValidation.valid) {
          errors.push('Prénom livraison: ' + nameValidation.errors.join(', '));
        }
      }
      
      if (!lastName) {
        errors.push('Nom requis dans l\'adresse de livraison');
      } else {
        const nameValidation = security.validateName(lastName);
        if (!nameValidation.valid) {
          errors.push('Nom livraison: ' + nameValidation.errors.join(', '));
        }
      }
      
      if (!address) {
        errors.push('Adresse requise');
      } else if (typeof address !== 'string' || address.length > 200) {
        errors.push('Adresse invalide');
      }
      
      if (!city) {
        errors.push('Ville requise');
      } else {
        const cityValidation = security.validateName(city);
        if (!cityValidation.valid) {
          errors.push('Ville: ' + cityValidation.errors.join(', '));
        }
      }
      
      if (!postalCode) {
        errors.push('Code postal requis');
      } else if (typeof postalCode !== 'string' || !/^[0-9A-Za-z\s-]{3,10}$/.test(postalCode)) {
        errors.push('Code postal invalide');
      }
      
      if (!country) {
        errors.push('Pays requis');
      } else {
        const countryValidation = security.validateName(country);
        if (!countryValidation.valid) {
          errors.push('Pays: ' + countryValidation.errors.join(', '));
        }
      }
    }

    // Validation méthode de paiement
    const validPaymentMethods = ['card', 'paypal', 'transfer'];
    if (!paymentMethod) {
      errors.push('Méthode de paiement requise');
    } else if (!validPaymentMethods.includes(paymentMethod)) {
      errors.push('Méthode de paiement invalide');
    }

    if (errors.length > 0) {
      security.logSecurityEvent('INVALID_ORDER_ATTEMPT', req, { errors });
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
