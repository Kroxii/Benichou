/**
 * 🔒 MODULE DE SÉCURITÉ BACKEND - PROTECTION CONTRE LES INJECTIONS
 * Protection complète contre XSS, SQL Injection, NoSQL Injection et autres attaques
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const DOMPurify = require('isomorphic-dompurify');
const validator = require('validator');

const security = {

  /**
   * 🛡️ SANITISATION DES CHAÎNES DE CARACTÈRES
   */
  sanitizeText: function(text) {
    if (typeof text !== 'string') {
      return '';
    }
    
    // Nettoyer les caractères dangereux et échapper les entités HTML
    return validator.escape(text.trim())
      .replace(/javascript:/gi, '') // Supprimer javascript:
      .replace(/data:/gi, '') // Supprimer data:
      .replace(/vbscript:/gi, '') // Supprimer vbscript:
      .replace(/on\w+\s*=/gi, '') // Supprimer les événements onclick, onload, etc.
      .substring(0, 1000); // Limiter la longueur
  },

  /**
   * 🛡️ SANITISATION HTML STRICTE
   */
  sanitizeHTML: function(html) {
    if (typeof html !== 'string') {
      return '';
    }
    
    // Utiliser DOMPurify pour nettoyer le HTML
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span'],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM_IMPORT: false
    });
  },

  /**
   * 🛡️ VALIDATION STRICTE DES EMAILS
   */
  validateEmail: function(email) {
    if (typeof email !== 'string' || email.length > 254) {
      return false;
    }
    
    return validator.isEmail(email, {
      domain_specific_validation: true,
      blacklisted_chars: '<>"\'/\\&;'
    });
  },

  /**
   * 🛡️ VALIDATION DES MOTS DE PASSE
   */
  validatePassword: function(password) {
    if (typeof password !== 'string') {
      return { valid: false, errors: ['Le mot de passe doit être une chaîne de caractères'] };
    }

    const errors = [];
    
    if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }
    
    if (password.length > 128) {
      errors.push('Le mot de passe ne peut pas dépasser 128 caractères');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }
    
    // Vérifier les caractères dangereux
    if (/[<>'"&;\\]/.test(password)) {
      errors.push('Le mot de passe contient des caractères interdits');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * 🛡️ PROTECTION CONTRE L'INJECTION NOSQL
   */
  sanitizeMongoQuery: function(query) {
    if (typeof query !== 'object' || query === null) {
      return {};
    }
    
    const sanitized = {};
    
    for (const [key, value] of Object.entries(query)) {
      // Bloquer les opérateurs MongoDB dangereux
      if (key.startsWith('$') || key.includes('.')) {
        continue;
      }
      
      // Sanitiser la clé
      const cleanKey = this.sanitizeText(key);
      
      if (typeof value === 'string') {
        sanitized[cleanKey] = this.sanitizeText(value);
      } else if (typeof value === 'number') {
        sanitized[cleanKey] = isNaN(value) ? 0 : value;
      } else if (typeof value === 'boolean') {
        sanitized[cleanKey] = Boolean(value);
      } else if (Array.isArray(value)) {
        sanitized[cleanKey] = value.map(item => 
          typeof item === 'string' ? this.sanitizeText(item) : item
        );
      }
    }
    
    return sanitized;
  },

  /**
   * 🛡️ VALIDATION DES NOMS D'UTILISATEUR
   */
  validateUsername: function(username) {
    if (typeof username !== 'string') {
      return { valid: false, errors: ['Le nom d\'utilisateur doit être une chaîne de caractères'] };
    }

    const errors = [];
    
    if (username.length < 3) {
      errors.push('Le nom d\'utilisateur doit contenir au moins 3 caractères');
    }
    
    if (username.length > 50) {
      errors.push('Le nom d\'utilisateur ne peut pas dépasser 50 caractères');
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores');
    }
    
    // Vérifier les noms interdits
    const forbiddenNames = ['admin', 'root', 'administrator', 'test', 'user', 'null', 'undefined'];
    if (forbiddenNames.includes(username.toLowerCase())) {
      errors.push('Ce nom d\'utilisateur est réservé');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * 🛡️ VALIDATION DES NOMS/PRÉNOMS
   */
  validateName: function(name) {
    if (typeof name !== 'string') {
      return { valid: false, errors: ['Le nom doit être une chaîne de caractères'] };
    }

    const errors = [];
    
    if (name.length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
    }
    
    if (name.length > 50) {
      errors.push('Le nom ne peut pas dépasser 50 caractères');
    }
    
    // Autoriser uniquement les lettres, espaces, apostrophes et tirets
    if (!/^[a-zA-ZÀ-ÿ\s'\-]+$/.test(name)) {
      errors.push('Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * 🛡️ VALIDATION DES PRIX
   */
  validatePrice: function(price) {
    const numPrice = parseFloat(price);
    return !isNaN(numPrice) && numPrice >= 0 && numPrice <= 999999.99;
  },

  /**
   * 🛡️ VALIDATION DES QUANTITÉS
   */
  validateQuantity: function(quantity) {
    const numQuantity = parseInt(quantity);
    return !isNaN(numQuantity) && numQuantity >= 0 && numQuantity <= 9999;
  },

  /**
   * 🛡️ SÉCURISATION DES DONNÉES DE REQUÊTE
   */
  secureRequestData: function(data) {
    if (typeof data !== 'object' || data === null) {
      return {};
    }
    
    const securedData = {};
    
    for (const [key, value] of Object.entries(data)) {
      // Sanitiser la clé
      const cleanKey = this.sanitizeText(key);
      
      if (typeof value === 'string') {
        securedData[cleanKey] = this.sanitizeText(value);
      } else if (typeof value === 'number') {
        securedData[cleanKey] = isNaN(value) ? 0 : value;
      } else if (typeof value === 'boolean') {
        securedData[cleanKey] = Boolean(value);
      } else if (Array.isArray(value)) {
        securedData[cleanKey] = value.map(item => 
          typeof item === 'string' ? this.sanitizeText(item) : item
        );
      }
    }
    
    return securedData;
  },

  /**
   * 🛡️ MIDDLEWARE DE SÉCURITÉ GÉNÉRAL
   */
  securityMiddleware: function() {
    return [
      // Protection Helmet
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "https://code.jquery.com", "https://cdn.jsdelivr.net", "https://code.iconify.design"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
          },
        },
        crossOriginEmbedderPolicy: false
      }),
      
      // Rate limiting
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limite chaque IP à 100 requêtes par windowMs
        message: {
          error: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
        },
        standardHeaders: true,
        legacyHeaders: false,
      })
    ];
  },

  /**
   * 🛡️ MIDDLEWARE DE SANITISATION DES REQUÊTES
   */
  sanitizeRequest: function(req, res, next) {
    // Sanitiser le body
    if (req.body && typeof req.body === 'object') {
      req.body = security.secureRequestData(req.body);
    }
    
    // Sanitiser les query params
    if (req.query && typeof req.query === 'object') {
      req.query = security.secureRequestData(req.query);
    }
    
    // Sanitiser les params
    if (req.params && typeof req.params === 'object') {
      req.params = security.secureRequestData(req.params);
    }
    
    next();
  },

  /**
   * 🛡️ PROTECTION CONTRE LES INJECTIONS NOSQL
   */
  antiNoSQLInjection: function(req, res, next) {
    // Vérifier les opérateurs MongoDB dangereux dans le body
    if (req.body && typeof req.body === 'object') {
      req.body = security.sanitizeMongoQuery(req.body);
    }
    
    // Vérifier les query params
    if (req.query && typeof req.query === 'object') {
      req.query = security.sanitizeMongoQuery(req.query);
    }
    
    next();
  },

  /**
   * 🛡️ VALIDATION STRICTE DES IDS MONGODB
   */
  validateObjectId: function(id) {
    if (typeof id !== 'string') {
      return false;
    }
    
    // Vérifier le format ObjectId de MongoDB
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
  },

  /**
   * 🛡️ NETTOYAGE DES HEADERS DANGEREUX
   */
  cleanHeaders: function(req, res, next) {
    // Supprimer les headers potentiellement dangereux
    delete req.headers['x-forwarded-host'];
    delete req.headers['x-forwarded-server'];
    delete req.headers['x-real-ip'];
    
    // Ajouter des headers de sécurité
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    next();
  },

  /**
   * 🛡️ VALIDATION DES TAILLES DE FICHIERS
   */
  validateFileSize: function(maxSize = 5 * 1024 * 1024) { // 5MB par défaut
    return function(req, res, next) {
      if (req.file && req.file.size > maxSize) {
        return res.status(400).json({
          error: 'Fichier trop volumineux'
        });
      }
      next();
    };
  },

  /**
   * 🛡️ JOURNAL DE SÉCURITÉ
   */
  logSecurityEvent: function(event, req, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
      details: details
    };
    
    console.warn('🚨 SECURITY EVENT:', JSON.stringify(logEntry, null, 2));
  }
};

module.exports = security;
